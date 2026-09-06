"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { QUESTIONS, TIER_LABEL, type QuizTier, type QuizQuestion } from "@/lib/quizData";

type Rect = { x: number; y: number; w: number; h: number };

type Platform = Rect;

type Coin = Rect & { id: string; collected: boolean };

type Chest = Rect & {
  id: string;
  tier: QuizTier;
  opened: boolean;
  question: QuizQuestion;
};

const GRAVITY = 1800; // px/s^2
const MOVE_SPEED = 260; // px/s
const JUMP_VELOCITY = -640; // px/s
const CANVAS_W = 900;
const CANVAS_H = 480;
const PLAYER_W = 28;
const PLAYER_H = 36;
const GROUND_Y = CANVAS_H - 48;

function buildLevel() {
  const platforms: Platform[] = [
    { x: 0, y: GROUND_Y, w: CANVAS_W * 3, h: 48 },
    { x: 340, y: GROUND_Y - 110, w: 140, h: 20 },
    { x: 560, y: GROUND_Y - 190, w: 140, h: 20 },
    { x: 820, y: GROUND_Y - 110, w: 140, h: 20 },
    { x: 1080, y: GROUND_Y - 220, w: 160, h: 20 },
    { x: 1380, y: GROUND_Y - 130, w: 160, h: 20 },
    { x: 1650, y: GROUND_Y - 230, w: 160, h: 20 },
  ];

  const coins: Coin[] = [
    { id: "c1", x: 380, y: GROUND_Y - 150, w: 18, h: 18, collected: false },
    { id: "c2", x: 600, y: GROUND_Y - 230, w: 18, h: 18, collected: false },
    { id: "c3", x: 860, y: GROUND_Y - 150, w: 18, h: 18, collected: false },
    { id: "c4", x: 1130, y: GROUND_Y - 260, w: 18, h: 18, collected: false },
    { id: "c5", x: 1420, y: GROUND_Y - 170, w: 18, h: 18, collected: false },
    { id: "c6", x: 1690, y: GROUND_Y - 270, w: 18, h: 18, collected: false },
  ];

  const beginnerQ = QUESTIONS.filter((q) => q.tier === "beginner");
  const ethicsQ = QUESTIONS.filter((q) => q.tier === "ethics");
  const expertQ = QUESTIONS.filter((q) => q.tier === "expert");

  const chests: Chest[] = [
    {
      id: "chest-beginner",
      tier: "beginner",
      x: 260,
      y: GROUND_Y - 40,
      w: 34,
      h: 32,
      opened: false,
      question: beginnerQ[0]!,
    },
    {
      id: "chest-ethics",
      tier: "ethics",
      x: 900,
      y: GROUND_Y - 40,
      w: 34,
      h: 32,
      opened: false,
      question: ethicsQ[0]!,
    },
    {
      id: "chest-expert",
      tier: "expert",
      x: 1600,
      y: GROUND_Y - 40,
      w: 34,
      h: 32,
      opened: false,
      question: expertQ[0]!,
    },
  ];

  return { platforms, coins, chests, levelWidth: 1900 };
}

