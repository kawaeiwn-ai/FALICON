// This project has no backend/database wired up, so the "feed" here is a
// deterministic, in-memory seed generator rather than a real API. It exists
// to demonstrate the pagination/optimistic-update architecture the module
// is built around — swapping this for a real fetch (Supabase, REST, etc.)
// means replacing only `fetchPostPage` below; every component that consumes
// it already treats posts as arriving asynchronously, page by page.

export type Comment = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
};

export type Post = {
  id: string;
  author: string;
  avatarInitials: string;
  tierBadge: string;
  content: string;
  imageDataUrl?: string;
  likeCount: number;
  liked: boolean;
  bookmarked: boolean;
  comments: Comment[];
  createdAt: string;
};

const AUTHORS = [
  { name: "Amara Chen", initials: "AC", tier: "Strategic Investor" },
  { name: "Theo Marsh", initials: "TM", tier: "Macro Mastermind" },
  { name: "Priya Nair", initials: "PN", tier: "Novice Saver" },
  { name: "Idris Salah", initials: "IS", tier: "Institutional Sage" },
  { name: "Lena Kowalski", initials: "LK", tier: "Strategic Investor" },
];

const SEED_CONTENT = [
  "Finally hit my 24-month emergency fund goal — moving the next contribution into index funds starting this week.",
  "Reminder to myself: a 15% drawdown is not a reason to abandon a 15-year plan. Rebalanced instead of panic-selling today.",
  "Question tier in the assessment humbled me on options greeks. Delta and gamma are going on my weekend reading list.",
  "Six months of dollar-cost averaging into the same three funds. Boring, and that's exactly the point.",
  "Read a rug-pull post-mortem today — anonymous team, 48-hour liquidity lock, guaranteed weekly returns. Every box checked.",
  "Set up automatic transfers the day I get paid instead of at the end of the month. Small change, already sticking to the plan better.",
  "Sharpe ratio finally clicked for me after comparing two of my own positions side by side instead of reading it in the abstract.",
  "Five years into a taxable brokerage account and the dividends alone now cover about a third of my monthly contribution.",
];

function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function buildPost(index: number): Post {
  const author = AUTHORS[index % AUTHORS.length]!;
  const content = SEED_CONTENT[index % SEED_CONTENT.length]!;
  const likeCount = Math.floor(pseudoRandom(index * 7.1) * 140) + 3;
  const commentCount = Math.floor(pseudoRandom(index * 3.3) * 3);

  const comments: Comment[] = Array.from({ length: commentCount }, (_, c) => {
    const commentAuthor = AUTHORS[(index + c + 1) % AUTHORS.length]!;
    return {
      id: `p${index}-c${c}`,
      author: commentAuthor.name,
      body: "This is a great reminder — thanks for sharing your numbers.",
      createdAt: `${c + 1}h ago`,
    };
  });

  return {
    id: `seed-${index}`,
    author: author.name,
    avatarInitials: author.initials,
    tierBadge: author.tier,
    content,
    likeCount,
    liked: false,
    bookmarked: false,
    comments,
    createdAt: `${(index % 12) + 1}h ago`,
  };
}

const PAGE_SIZE = 6;
const TOTAL_SEED_POSTS = 42;

export type PostPage = {
  posts: Post[];
  nextCursor: number | null;
};

/**
 * Simulates a cursor-paginated API call. `cursor` is the index to start
 * from; the returned `nextCursor` is `null` once the seed data is
 * exhausted, exactly like a real paginated endpoint would report.
 */
export function fetchPostPage(cursor: number): Promise<PostPage> {
  const posts = Array.from(
    { length: Math.min(PAGE_SIZE, Math.max(0, TOTAL_SEED_POSTS - cursor)) },
    (_, i) => buildPost(cursor + i)
  );
  const nextCursor = cursor + PAGE_SIZE < TOTAL_SEED_POSTS ? cursor + PAGE_SIZE : null;

  return new Promise((resolve) => {
    setTimeout(() => resolve({ posts, nextCursor }), 350);
  });
}
