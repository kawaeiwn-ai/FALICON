"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { QUESTIONS, TIER_LABEL, type QuizTier, type QuizQuestion } from "@/lib/quizData";

// ---------------------------------------------------------------------------
// Tunables
// ---------------------------------------------------------------------------
const LANE_X = [-2.2, 0, 2.2] as const;
const LANE_COUNT = 3;
const LANE_SWITCH_SPEED = 12; // how fast the player lerps across lanes
const GRAVITY = 26;
const JUMP_VELOCITY = 9.5;
const SLIDE_DURATION = 0.55;
const BASE_SPEED = 11; // units/sec
const MAX_SPEED = 26;
const SPEED_RAMP = 0.06; // speed gained per unit distance travelled
const BOOST_AMOUNT = 6;
const PENALTY_AMOUNT = 5;
const PENALTY_RECOVERY = 3; // how fast a penalty decays back to base ramp

const BARRIER_POOL = 10;
const OVERHEAD_POOL = 10;
const COIN_POOL = 48;
const SIGN_POOL = 5;

const OBSTACLE_SPACING_MIN = 16;
const OBSTACLE_SPACING_MAX = 30;
const COIN_SPACING = 6;
const SIGN_SPACING = 70;

const COLLISION_Z = 0.9;
const COLLISION_LANE_EPS = 0.6;
const RECYCLE_BEHIND = 6;
const VISIBLE_AHEAD = 90;

const DIFFICULTY_EASY_MAX = 500;
const DIFFICULTY_MEDIUM_MAX = 1500;

function tierForDistance(distanceMeters: number): QuizTier {
  if (distanceMeters <= DIFFICULTY_EASY_MAX) return "beginner";
  if (distanceMeters <= DIFFICULTY_MEDIUM_MAX) return "ethics";
  return "expert";
}

type ObstacleKind = "barrier" | "overhead";

type PoolItem = {
  distance: number;
  lane: number;
  active: boolean;
};

type SignItem = PoolItem & { triggered: boolean };

type InputIntent = {
  laneDelta: number;
  jump: boolean;
  slide: boolean;
};

type PlayerState = {
  laneIndex: number;
  x: number;
  y: number;
  vy: number;
  grounded: boolean;
  sliding: boolean;
  slideTimer: number;
};

function randomLane(exclude?: number) {
  let lane = Math.floor(Math.random() * LANE_COUNT);
  if (exclude !== undefined) {
    while (lane === exclude) lane = Math.floor(Math.random() * LANE_COUNT);
  }
  return lane;
}

// ---------------------------------------------------------------------------
// A tiny stepped-gradient texture gives meshToonMaterial its cartoon "banded"
// shading. Generated on the client with a canvas — no external texture
// assets or network access required.
// ---------------------------------------------------------------------------
function useToonGradient() {
  const textureRef = useRef<THREE.Texture | null>(null);

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 4;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const bands = ["#3a3a3a", "#7a7a7a", "#b8b8b8", "#ffffff"];
      bands.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.fillRect(i, 0, 1, 1);
      });
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    textureRef.current = tex;
    return tex;
  }, []);

  useEffect(() => {
    return () => {
      textureRef.current?.dispose();
    };
  }, []);

  return texture;
}

