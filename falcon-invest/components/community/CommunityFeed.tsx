"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, Search } from "lucide-react";
import { fetchPostPage, type Post } from "@/lib/communityData";
import PostCard from "./PostCard";
import PostComposer from "./PostComposer";

const SEARCH_DEBOUNCE_MS = 300;

export default function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadNextPage = useCallback(async () => {
    if (loadingRef.current || cursor === null) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const page = await fetchPostPage(cursor);
      setPosts((prev) => [...prev, ...page.posts]);
      setCursor(page.nextCursor);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [cursor]);

  // Initial page load.
  useEffect(() => {
    loadNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Infinite scroll: observe a sentinel element and request the next page
  // only when it's actually visible, so posts render into the DOM
  // incrementally instead of the whole feed being mounted up front.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadNextPage();
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadNextPage]);

  // Debounce the search input so filtering doesn't run (and re-render the
  // whole list) on every keystroke.
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearch(searchInput.trim().toLowerCase());
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const handleToggleLike = useCallback((id: string) => {
    // Optimistic: flip the UI state immediately rather than waiting on a
    // round trip, since there's no backend to await here anyway — this is
    // the same update path a real API call would sit behind.
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likeCount: p.likeCount + (p.liked ? -1 : 1) }
          : p
      )
    );
  }, []);

  const handleToggleBookmark = useCallback((id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, bookmarked: !p.bookmarked } : p))
    );
  }, []);

  const handleAddComment = useCallback((id: string, body: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: `${id}-c${p.comments.length}-${Date.now()}`,
                  author: "You",
                  body,
                  createdAt: "just now",
                },
              ],
            }
          : p
      )
    );
  }, []);

  const handleNewPost = useCallback((content: string, imageDataUrl?: string) => {
    const newPost: Post = {
      id: `local-${Date.now()}`,
      author: "You",
      avatarInitials: "YOU",
      tierBadge: "Strategic Investor",
      content,
      imageDataUrl,
      likeCount: 0,
      liked: false,
      bookmarked: false,
      comments: [],
      createdAt: "just now",
    };
    setPosts((prev) => [newPost, ...prev]);
  }, []);

  const visiblePosts = debouncedSearch
    ? posts.filter((p) => p.content.toLowerCase().includes(debouncedSearch))
    : posts;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mute"
          />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search posts"
            className="w-full rounded-sm border border-hairline bg-transparent py-2 pl-9 pr-3 font-body text-sm text-ivory outline-none focus:border-champagne/40"
          />
        </div>

        <button
          onClick={() => setComposerOpen(true)}
          className="flex items-center justify-center gap-2 rounded-sm border border-champagne bg-champagne/10 px-5 py-2.5 font-body text-sm text-champagne transition-all duration-300 hover:bg-champagne/20"
        >
          <Plus size={16} />
          New post
        </button>
      </div>

      <div className="mt-8 space-y-5">
        {visiblePosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onToggleLike={handleToggleLike}
            onToggleBookmark={handleToggleBookmark}
            onAddComment={handleAddComment}
          />
        ))}

        {visiblePosts.length === 0 && !loading && (
          <p className="py-10 text-center font-body text-sm text-mute">
            {debouncedSearch
              ? "No posts match that search."
              : "No posts yet — be the first to share something."}
          </p>
        )}
      </div>

      <div ref={sentinelRef} className="h-1" />

      {loading && (
        <p className="mt-6 text-center font-body text-sm text-mute">
          Loading more posts…
        </p>
      )}

      {!loading && cursor === null && posts.length > 0 && (
        <p className="mt-6 text-center font-body text-xs text-mute/70">
          You've reached the end of the feed.
        </p>
      )}

      <PostComposer
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        onSubmit={handleNewPost}
      />
    </div>
  );
}