function rectsOverlap(a: Rect, b: Rect) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export default function FinancialPlatformer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const levelRef = useRef(buildLevel());
  const cameraXRef = useRef(0);

  const playerRef = useRef({
    x: 60,
    y: GROUND_Y - PLAYER_H,
    vx: 0,
    vy: 0,
    onGround: false,
    facing: 1 as 1 | -1,
  });

  const keysRef = useRef({ left: false, right: false, jump: false });

  const [coinCount, setCoinCount] = useState(0);
  const [activeChest, setActiveChest] = useState<Chest | null>(null);
  const [answerState, setAnswerState] = useState<{
    selected: number | null;
    revealed: boolean;
  }>({ selected: null, revealed: false });
  const [bonusMessage, setBonusMessage] = useState<string | null>(null);

  const pausedRef = useRef(false);
  useEffect(() => {
    pausedRef.current = activeChest !== null;
  }, [activeChest]);

  const respawn = useCallback(() => {
    const player = playerRef.current;
    player.x = 60;
    player.y = GROUND_Y - PLAYER_H;
    player.vx = 0;
    player.vy = 0;
    player.onGround = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (pausedRef.current) return;
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") keysRef.current.left = true;
      if (k === "arrowright" || k === "d") keysRef.current.right = true;
      if (k === "arrowup" || k === "w" || k === " ") {
        keysRef.current.jump = true;
        e.preventDefault();
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") keysRef.current.left = false;
      if (k === "arrowright" || k === "d") keysRef.current.right = false;
      if (k === "arrowup" || k === "w" || k === " ") keysRef.current.jump = false;
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    function step(timestamp: number) {
      // TypeScript can't carry the `if (!ctx) return;` narrowing from the
      // outer scope into this nested function, so re-bind a definitely-
      // non-null reference here rather than sprinkling `!` everywhere below.
      const context = ctx;

      if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
      const rawDelta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;
      const dt = Math.min(rawDelta, 1 / 30);

      const { platforms, coins, chests, levelWidth } = levelRef.current;
      const player = playerRef.current;

      if (!pausedRef.current) {
        if (keysRef.current.left && !keysRef.current.right) {
          player.vx = -MOVE_SPEED;
          player.facing = -1;
        } else if (keysRef.current.right && !keysRef.current.left) {
          player.vx = MOVE_SPEED;
          player.facing = 1;
        } else {
          player.vx = 0;
        }

        if (keysRef.current.jump && player.onGround) {
          player.vy = JUMP_VELOCITY;
          player.onGround = false;
        }

        player.vy += GRAVITY * dt;

        player.x += player.vx * dt;
        player.x = Math.max(0, Math.min(player.x, levelWidth - PLAYER_W));

        player.y += player.vy * dt;

        player.onGround = false;
        const playerRect: Rect = { x: player.x, y: player.y, w: PLAYER_W, h: PLAYER_H };
        for (const platform of platforms) {
          if (rectsOverlap(playerRect, platform)) {
            const prevBottom = player.y + PLAYER_H - player.vy * dt;
            if (player.vy >= 0 && prevBottom <= platform.y + 1) {
              player.y = platform.y - PLAYER_H;
              player.vy = 0;
              player.onGround = true;
              playerRect.y = player.y;
            } else if (player.vy < 0) {
              player.y = platform.y + platform.h;
              player.vy = 0;
              playerRect.y = player.y;
            }
          }
        }

        if (player.y > CANVAS_H + 200) {
          respawn();
        }

        for (const coin of coins) {
          if (!coin.collected && rectsOverlap(playerRect, coin)) {
            coin.collected = true;
            setCoinCount((c) => c + 1);
          }
        }

        for (const chest of chests) {
          if (!chest.opened && rectsOverlap(playerRect, chest)) {
            chest.opened = true;
            setActiveChest(chest);
            setAnswerState({ selected: null, revealed: false });
          }
        }

        const targetCamera = Math.max(
          0,
          Math.min(player.x - CANVAS_W / 2, levelWidth - CANVAS_W)
        );
        cameraXRef.current = targetCamera;
      }

      // --- draw ---
      context.clearRect(0, 0, CANVAS_W, CANVAS_H);
      const grad = context.createLinearGradient(0, 0, 0, CANVAS_H);
      grad.addColorStop(0, "#0B0F17");
      grad.addColorStop(1, "#111827");
      context.fillStyle = grad;
      context.fillRect(0, 0, CANVAS_W, CANVAS_H);

      const camX = cameraXRef.current;

      context.fillStyle = "#161E2C";
      for (const platform of platforms) {
        context.fillRect(platform.x - camX, platform.y, platform.w, platform.h);
        context.strokeStyle = "rgba(212,175,55,0.35)";
        context.lineWidth = 1;
        context.strokeRect(platform.x - camX, platform.y, platform.w, platform.h);
      }

      for (const coin of coins) {
        if (coin.collected) continue;
        context.beginPath();
        context.fillStyle = "#D4AF37";
        context.arc(
          coin.x - camX + coin.w / 2,
          coin.y + coin.h / 2,
          coin.w / 2,
          0,
          Math.PI * 2
        );
        context.fill();
      }

      for (const chest of chests) {
        context.fillStyle = chest.opened ? "#1F9D6B" : "#D4AF37";
        context.fillRect(chest.x - camX, chest.y, chest.w, chest.h);
        context.fillStyle = "#0B0F17";
        context.font = "10px sans-serif";
        context.textAlign = "center";
        context.fillText(
          chest.opened ? "done" : "?",
          chest.x - camX + chest.w / 2,
          chest.y + chest.h / 2 + 4
        );
      }

      context.fillStyle = player.facing === 1 ? "#3FBE8C" : "#D4AF37";
      context.fillRect(player.x - camX, player.y, PLAYER_W, PLAYER_H);

      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      lastTimeRef.current = null;
    };
  }, [respawn]);

  const leftBtnRef = useRef<HTMLButtonElement | null>(null);
  const rightBtnRef = useRef<HTMLButtonElement | null>(null);
  const jumpBtnRef = useRef<HTMLButtonElement | null>(null);

  function pressDpad(dir: "left" | "right" | "jump", value: boolean) {
    keysRef.current[dir] = value;
  }

  // Touch listeners are attached natively with { passive: false } so that
  // preventDefault() genuinely blocks scroll/pinch-zoom while the on-screen
  // controls are used — JSX onTouchStart/onTouchEnd handlers are bound
  // passively by React and cannot reliably preventDefault().
  useEffect(() => {
    const bindings: { el: HTMLButtonElement | null; dir: "left" | "right" | "jump" }[] = [
      { el: leftBtnRef.current, dir: "left" },
      { el: rightBtnRef.current, dir: "right" },
      { el: jumpBtnRef.current, dir: "jump" },
    ];

    const cleanups: (() => void)[] = [];

    for (const { el, dir } of bindings) {
      if (!el) continue;

      const onStart = (e: TouchEvent) => {
        e.preventDefault();
        pressDpad(dir, true);
      };
      const onEnd = (e: TouchEvent) => {
        e.preventDefault();
        pressDpad(dir, false);
      };

      el.addEventListener("touchstart", onStart, { passive: false });
      el.addEventListener("touchend", onEnd, { passive: false });
      el.addEventListener("touchcancel", onEnd, { passive: false });

      cleanups.push(() => {
        el.removeEventListener("touchstart", onStart);
        el.removeEventListener("touchend", onEnd);
        el.removeEventListener("touchcancel", onEnd);
      });
    }

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, []);

  function confirmChestAnswer() {
    if (!activeChest || answerState.selected === null) return;
    setAnswerState((s) => ({ ...s, revealed: true }));
    if (answerState.selected === activeChest.question.correctIndex) {
      setCoinCount((c) => c + 3);
      setBonusMessage("+3 bonus coins");
    } else {
      setBonusMessage(null);
    }
  }

  function closeChest() {
    setActiveChest(null);
    setAnswerState({ selected: null, revealed: false });
    setBonusMessage(null);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between font-body text-sm text-ivory">
        <span>Coins collected</span>
        <span className="tabular font-display text-lg text-champagne">{coinCount}</span>
      </div>

      <div className="hairline overflow-hidden rounded-md bg-slate-panel">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="block h-auto w-full touch-none"
          aria-label="Financial platformer game canvas"
        />
      </div>

      <p className="mt-4 font-body text-xs text-mute">
        Arrow keys or WASD to move and jump. On touch devices, use the controls
        below. Walk into a gold chest to answer a question and earn bonus
        coins.
      </p>

      <div className="mt-6 flex items-center justify-between md:hidden">
        <div className="flex gap-3">
          <button
            ref={leftBtnRef}
            aria-label="Move left"
            className="hairline flex h-14 w-14 touch-none select-none items-center justify-center rounded-md bg-slate-panel text-xl text-ivory active:bg-champagne/10"
            onMouseDown={() => pressDpad("left", true)}
            onMouseUp={() => pressDpad("left", false)}
            onMouseLeave={() => pressDpad("left", false)}
          >
            ←
          </button>
          <button
            ref={rightBtnRef}
            aria-label="Move right"
            className="hairline flex h-14 w-14 touch-none select-none items-center justify-center rounded-md bg-slate-panel text-xl text-ivory active:bg-champagne/10"
            onMouseDown={() => pressDpad("right", true)}
            onMouseUp={() => pressDpad("right", false)}
            onMouseLeave={() => pressDpad("right", false)}
          >
            →
          </button>
        </div>
        <button
          ref={jumpBtnRef}
          aria-label="Jump"
          className="flex h-14 w-14 touch-none select-none items-center justify-center rounded-md border border-champagne/40 bg-champagne/10 text-sm text-champagne active:bg-champagne/20"
          onMouseDown={() => pressDpad("jump", true)}
          onMouseUp={() => pressDpad("jump", false)}
          onMouseLeave={() => pressDpad("jump", false)}
        >
          Jump
        </button>
      </div>

      {activeChest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <div className="hairline w-full max-w-md rounded-md bg-slate-panel p-7">
            <p className="font-body text-xs text-champagne">
              {TIER_LABEL[activeChest.tier]}
            </p>
            <h3 className="mt-3 font-display text-xl text-ivory">
              {activeChest.question.prompt}
            </h3>

            <div className="mt-5 space-y-2">
              {activeChest.question.options.map((option, index) => {
                const isSelected = answerState.selected === index;
                const isCorrect = index === activeChest.question.correctIndex;
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
                    onClick={() =>
                      setAnswerState((s) => ({ ...s, selected: index }))
                    }
                    className={`w-full rounded-md border px-4 py-3 text-left font-body text-sm text-ivory ${cls}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {answerState.revealed && (
              <p className="mt-4 font-body text-sm leading-relaxed text-mute">
                {activeChest.question.explanation}
                {bonusMessage ? (
                  <span className="mt-2 block text-champagne">{bonusMessage}</span>
                ) : null}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              {!answerState.revealed ? (
                <button
                  onClick={confirmChestAnswer}
                  disabled={answerState.selected === null}
                  className="rounded-sm border border-champagne bg-champagne/10 px-5 py-2 font-body text-sm text-champagne disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Confirm answer
                </button>
              ) : (
                <button
                  onClick={closeChest}
                  className="rounded-sm border border-champagne bg-champagne/10 px-5 py-2 font-body text-sm text-champagne"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