// ---------------------------------------------------------------------------
// Player — a small procedurally-rigged low-poly character (torso, head, two
// arms, two legs as separate groups/meshes) rather than a single box, so it
// can actually pose for running, jumping, sliding, and leaning into lane
// changes. This is an original design, not a likeness of any existing game
// character.
// ---------------------------------------------------------------------------
function Player({
  stateRef,
  speedRef,
}: {
  stateRef: React.MutableRefObject<PlayerState>;
  speedRef: React.MutableRefObject<number>;
}) {
  const rootRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const armLRef = useRef<THREE.Group>(null);
  const armRRef = useRef<THREE.Group>(null);
  const legLRef = useRef<THREE.Group>(null);
  const legRRef = useRef<THREE.Group>(null);
  const runPhaseRef = useRef(0);
  const gradientMap = useToonGradient();

  useFrame((_, dt) => {
    const root = rootRef.current;
    const torso = torsoRef.current;
    const armL = armLRef.current;
    const armR = armRRef.current;
    const legL = legLRef.current;
    const legR = legRRef.current;
    if (!root || !torso || !armL || !armR || !legL || !legR) return;

    const s = stateRef.current;
    root.position.set(s.x, s.y, 0);

    const laneOffset = LANE_X[s.laneIndex]! - s.x;
    root.rotation.z = THREE.MathUtils.clamp(-laneOffset * 0.18, -0.35, 0.35);

    if (s.sliding) {
      torso.rotation.x = THREE.MathUtils.lerp(torso.rotation.x, 1.15, 0.35);
      torso.position.y = THREE.MathUtils.lerp(torso.position.y, 0.62, 0.35);
      legL.rotation.x = THREE.MathUtils.lerp(legL.rotation.x, -1.1, 0.35);
      legR.rotation.x = THREE.MathUtils.lerp(legR.rotation.x, -1.1, 0.35);
      armL.rotation.x = THREE.MathUtils.lerp(armL.rotation.x, -0.6, 0.35);
      armR.rotation.x = THREE.MathUtils.lerp(armR.rotation.x, -0.6, 0.35);
    } else if (!s.grounded) {
      torso.rotation.x = THREE.MathUtils.lerp(torso.rotation.x, 0.12, 0.3);
      torso.position.y = THREE.MathUtils.lerp(torso.position.y, 1.02, 0.3);
      legL.rotation.x = THREE.MathUtils.lerp(legL.rotation.x, -0.9, 0.3);
      legR.rotation.x = THREE.MathUtils.lerp(legR.rotation.x, 0.7, 0.3);
      armL.rotation.x = THREE.MathUtils.lerp(armL.rotation.x, -1.4, 0.3);
      armR.rotation.x = THREE.MathUtils.lerp(armR.rotation.x, -1.4, 0.3);
    } else {
      torso.rotation.x = THREE.MathUtils.lerp(torso.rotation.x, 0.05, 0.25);
      torso.position.y = THREE.MathUtils.lerp(torso.position.y, 1.02, 0.25);

      const speedFactor = 0.55 + speedRef.current / MAX_SPEED;
      runPhaseRef.current += dt * 14 * speedFactor;
      const phase = runPhaseRef.current;
      const swing = Math.sin(phase);

      legL.rotation.x = swing * 0.9;
      legR.rotation.x = -swing * 0.9;
      armL.rotation.x = -swing * 0.7;
      armR.rotation.x = swing * 0.7;
    }
  });

  return (
    <group ref={rootRef}>
      <group ref={torsoRef} position={[0, 1.02, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.32, 0.55, 4, 8]} />
          <meshToonMaterial color="#3FBE8C" gradientMap={gradientMap} />
        </mesh>
        <mesh position={[0, 0.62, 0]} castShadow>
          <sphereGeometry args={[0.26, 12, 10]} />
          <meshToonMaterial color="#E4C766" gradientMap={gradientMap} />
        </mesh>

        <group ref={armLRef} position={[-0.42, 0.22, 0]}>
          <mesh position={[0, -0.28, 0]} castShadow>
            <capsuleGeometry args={[0.09, 0.5, 4, 6]} />
            <meshToonMaterial color="#D4AF37" gradientMap={gradientMap} />
          </mesh>
        </group>
        <group ref={armRRef} position={[0.42, 0.22, 0]}>
          <mesh position={[0, -0.28, 0]} castShadow>
            <capsuleGeometry args={[0.09, 0.5, 4, 6]} />
            <meshToonMaterial color="#D4AF37" gradientMap={gradientMap} />
          </mesh>
        </group>
      </group>

      <group ref={legLRef} position={[-0.16, 0.55, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.55, 4, 6]} />
          <meshToonMaterial color="#161E2C" gradientMap={gradientMap} />
        </mesh>
      </group>
      <group ref={legRRef} position={[0.16, 0.55, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.55, 4, 6]} />
          <meshToonMaterial color="#161E2C" gradientMap={gradientMap} />
        </mesh>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Instanced obstacles (two pools: low barriers to jump, overhead bars to slide)
// ---------------------------------------------------------------------------
function ObstaclePool({
  kind,
  count,
  distanceRef,
  playerRef,
  pausedRef,
  onCollision,
}: {
  kind: ObstacleKind;
  count: number;
  distanceRef: React.MutableRefObject<number>;
  playerRef: React.MutableRefObject<PlayerState>;
  pausedRef: React.MutableRefObject<boolean>;
  onCollision: (kind: ObstacleKind) => void;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const itemsRef = useRef<PoolItem[]>(
    Array.from({ length: count }, (_, i) => ({
      distance: OBSTACLE_SPACING_MIN + i * ((OBSTACLE_SPACING_MAX + OBSTACLE_SPACING_MIN) / 2) + (kind === "overhead" ? OBSTACLE_SPACING_MAX / 2 : 0),
      lane: randomLane(),
      active: true,
    }))
  );

  // Explicit disposal safety net: React Three Fiber already disposes JSX-
  // declared geometries/materials when a mesh unmounts, but instanced pools
  // are exactly the kind of long-lived GPU resource this project wants to be
  // paranoid about, so we dispose them a second time here on unmount.
  useEffect(() => {
    const mesh = meshRef.current;
    return () => {
      mesh?.geometry?.dispose();
      const material = mesh?.material;
      if (Array.isArray(material)) material.forEach((m) => m.dispose());
      else material?.dispose();
    };
  }, []);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    if (pausedRef.current) return;

    const distance = distanceRef.current;
    const player = playerRef.current;
    const items = itemsRef.current;

    for (let i = 0; i < items.length; i++) {
      const item = items[i]!;
      const relativeZ = item.distance - distance;

      if (relativeZ < -RECYCLE_BEHIND) {
        item.distance = distance + VISIBLE_AHEAD + Math.random() * OBSTACLE_SPACING_MAX;
        item.lane = randomLane();
      } else if (
        Math.abs(relativeZ) < COLLISION_Z &&
        Math.abs(LANE_X[item.lane]! - player.x) < COLLISION_LANE_EPS
      ) {
        const clears = kind === "barrier" ? !player.grounded : player.sliding;
        if (!clears) {
          onCollision(kind);
          item.distance = distance + VISIBLE_AHEAD + Math.random() * OBSTACLE_SPACING_MAX;
          item.lane = randomLane();
        }
      }

      const z = -(item.distance - distance);
      dummy.position.set(LANE_X[item.lane]!, kind === "barrier" ? 0.4 : 1.55, z);
      dummy.rotation.set(0, 0, kind === "overhead" ? Math.PI / 2 : 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  const gradientMap = useToonGradient();
  const height = kind === "barrier" ? 0.85 : 0.4;
  const color = kind === "barrier" ? "#8A7128" : "#6B4423";

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
      {kind === "barrier" ? (
        <boxGeometry args={[1.1, height, 0.9]} />
      ) : (
        <cylinderGeometry args={[0.24, 0.24, 1.3, 8]} />
      )}
      <meshToonMaterial color={color} gradientMap={gradientMap} />
    </instancedMesh>
  );
}

// ---------------------------------------------------------------------------
// Instanced coins
// ---------------------------------------------------------------------------
function CoinPool({
  distanceRef,
  playerRef,
  pausedRef,
  onCollect,
}: {
  distanceRef: React.MutableRefObject<number>;
  playerRef: React.MutableRefObject<PlayerState>;
  pausedRef: React.MutableRefObject<boolean>;
  onCollect: () => void;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const itemsRef = useRef<PoolItem[]>(
    Array.from({ length: COIN_POOL }, (_, i) => ({
      distance: 8 + i * COIN_SPACING,
      lane: randomLane(),
      active: true,
    }))
  );

  useEffect(() => {
    const mesh = meshRef.current;
    return () => {
      mesh?.geometry?.dispose();
      const material = mesh?.material;
      if (Array.isArray(material)) material.forEach((m) => m.dispose());
      else material?.dispose();
    };
  }, []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    if (pausedRef.current) return;

    const distance = distanceRef.current;
    const player = playerRef.current;
    const items = itemsRef.current;

    for (let i = 0; i < items.length; i++) {
      const item = items[i]!;
      const relativeZ = item.distance - distance;

      if (item.active && relativeZ < -RECYCLE_BEHIND) {
        item.distance = distance + VISIBLE_AHEAD + Math.random() * 12;
        item.lane = randomLane();
        item.active = true;
      } else if (
        item.active &&
        Math.abs(relativeZ) < COLLISION_Z &&
        Math.abs(LANE_X[item.lane]! - player.x) < COLLISION_LANE_EPS
      ) {
        item.active = false;
        onCollect();
      }

      if (!item.active && relativeZ < -RECYCLE_BEHIND) {
        item.distance = distance + VISIBLE_AHEAD + Math.random() * 12;
        item.lane = randomLane();
        item.active = true;
      }

      const z = -(item.distance - distance);
      const spin = (item.distance * 0.6 + performance.now() * 0.002) % (Math.PI * 2);
      dummy.position.set(LANE_X[item.lane]!, 0.9, z);
      dummy.rotation.set(0, spin, Math.PI / 2);
      dummy.scale.setScalar(item.active ? 1 : 0.0001);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    void delta;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COIN_POOL]}>
      <cylinderGeometry args={[0.32, 0.32, 0.08, 10]} />
      <meshStandardMaterial color="#D4AF37" metalness={0.4} roughness={0.35} />
    </instancedMesh>
  );
}

// ---------------------------------------------------------------------------
// Question boxes — wooden crates sitting on the track. Few in number, so
// they're rendered as regular meshes rather than instanced.
// ---------------------------------------------------------------------------
function QuestionBoxPool({
  distanceRef,
  pausedRef,
  onTrigger,
}: {
  distanceRef: React.MutableRefObject<number>;
  pausedRef: React.MutableRefObject<boolean>;
  onTrigger: () => void;
}) {
  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const itemsRef = useRef<SignItem[]>(
    Array.from({ length: SIGN_POOL }, (_, i) => ({
      distance: SIGN_SPACING + i * SIGN_SPACING,
      lane: 1,
      active: true,
      triggered: false,
    }))
  );

  useFrame((state) => {
    if (pausedRef.current) return;
    const distance = distanceRef.current;
    const items = itemsRef.current;
    const spin = state.clock.elapsedTime * 1.4;

    for (let i = 0; i < items.length; i++) {
      const item = items[i]!;
      const group = groupRefs.current[i];
      const relativeZ = item.distance - distance;

      if (relativeZ < -RECYCLE_BEHIND) {
        item.distance = distance + SIGN_SPACING * SIGN_POOL + Math.random() * SIGN_SPACING;
        item.triggered = false;
      } else if (!item.triggered && relativeZ < COLLISION_Z && relativeZ > -COLLISION_Z) {
        item.triggered = true;
        onTrigger();
      }

      if (group) {
        group.position.set(0, 0, -(item.distance - distance));
        group.rotation.y = spin;
        group.visible = !item.triggered;
      }
    }
  });

  const gradientMap = useToonGradient();

  return (
    <>
      {itemsRef.current.map((_, i) => (
        <group key={i} ref={(el) => { groupRefs.current[i] = el; }}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <boxGeometry args={[1.1, 1.1, 1.1]} />
            <meshToonMaterial color="#8A7128" gradientMap={gradientMap} />
          </mesh>
          <Text
            position={[0, 0.6, 0.58]}
            fontSize={0.7}
            color="#0B0F17"
            anchorX="center"
            anchorY="middle"
          >
            ?
          </Text>
        </group>
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Roadside scenery — low-poly pine trees on both sides (instanced) and
// occasional tunnel arches overhead (instanced). Purely decorative: no
// collision, just recycled forward like every other pool so the corridor
// reads as endless without unbounded object counts.
// ---------------------------------------------------------------------------
const TREE_POOL = 24;
const TREE_SPACING = 9;
const TREE_SIDE_X = 4.6;

function TreeLine({
  distanceRef,
  pausedRef,
}: {
  distanceRef: React.MutableRefObject<number>;
  pausedRef: React.MutableRefObject<boolean>;
}) {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const topRef = useRef<THREE.InstancedMesh>(null);
  const bushRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const gradientMap = useToonGradient();

  const itemsRef = useRef(
    Array.from({ length: TREE_POOL }, (_, i) => ({
      distance: i * TREE_SPACING,
      side: i % 2 === 0 ? -1 : 1,
    }))
  );

  useEffect(() => {
    const trunk = trunkRef.current;
    const top = topRef.current;
    const bush = bushRef.current;
    return () => {
      trunk?.geometry?.dispose();
      top?.geometry?.dispose();
      bush?.geometry?.dispose();
      const trunkMat = trunk?.material;
      const topMat = top?.material;
      const bushMat = bush?.material;
      if (Array.isArray(trunkMat)) trunkMat.forEach((m) => m.dispose());
      else trunkMat?.dispose();
      if (Array.isArray(topMat)) topMat.forEach((m) => m.dispose());
      else topMat?.dispose();
      if (Array.isArray(bushMat)) bushMat.forEach((m) => m.dispose());
      else bushMat?.dispose();
    };
  }, []);

  return (
    <>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, TREE_POOL]}>
        <cylinderGeometry args={[0.12, 0.16, 1.2, 6]} />
        <meshToonMaterial color="#5F5E5A" gradientMap={gradientMap} />
      </instancedMesh>
      <instancedMesh ref={topRef} args={[undefined, undefined, TREE_POOL]}>
        <coneGeometry args={[0.9, 1.8, 7]} />
        <meshToonMaterial color="#27500A" gradientMap={gradientMap} />
      </instancedMesh>
      <instancedMesh ref={bushRef} args={[undefined, undefined, TREE_POOL]}>
        <sphereGeometry args={[0.4, 8, 6]} />
        <meshToonMaterial color="#3B6D11" gradientMap={gradientMap} />
      </instancedMesh>
      <TreeAnimator
        itemsRef={itemsRef}
        trunkRef={trunkRef}
        topRef={topRef}
        bushRef={bushRef}
        dummy={dummy}
        distanceRef={distanceRef}
        pausedRef={pausedRef}
      />
    </>
  );
}

function TreeAnimator({
  itemsRef,
  trunkRef,
  topRef,
  bushRef,
  dummy,
  distanceRef,
  pausedRef,
}: {
  itemsRef: React.MutableRefObject<{ distance: number; side: number }[]>;
  trunkRef: React.MutableRefObject<THREE.InstancedMesh | null>;
  topRef: React.MutableRefObject<THREE.InstancedMesh | null>;
  bushRef: React.MutableRefObject<THREE.InstancedMesh | null>;
  dummy: THREE.Object3D;
  distanceRef: React.MutableRefObject<number>;
  pausedRef: React.MutableRefObject<boolean>;
}) {
  useFrame(() => {
    const trunk = trunkRef.current;
    const top = topRef.current;
    const bush = bushRef.current;
    if (!trunk || !top || !bush) return;
    if (pausedRef.current) return;

    const distance = distanceRef.current;
    const items = itemsRef.current;

    for (let i = 0; i < items.length; i++) {
      const item = items[i]!;
      const relativeZ = item.distance - distance;

      if (relativeZ < -RECYCLE_BEHIND) {
        item.distance = distance + TREE_POOL * TREE_SPACING + Math.random() * TREE_SPACING;
      }

      const z = -(item.distance - distance);
      const x = TREE_SIDE_X * item.side;

      dummy.position.set(x, 0.6, z);
      dummy.updateMatrix();
      trunk.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x, 1.7, z);
      dummy.updateMatrix();
      top.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x * 0.78, 0.3, z + 1.4);
      dummy.updateMatrix();
      bush.setMatrixAt(i, dummy.matrix);
    }
    trunk.instanceMatrix.needsUpdate = true;
    top.instanceMatrix.needsUpdate = true;
    bush.instanceMatrix.needsUpdate = true;
  });

  return null;
}

// ---------------------------------------------------------------------------
// Ground + lane markers (single static mesh — no pooling needed)
// ---------------------------------------------------------------------------
function Ground() {
  const gradientMap = useToonGradient();
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -400]} receiveShadow>
      <planeGeometry args={[9, 900]} />
      <meshToonMaterial color="#3B2F22" gradientMap={gradientMap} />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Game world: owns the per-frame simulation loop
// ---------------------------------------------------------------------------
function GameWorld({
  playerRef,
  distanceRef,
  speedRef,
  pausedRef,
  inputRef,
  penaltyRef,
  onScoreTick,
  onCoin,
  onCollision,
  onMilestone,
}: {
  playerRef: React.MutableRefObject<PlayerState>;
  distanceRef: React.MutableRefObject<number>;
  speedRef: React.MutableRefObject<number>;
  pausedRef: React.MutableRefObject<boolean>;
  inputRef: React.MutableRefObject<InputIntent>;
  penaltyRef: React.MutableRefObject<number>;
  onScoreTick: (distance: number) => void;
  onCoin: () => void;
  onCollision: (kind: ObstacleKind) => void;
  onMilestone: () => void;
}) {
  const scoreAccumRef = useRef(0);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 1 / 30);
    const player = playerRef.current;
    const input = inputRef.current;

    if (!pausedRef.current) {
      if (input.laneDelta !== 0) {
        player.laneIndex = Math.max(
          0,
          Math.min(LANE_COUNT - 1, player.laneIndex + input.laneDelta)
        );
        input.laneDelta = 0;
      }
      if (input.jump && player.grounded && !player.sliding) {
        player.vy = JUMP_VELOCITY;
        player.grounded = false;
      }
      input.jump = false;

      if (input.slide && player.grounded && !player.sliding) {
        player.sliding = true;
        player.slideTimer = SLIDE_DURATION;
      }
      input.slide = false;

      if (player.sliding) {
        player.slideTimer -= dt;
        if (player.slideTimer <= 0) player.sliding = false;
      }

      const targetX = LANE_X[player.laneIndex]!;
      player.x += (targetX - player.x) * Math.min(1, LANE_SWITCH_SPEED * dt);

      player.vy -= GRAVITY * dt;
      player.y += player.vy * dt;
      if (player.y <= 0) {
        player.y = 0;
        player.vy = 0;
        player.grounded = true;
      }

      penaltyRef.current = Math.max(0, penaltyRef.current - PENALTY_RECOVERY * dt);
      const rampSpeed = Math.min(
        MAX_SPEED,
        BASE_SPEED + distanceRef.current * SPEED_RAMP
      );
      speedRef.current = Math.max(BASE_SPEED * 0.4, rampSpeed - penaltyRef.current);

      distanceRef.current += speedRef.current * dt;

      scoreAccumRef.current += dt;
      if (scoreAccumRef.current > 0.1) {
        scoreAccumRef.current = 0;
        onScoreTick(distanceRef.current);
      }
    }

    const camera = state.camera;
    const desiredCamX = player.x * 0.6;
    camera.position.x += (desiredCamX - camera.position.x) * Math.min(1, 6 * dt);
    camera.position.y += (4.4 + player.y * 0.3 - camera.position.y) * Math.min(1, 6 * dt);
    camera.position.z = 7;
    camera.lookAt(player.x * 0.3, 1 + player.y * 0.5, -6);
  });

  const handleCollision = useCallback(
    (kind: ObstacleKind) => {
      penaltyRef.current = Math.min(PENALTY_AMOUNT * 2, penaltyRef.current + PENALTY_AMOUNT);
      onCollision(kind);
    },
    [onCollision, penaltyRef]
  );

  return (
    <>
      <ambientLight intensity={0.7} />
      <hemisphereLight args={["#bfe3ff", "#2f5d1e", 0.8]} />
      <directionalLight
        position={[6, 12, 5]}
        intensity={1.3}
        color="#fff4d6"
        castShadow
      />
      <Ground />
      <Player stateRef={playerRef} speedRef={speedRef} />
      <ObstaclePool
        kind="barrier"
        count={BARRIER_POOL}
        distanceRef={distanceRef}
        playerRef={playerRef}
        pausedRef={pausedRef}
        onCollision={handleCollision}
      />
      <ObstaclePool
        kind="overhead"
        count={OVERHEAD_POOL}
        distanceRef={distanceRef}
        playerRef={playerRef}
        pausedRef={pausedRef}
        onCollision={handleCollision}
      />
      <CoinPool
        distanceRef={distanceRef}
        playerRef={playerRef}
        pausedRef={pausedRef}
        onCollect={onCoin}
      />
      <TreeLine distanceRef={distanceRef} pausedRef={pausedRef} />
      <QuestionBoxPool distanceRef={distanceRef} pausedRef={pausedRef} onTrigger={onMilestone} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Top-level exported component
// ---------------------------------------------------------------------------
export default function Runner3DGame() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const playerRef = useRef<PlayerState>({
    laneIndex: 1,
    x: 0,
    y: 0,
    vy: 0,
    grounded: true,
    sliding: false,
    slideTimer: 0,
  });
  const distanceRef = useRef(0);
  const speedRef = useRef(BASE_SPEED);
  const pausedRef = useRef(false);
  const inputRef = useRef<InputIntent>({ laneDelta: 0, jump: false, slide: false });
  const penaltyRef = useRef(0);
  const tierCursorRef = useRef<Record<QuizTier, number>>({
    beginner: 0,
    ethics: 0,
    expert: 0,
  });

  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [flash, setFlash] = useState<"boost" | "hit" | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<QuizQuestion | null>(null);
  const [answerState, setAnswerState] = useState<{ selected: number | null; revealed: boolean }>({
    selected: null,
    revealed: false,
  });
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    pausedRef.current = activeQuestion !== null || contextLost;
  }, [activeQuestion, contextLost]);

  const requestLane = useCallback((delta: number) => {
    inputRef.current.laneDelta = delta;
  }, []);
  const requestJump = useCallback(() => {
    inputRef.current.jump = true;
  }, []);
  const requestSlide = useCallback(() => {
    inputRef.current.slide = true;
  }, []);

  // Keyboard controls
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (pausedRef.current) return;
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") requestLane(-1);
      else if (k === "arrowright" || k === "d") requestLane(1);
      else if (k === "arrowup" || k === "w" || k === " ") {
        requestJump();
        e.preventDefault();
      } else if (k === "arrowdown" || k === "s") requestSlide();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [requestLane, requestJump, requestSlide]);

  // Touch swipe controls — bound natively with { passive: false } so
  // preventDefault() genuinely stops the page from scrolling/bouncing while
  // swiping on the canvas, which JSX onTouch* handlers cannot guarantee.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let tracking = false;
    const SWIPE_THRESHOLD = 32;

    function onTouchStart(e: TouchEvent) {
      if (pausedRef.current) return;
      const t = e.touches[0];
      if (!t) return;
      startX = t.clientX;
      startY = t.clientY;
      tracking = true;
      e.preventDefault();
    }

    function onTouchMove(e: TouchEvent) {
      if (!tracking || pausedRef.current) return;
      e.preventDefault();
    }

    function onTouchEnd(e: TouchEvent) {
      if (!tracking) return;
      tracking = false;
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      e.preventDefault();

      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
        requestLane(dx > 0 ? 1 : -1);
      } else if (Math.abs(dy) > SWIPE_THRESHOLD) {
        if (dy < 0) requestJump();
        else requestSlide();
      }
    }

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: false });
    el.addEventListener("touchcancel", onTouchEnd, { passive: false });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [requestLane, requestJump, requestSlide]);

  const handleScoreTick = useCallback((distance: number) => {
    setScore(Math.floor(distance));
  }, []);

  const handleCoin = useCallback(() => {
    setCoins((c) => c + 1);
  }, []);

  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerFlash = useCallback((kind: "boost" | "hit") => {
    setFlash(kind);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    flashTimerRef.current = setTimeout(() => setFlash(null), 350);
  }, []);

  useEffect(() => {
    return () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    };
  }, []);

  const handleCollision = useCallback(
    (_kind: ObstacleKind) => {
      void _kind;
      triggerFlash("hit");
    },
    [triggerFlash]
  );

  const handleMilestone = useCallback(() => {
    // Difficulty scales with distance travelled: 0–500m stays on
    // foundations, 501–1,500m moves to conduct/ethics questions, and
    // anything past 1,500m draws from the expert tier indefinitely.
    const tier = tierForDistance(distanceRef.current);
    const pool = QUESTIONS.filter((q) => q.tier === tier);
    const cursor = tierCursorRef.current[tier];
    const question = pool[cursor % pool.length]!;
    tierCursorRef.current[tier] = cursor + 1;
    setActiveQuestion(question);
    setAnswerState({ selected: null, revealed: false });
  }, []);

  function confirmAnswer() {
    if (!activeQuestion || answerState.selected === null) return;
    const correct = answerState.selected === activeQuestion.correctIndex;
    setAnswerState((s) => ({ ...s, revealed: true }));
    if (correct) {
      setCoins((c) => c + 5);
      penaltyRef.current = Math.max(0, penaltyRef.current - BOOST_AMOUNT);
      triggerFlash("boost");
    } else {
      triggerFlash("hit");
    }
  }

  function closeQuestion() {
    setActiveQuestion(null);
    setAnswerState({ selected: null, revealed: false });
  }

  return (
    <div ref={containerRef} className="relative touch-none select-none">
      <div className="mb-4 flex items-center justify-between font-body text-sm text-ivory">
        <span>
          Distance <span className="tabular text-champagne">{score.toLocaleString()} m</span>
        </span>
        <span>
          Coins <span className="tabular text-champagne">{coins}</span>
        </span>
      </div>

      <div className="hairline relative overflow-hidden rounded-md bg-slate-panel">
        <Canvas
          shadows
          camera={{ position: [0, 4.4, 7], fov: 60 }}
          dpr={[1, 1.5]}
          onCreated={({ gl }) => {
            const canvasEl = gl.domElement;
            const onLost = (e: Event) => {
              e.preventDefault();
              setContextLost(true);
            };
            const onRestored = () => setContextLost(false);
            canvasEl.addEventListener("webglcontextlost", onLost, false);
            canvasEl.addEventListener("webglcontextrestored", onRestored, false);
          }}
          style={{ height: 420, width: "100%" }}
        >
          <color attach="background" args={["#8FCBEF"]} />
          <fog attach="fog" args={["#bfe3ff", 26, 78]} />
          <GameWorld
            playerRef={playerRef}
            distanceRef={distanceRef}
            speedRef={speedRef}
            pausedRef={pausedRef}
            inputRef={inputRef}
            penaltyRef={penaltyRef}
            onScoreTick={handleScoreTick}
            onCoin={handleCoin}
            onCollision={handleCollision}
            onMilestone={handleMilestone}
          />
        </Canvas>

        {flash && (
          <div
            className={`pointer-events-none absolute inset-0 ${
              flash === "boost" ? "bg-emerald-gloss/15" : "bg-red-500/15"
            }`}
          />
        )}

        {contextLost && (
          <div className="absolute inset-0 flex items-center justify-center bg-obsidian/90 font-body text-sm text-ivory">
            Reconnecting graphics context…
          </div>
        )}
      </div>

      <p className="mt-4 font-body text-xs text-mute">
        Arrow keys / WASD to switch lanes, jump, and slide. On touch devices,
        swipe left/right to change lanes, swipe up to jump, swipe down to
        slide. Reach a question box to pause and answer — a correct answer
        gives a speed boost, a miss costs you speed. Question difficulty
        rises with distance: foundations to 500m, conduct and ethics to
        1,500m, expert-level beyond that.
      </p>

      {activeQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <div className="hairline w-full max-w-md rounded-md bg-slate-panel p-7">
            <p className="font-body text-xs text-champagne">
              {TIER_LABEL[activeQuestion.tier]}
            </p>
            <h3 className="mt-3 font-display text-xl text-ivory">
              {activeQuestion.prompt}
            </h3>

            <div className="mt-5 space-y-2">
              {activeQuestion.options.map((option, index) => {
                const isSelected = answerState.selected === index;
                const isCorrect = index === activeQuestion.correctIndex;
                let cls = "border-hairline";
                if (answerState.revealed && isCorrect) {
                  cls = "border-emerald-gloss bg-emerald-gloss/10";
                } else if (answerState.revealed && isSelected && !isCorrect) {
                  cls = "border-red-500/60 bg-red-500/10";
                } else if (!answerState.revealed && isSelected) {
                  cls = "border-champagne bg-champagne/10";
                }
                return (
                  <button
                    key={index}
                    disabled={answerState.revealed}
                    onClick={() => setAnswerState((s) => ({ ...s, selected: index }))}
                    className={`w-full rounded-md border px-4 py-3 text-left font-body text-sm text-ivory ${cls}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {answerState.revealed && (
              <p className="mt-4 font-body text-sm leading-relaxed text-mute">
                {activeQuestion.explanation}
                <span
                  className={`mt-2 block ${
                    answerState.selected === activeQuestion.correctIndex
                      ? "text-champagne"
                      : "text-red-400"
                  }`}
                >
                  {answerState.selected === activeQuestion.correctIndex
                    ? "+5 bonus coins and a speed boost"
                    : "Speed penalty — shake it off and keep running"}
                </span>
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              {!answerState.revealed ? (
                <button
                  onClick={confirmAnswer}
                  disabled={answerState.selected === null}
                  className="rounded-sm border border-champagne bg-champagne/10 px-5 py-2 font-body text-sm text-champagne disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Confirm answer
                </button>
              ) : (
                <button
                  onClick={closeQuestion}
                  className="rounded-sm border border-champagne bg-champagne/10 px-5 py-2 font-body text-sm text-champagne"
                >
                  Keep running
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
