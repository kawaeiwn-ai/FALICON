"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import FalconMark from "./FalconMark";

const LINKS: { href: string; label: string }[] = [
  { href: "/stocks", label: "Equities" },
  { href: "/crypto", label: "Digital Assets" },
  { href: "/quiz", label: "Assessment" },
  { href: "/game", label: "Falcon run" },
  { href: "/runner", label: "Falcon dash" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "Philosophy" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-obsidian/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <FalconMark className="h-8 w-8" />
          <span className="font-display text-lg tracking-tight text-ivory">
            Falcon Reserve
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-body text-sm transition-colors duration-300 ${
                  active ? "text-champagne" : "text-mute hover:text-ivory"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/quiz"
            className="rounded-sm border border-champagne/40 px-4 py-2 font-body text-sm text-champagne transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:border-champagne"
          >
            Begin assessment
          </Link>
        </nav>

        <button
          className="text-ivory lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-hairline bg-slate-deep px-6 py-4 lg:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`py-2 font-body text-sm ${
                pathname === link.href ? "text-champagne" : "text-mute"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
