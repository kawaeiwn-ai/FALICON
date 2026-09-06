"use client";

import { useState } from "react";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import type { Post } from "@/lib/communityData";

export default function PostCard({
  post,
  onToggleLike,
  onToggleBookmark,
  onAddComment,
}: {
  post: Post;
  onToggleLike: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onAddComment: (id: string, body: string) => void;
}) {
  const [showComments, setShowComments] = useState(false);
  const [draft, setDraft] = useState("");

  function submitComment() {
    const body = draft.trim();
    if (!body) return;
    onAddComment(post.id, body);
    setDraft("");
  }

  return (
    <article className="hairline rounded-md bg-slate-panel p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-champagne/15 font-body text-sm text-champagne">
          {post.avatarInitials}
        </div>
        <div>
          <p className="font-body text-sm text-ivory">{post.author}</p>
          <p className="font-body text-xs text-mute">
            {post.tierBadge} · {post.createdAt}
          </p>
        </div>
      </div>

      <p className="mt-4 font-body text-sm leading-relaxed text-ivory">
        {post.content}
      </p>

      {post.imageDataUrl && (
        // A user-supplied data URL from local file selection isn't a
        // remote asset next/image can optimize, so a plain <img> is the
        // honest choice here rather than routing it through next/image
        // for no real benefit.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.imageDataUrl}
          alt="Attached to post"
          className="mt-4 max-h-80 w-full rounded-md object-cover"
        />
      )}

      <div className="mt-5 flex items-center gap-5 border-t border-hairline pt-4">
        <button
          onClick={() => onToggleLike(post.id)}
          className={`flex items-center gap-2 font-body text-sm transition-colors ${
            post.liked ? "text-champagne" : "text-mute hover:text-ivory"
          }`}
        >
          <Heart size={16} className={post.liked ? "fill-champagne" : ""} />
          <span className="tabular">{post.likeCount}</span>
        </button>

        <button
          onClick={() => setShowComments((v) => !v)}
          className="flex items-center gap-2 font-body text-sm text-mute transition-colors hover:text-ivory"
        >
          <MessageCircle size={16} />
          <span className="tabular">{post.comments.length}</span>
        </button>

        <button
          onClick={() => onToggleBookmark(post.id)}
          className={`ml-auto flex items-center gap-2 font-body text-sm transition-colors ${
            post.bookmarked ? "text-champagne" : "text-mute hover:text-ivory"
          }`}
        >
          <Bookmark size={16} className={post.bookmarked ? "fill-champagne" : ""} />
        </button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-3 border-t border-hairline pt-4">
          {post.comments.map((comment) => (
            <div key={comment.id} className="font-body text-sm">
              <span className="text-ivory">{comment.author}</span>{" "}
              <span className="text-mute">{comment.body}</span>
              <span className="ml-2 text-xs text-mute/70">{comment.createdAt}</span>
            </div>
          ))}

          <div className="flex gap-2 pt-1">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitComment();
              }}
              placeholder="Add a comment"
              className="flex-1 rounded-sm border border-hairline bg-transparent px-3 py-2 font-body text-sm text-ivory outline-none focus:border-champagne/40"
            />
            <button
              onClick={submitComment}
              disabled={!draft.trim()}
              className="rounded-sm border border-champagne/40 px-4 py-2 font-body text-sm text-champagne disabled:cursor-not-allowed disabled:opacity-30"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
