"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, X, RotateCcw } from "lucide-react";
import { QUESTIONS, TIER_LABEL, rankForScore, type QuizTier } from "@/lib/quizData";

type Answer = {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
};

export default function QuizPage() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const total = QUESTIONS.length;
  const current = QUESTIONS[currentIndex];
  const finished = answers.length === total;

  const tierBreakdown = useMemo(() => {
    const tiers: QuizTier[] = ["beginner", "ethics", "expert"];
    return tiers.map((tier) => {
      const tierQuestions = QUESTIONS.filter((q) => q.tier === tier);
      const tierAnswers = answers.filter((a) =>
        tierQuestions.some((q) => q.id === a.questionId)
      );
      const correct = tierAnswers.filter((a) => a.correct).length;
      return { tier, correct, total: tierQuestions.length };
    });
  }, [answers]);

  const correctCount = answers.filter((a) => a.correct).length;
  const rank = rankForScore(correctCount, total);
  const percent = Math.round((correctCount / total) * 100);

  function selectOption(index: number) {
    if (revealed) return;
    setSelected(index);
  }

  function confirmAnswer() {
    if (selected === null || !current) return;
    setAnswers((prev) => [
      ...prev,
      {
        questionId: current.id,
        selectedIndex: selected,
        correct: selected === current.correctIndex,
      },
    ]);
    setRevealed(true);
  }

  function nextQuestion() {
    setSelected(null);
    setRevealed(false);
    setCurrentIndex((i) => i + 1);
  }

  function restart() {
    setStarted(false);
    setCurrentIndex(0);
    setAnswers([]);
    setSelected(null);
    setRevealed(false);
  }

  if (!started) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-24">
        <p className="font-body text-sm text-champagne">Knowledge assessment</p>
        <h1 className="mt-4 font-display text-3xl text-ivory md:text-4xl">
          Fifteen questions. Three tiers. One honest rank.
        </h1>
        <p className="mt-5 font-body text-sm leading-relaxed text-mute">
          The assessment moves from savings fundamentals, through the
          conduct and discipline that keep an investor solvent, to
          institutional-level instruments like liquidity pools and options
          greeks. There's no time limit — answer at the pace you'd want a
          real decision to take.
        </p>
        <div className="mt-8 hairline rounded-md bg-slate-panel p-6">
          <div className="flex justify-between font-body text-sm text-mute">
            <span>Foundations of saving</span>
            <span>5 questions</span>
          </div>
          <div className="mt-3 flex justify-between font-body text-sm text-mute">
            <span>Conduct &amp; discipline</span>
            <span>4 questions</span>
          </div>
          <div className="mt-3 flex justify-between font-body text-sm text-mute">
            <span>Institutional depth</span>
            <span>5 questions</span>
          </div>
        </div>
        <button
          onClick={() => setStarted(true)}
          className="mt-9 rounded-sm border border-champagne bg-champagne/10 px-6 py-3 font-body text-sm text-champagne transition-all duration-300 hover:bg-champagne/20 hover:shadow-[0_0_24px_rgba(212,175,55,0.25)]"
        >
          Start the assessment
        </button>
      </section>
    );
  }

  if (finished) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-24">
        <p className="font-body text-sm text-champagne">Your result</p>
        <h1 className="mt-4 font-display text-4xl text-ivory md:text-5xl">
          {rank.title}
        </h1>
        <p className="mt-5 font-body text-sm leading-relaxed text-mute">
          {rank.description}
        </p>

        <div className="mt-10 hairline rounded-md bg-slate-panel p-7">
          <div className="flex items-baseline justify-between">
            <span className="font-body text-sm text-mute">Overall score</span>
            <span className="tabular font-display text-2xl text-champagne">
              {correctCount} / {total}
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full bg-champagne transition-all duration-700"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="mt-8 space-y-4">
            {tierBreakdown.map(({ tier, correct, total: tierTotal }) => (
              <div key={tier} className="flex items-center justify-between">
                <span className="font-body text-sm text-ivory">
                  {TIER_LABEL[tier]}
                </span>
                <span className="tabular font-body text-sm text-mute">
                  {correct} / {tierTotal}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-9 flex flex-wrap gap-4">
          <button
            onClick={restart}
            className="flex items-center gap-2 rounded-sm border border-hairline px-5 py-3 font-body text-sm text-ivory transition-colors hover:border-champagne/40"
          >
            <RotateCcw size={16} />
            Retake the assessment
          </button>
          <Link
            href="/stocks"
            className="flex items-center gap-2 rounded-sm border border-champagne/40 px-5 py-3 font-body text-sm text-champagne transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]"
          >
            Continue to equities
          </Link>
        </div>
      </section>
    );
  }

  if (!current) return null;

  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <div className="flex items-center justify-between font-body text-xs text-mute">
        <span>{TIER_LABEL[current.tier]}</span>
        <span className="tabular">
          {currentIndex + 1} / {total}
        </span>
      </div>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full bg-champagne transition-all duration-500"
          style={{ width: `${((currentIndex + (revealed ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      <h2 className="mt-8 font-display text-2xl leading-snug text-ivory md:text-3xl">
        {current.prompt}
      </h2>

      <div className="mt-8 space-y-3">
        {current.options.map((option, index) => {
          const isSelected = selected === index;
          const isCorrectOption = index === current.correctIndex;

          let stateClasses = "border-hairline hover:border-champagne/40";
          if (revealed && isCorrectOption) {
            stateClasses = "border-emerald-gloss bg-emerald-gloss/10";
          } else if (revealed && isSelected && !isCorrectOption) {
            stateClasses = "border-red-500/60 bg-red-500/10";
          } else if (!revealed && isSelected) {
            stateClasses = "border-champagne bg-champagne/10";
          }

          return (
            <button
              key={index}
              onClick={() => selectOption(index)}
              disabled={revealed}
              className={`flex w-full items-center justify-between rounded-md border px-5 py-4 text-left font-body text-sm text-ivory transition-all duration-200 ${stateClasses}`}
            >
              <span>{option}</span>
              {revealed && isCorrectOption && (
                <Check size={18} className="shrink-0 text-emerald-soft" />
              )}
              {revealed && isSelected && !isCorrectOption && (
                <X size={18} className="shrink-0 text-red-400" />
              )}
            </button>
          );
        })}
      </div>

      {revealed && (
        <p className="mt-6 hairline rounded-md bg-slate-panel p-5 font-body text-sm leading-relaxed text-mute">
          {current.explanation}
        </p>
      )}

      <div className="mt-9">
        {!revealed ? (
          <button
            onClick={confirmAnswer}
            disabled={selected === null}
            className="rounded-sm border border-champagne bg-champagne/10 px-6 py-3 font-body text-sm text-champagne transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-30 hover:enabled:bg-champagne/20"
          >
            Confirm answer
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="rounded-sm border border-champagne bg-champagne/10 px-6 py-3 font-body text-sm text-champagne transition-all duration-300 hover:bg-champagne/20"
          >
            {currentIndex + 1 === total ? "See your result" : "Next question"}
          </button>
        )}
      </div>
    </section>
  );
}
