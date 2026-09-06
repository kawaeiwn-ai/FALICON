"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

export default function PostComposer({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (content: string, imageDataUrl?: string) => void;
}) {
  const [content, setContent] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!open) return null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImageDataUrl(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit() {
    const trimmed = content.trim();
    if (!trimmed) return;
    onSubmit(trimmed, imageDataUrl);
    setContent("");
    setImageDataUrl(undefined);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="hairline w-full max-w-lg rounded-md bg-slate-panel p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg text-ivory">Share with the community</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-mute hover:text-ivory"
          >
            <X size={18} />
          </button>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share a goal, a lesson, or a portfolio update…"
          rows={4}
          className="mt-4 w-full resize-none rounded-md border border-hairline bg-transparent p-3 font-body text-sm text-ivory outline-none focus:border-champagne/40"
        />

        {imageDataUrl && (
          <div className="relative mt-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageDataUrl}
              alt="Selected upload preview"
              className="max-h-64 w-full rounded-md object-cover"
            />
            <button
              onClick={() => setImageDataUrl(undefined)}
              aria-label="Remove image"
              className="absolute right-2 top-2 rounded-full bg-obsidian/80 p-1.5 text-ivory"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-sm border border-hairline px-4 py-2 font-body text-sm text-mute transition-colors hover:border-champagne/40 hover:text-ivory"
          >
            <ImagePlus size={16} />
            Add photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="rounded-sm border border-champagne bg-champagne/10 px-5 py-2 font-body text-sm text-champagne disabled:cursor-not-allowed disabled:opacity-30"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
