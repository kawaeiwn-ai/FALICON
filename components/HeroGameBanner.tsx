"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Play, Coins } from "lucide-react";

type FloatingCoin = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
  phase: number;
};

const COIN_COUNT = 18;

function createCoins(width: number, height: number): FloatingCoin[] {
  return Array.from({ length: COIN_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 6 + Math.random() * 10,
    speed: 12 + Math.random() * 18,
    drift: (Math.random() - 0.5) * 14,
    phase: Math.random() * Math.PI * 2,
  }));
}

/**
 * A lightweight canvas backdrop: a handful of soft gold circles drifting
 * upward. It sits behind a CSS `backdrop-blur` layer, which is what actually
 * produces the glassmorphism look — the canvas itself stays intentionally
 * simple (no images, no physics) so it costs almost nothing to run
 * alongside the rest of the page.
 */
function AnimatedBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const coinsRef = useRef<FloatingCoin[]>([]);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    function resize() {
      const el = canvas;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      el.width = width * dpr;
      el.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      coinsRef.current = createCoins(width, height);
    }

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    function step(timestamp: number) {
      if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 1 / 30);
      lastTimeRef.current = timestamp;

      ctx!.clearRect(0, 0, width, height);

      for (const coin of coinsRef.current) {
        coin.y -= coin.speed * dt;
        coin.phase += dt * 1.4;
        const x = coin.x + Math.sin(coin.phase) * coin.drift;

        if (coin.y < -20) {
          coin.y = height + 20;
          coin.x = Math.random() * width;
        }

        const gradient = ctx!.createRadialGradient(
          x,
          coin.y,
          0,
          x,
          coin.y,
          coin.radius
        );
        gradient.addColorStop(0, "rgba(212,175,55,0.9)");
        gradient.addColorStop(1, "rgba(212,175,55,0)");
        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        ctx!.arc(x, coin.y, coin.radius, 0, Math.PI * 2);
        ctx!.fill();
      }

      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      lastTimeRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

export default function HeroGameBanner() {
  return (
    <section className="relative overflow-hidden border-b border-hairline">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-deep via-obsidian to-slate-deep" />
      <AnimatedBackdrop />
      <div className="absolute inset-0 backdrop-blur-2xl" />
      <div className="absolute inset-0 bg-obsidian/40" />

      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-xl rounded-lg border border-white/10 bg-slate-900/60 p-8 text-center backdrop-blur-xl md:p-12">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-champagne/30 bg-champagne/10 px-4 py-1.5">
            <Coins size={14} className="text-champagne" />
            <span className="font-body text-xs text-champagne">
              Novice Saver → Institutional Sage
            </span>
          </div>

          <h1 className="mt-6 font-display text-3xl leading-tight text-ivory md:text-4xl">
            Learn to invest by playing the Falcon platformer quest.
          </h1>
          <p className="mt-4 font-body text-sm leading-relaxed text-mute">
            Run, jump, and collect coins across three knowledge tiers.
            Every chest you open tests something a real investor should
            know — and pays out in coins toward your rank.
          </p>

          <Link
            href="/game"
            className="group relative mt-8 inline-flex items-center gap-2 overflow-hidden rounded-md border border-champagne bg-champagne/10 px-7 py-3.5 font-body text-sm font-medium text-champagne transition-all duration-300 hover:bg-champagne/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]"
          >
            <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[250%] -skew-x-12 bg-white/20 opacity-0 transition-transform duration-500 group-hover:translate-x-[350%] group-hover:opacity-100" />
            <Play size={16} className="fill-champagne" />
            Play platformer quest
          </Link>
        </div>
      </div>
    </section>
  );
}
