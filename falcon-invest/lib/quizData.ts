export type QuizTier = "beginner" | "ethics" | "expert";

export type QuizQuestion = {
  id: string;
  tier: QuizTier;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const TIER_LABEL: Record<QuizTier, string> = {
  beginner: "Foundations of saving",
  ethics: "Conduct & discipline",
  expert: "Institutional depth",
};

export const QUESTIONS: QuizQuestion[] = [
  // ---- Beginner: saving & compound interest ----
  {
    id: "b1",
    tier: "beginner",
    prompt:
      "You invest 10,000 at a 7% annual return, reinvesting all gains. What mainly drives the growth after 20 years?",
    options: [
      "The original 10,000 alone",
      "Compound interest — returns earning returns on themselves",
      "Timing the exact day you invest",
      "Switching funds every few months",
    ],
    correctIndex: 1,
    explanation:
      "Left alone, reinvested returns start generating their own returns. Over long stretches, that compounding effect contributes far more than the original principal.",
  },
  {
    id: "b2",
    tier: "beginner",
    prompt: "Which best describes 'diversification'?",
    options: [
      "Putting all your capital into the single best idea you have",
      "Spreading capital across different assets so no one loss can sink you",
      "Buying only assets denominated in your home currency",
      "Trading frequently to capture every price swing",
    ],
    correctIndex: 1,
    explanation:
      "Diversification reduces the damage any single bad outcome can do to the whole portfolio — it doesn't guarantee higher returns, it manages risk.",
  },
  {
    id: "b3",
    tier: "beginner",
    prompt:
      "An 'emergency fund' is usually recommended before investing seriously because:",
    options: [
      "It earns higher returns than the stock market",
      "It prevents you from selling long-term investments at a bad time to cover a surprise expense",
      "Banks require it to open a brokerage account",
      "It is required by law in most countries",
    ],
    correctIndex: 1,
    explanation:
      "A cash buffer means a burst pipe or a medical bill doesn't force you to liquidate investments during a downturn, which locks in losses.",
  },
  {
    id: "b4",
    tier: "beginner",
    prompt: "Dollar-cost averaging means:",
    options: [
      "Investing a fixed amount at regular intervals regardless of price",
      "Waiting for the lowest possible price before investing anything",
      "Converting all savings into US dollars",
      "Averaging the price of only your winning trades",
    ],
    correctIndex: 0,
    explanation:
      "By investing a fixed amount on a schedule, you buy more units when prices are low and fewer when high, smoothing out your average entry cost over time.",
  },
  {
    id: "b5",
    tier: "beginner",
    prompt: "Which of these is closest to gambling rather than investing?",
    options: [
      "Holding a diversified index fund for 15 years",
      "Contributing to a retirement account every month",
      "Putting your entire savings into one coin because a stranger online said it will '10x by Friday'",
      "Rebalancing a portfolio once a year to match your target allocation",
    ],
    correctIndex: 2,
    explanation:
      "A concentrated bet on an unverified promise of overnight gains, with no research or time horizon, is speculation on someone else's story — not investing.",
  },

  // ---- Ethics / conduct ----
  {
    id: "e1",
    tier: "ethics",
    prompt: "A 'pump and dump' scheme typically works by:",
    options: [
      "A company issuing a legitimate earnings report",
      "A group hyping an asset to inflate its price, then selling into the buying they created, leaving new buyers holding losses",
      "A central bank raising interest rates",
      "An index fund rebalancing its holdings quarterly",
    ],
    correctIndex: 1,
    explanation:
      "The scheme profits from artificial hype and coordinated selling, transferring losses onto people who bought in late believing the hype was organic.",
  },
  {
    id: "e2",
    tier: "ethics",
    prompt:
      "You're down 30% on a position and feel the urge to add much more money to 'average down' out of frustration. What does disciplined conduct look like here?",
    options: [
      "Immediately doubling the position to recover losses faster",
      "Reviewing the original thesis calmly, and sizing any further action to your plan and risk limits — not to your emotions",
      "Telling other investors it's a guaranteed rebound to build support for the price",
      "Leaving the market entirely and never investing again",
    ],
    correctIndex: 1,
    explanation:
      "Ethical, disciplined investors separate a decision from the emotion of a loss. Position sizing follows a pre-set plan, not an urge to 'win back' money.",
  },
  {
    id: "e3",
    tier: "ethics",
    prompt: "A 'rug pull' in crypto most often refers to:",
    options: [
      "A regulator approving a new exchange-traded fund",
      "Project creators abandoning a token after draining its liquidity, leaving holders with a near-worthless asset",
      "A stock splitting two-for-one",
      "A wallet provider adding two-factor authentication",
    ],
    correctIndex: 1,
    explanation:
      "Because a rug pull removes the underlying liquidity, remaining holders often cannot sell at any meaningful price — recognizing the pattern early is a core defensive skill.",
  },
  {
    id: "e4",
    tier: "ethics",
    prompt:
      "Which behavior is a hallmark of market psychology getting the better of an investor?",
    options: [
      "Selling a large chunk of a position purely because everyone else is panic-selling, with no new information about the asset itself",
      "Rebalancing on a fixed schedule",
      "Reviewing a thesis after a company reports weaker earnings",
      "Holding cash reserved for a known future expense",
    ],
    correctIndex: 0,
    explanation:
      "Herding — reacting to other people's fear rather than to new facts — is one of the clearest signs that emotion, not analysis, is driving the decision.",
  },

  // ---- Expert / institutional depth ----
  {
    id: "x1",
    tier: "expert",
    prompt: "In a liquidity pool, 'impermanent loss' describes:",
    options: [
      "A permanent, unrecoverable loss of the entire deposit",
      "The gap between holding two assets separately versus supplying them to a pool, caused by the pool's price divergence from the market",
      "The trading fee charged by a decentralized exchange",
      "A tax levied on crypto withdrawals",
    ],
    correctIndex: 1,
    explanation:
      "It's 'impermanent' because it shrinks if prices converge again, but it becomes real and locked in the moment liquidity is withdrawn while prices are still diverged.",
  },
  {
    id: "x2",
    tier: "expert",
    prompt: "For an option, 'delta' measures:",
    options: [
      "The option's time to expiration in days",
      "How much the option's price is expected to move per $1 move in the underlying asset",
      "The strike price relative to the current market price",
      "The dividend yield of the underlying stock",
    ],
    correctIndex: 1,
    explanation:
      "Delta approximates the option's sensitivity to the underlying's price. A delta of 0.5 implies roughly a $0.50 move in the option per $1 move in the underlying.",
  },
  {
    id: "x3",
    tier: "expert",
    prompt:
      "The Sharpe ratio is used to evaluate an investment primarily by:",
    options: [
      "Dividing excess return over the risk-free rate by the volatility of returns",
      "Measuring total revenue growth year over year",
      "Counting the number of trades executed per month",
      "Comparing the asset's price to its all-time high",
    ],
    correctIndex: 0,
    explanation:
      "The Sharpe ratio expresses return earned per unit of volatility risk taken, letting you compare strategies with very different risk profiles on the same footing.",
  },
  {
    id: "x4",
    tier: "expert",
    prompt:
      "An inverted yield curve, where short-term rates exceed long-term rates, is most often watched as:",
    options: [
      "A guarantee that stocks will rise the same week",
      "A historically followed signal that has often preceded economic slowdowns",
      "Proof that a specific company will beat earnings",
      "A rule that sets the exact price of gold",
    ],
    correctIndex: 1,
    explanation:
      "It's a widely watched macro signal because it reflects investors demanding more compensation for near-term risk than for the long term — not a certainty, but a pattern with a long track record.",
  },
  {
    id: "x5",
    tier: "expert",
    prompt:
      "A fund's 'risk-adjusted return' matters more than its raw return mainly because:",
    options: [
      "Raw returns are always reported incorrectly",
      "Two funds can post the same raw return while one took on far more risk to get there, which matters for how repeatable and survivable that return is",
      "Risk-adjusted return is required for tax filing",
      "It removes the need for diversification entirely",
    ],
    correctIndex: 1,
    explanation:
      "A high return achieved through outsized risk-taking is far less likely to be repeatable — risk-adjustment reveals the quality of a return, not just its size.",
  },
];

export type Rank = {
  title: string;
  minPercent: number;
  description: string;
};

export const RANKS: Rank[] = [
  {
    title: "Novice Saver",
    minPercent: 0,
    description:
      "The foundations are still forming. Start with compound interest and diversification before sizing up any position.",
  },
  {
    title: "Strategic Investor",
    minPercent: 41,
    description:
      "You understand the basics and are building discipline around risk and conduct. The next step is depth on macro and instruments.",
  },
  {
    title: "Macro Mastermind",
    minPercent: 71,
    description:
      "Strong grasp of both conduct and instruments. You read risk-adjusted return the way most people read a price chart.",
  },
  {
    title: "Institutional Sage",
    minPercent: 92,
    description:
      "Near-total command of the material, from compounding to options greeks to liquidity mechanics. Rare among self-directed investors.",
  },
];

export function rankForScore(correct: number, total: number): Rank {
  const percent = (correct / total) * 100;
  let result = RANKS[0]!;
  for (const rank of RANKS) {
    if (percent >= rank.minPercent) {
      result = rank;
    }
  }
  return result;
}
