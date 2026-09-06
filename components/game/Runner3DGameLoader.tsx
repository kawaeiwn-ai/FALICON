"use client";

import dynamic from "next/dynamic";

const Runner3DGame = dynamic(() => import("./Runner3DGame"), {
  ssr: false,
  loading: () => (
    <div className="hairline flex h-[420px] w-full items-center justify-center rounded-md bg-slate-panel">
      <p className="font-body text-sm text-mute">Loading the 3D runner…</p>
    </div>
  ),
});

export default function Runner3DGameLoader() {
  return <Runner3DGame />;
}
