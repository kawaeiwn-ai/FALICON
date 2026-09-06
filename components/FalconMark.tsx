type FalconMarkProps = {
  className?: string;
  strokeWidth?: number;
};

/**
 * An abstract institutional mark: two angled wing strokes meeting a vertical
 * spine, suggesting a falcon in a steep dive without illustrating a literal
 * bird. Built entirely from line strokes so it reads as a crest, not a clipart icon.
 */
export default function FalconMark({
  className = "h-10 w-10",
  strokeWidth = 1.4,
}: FalconMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M32 6 L32 46"
        stroke="#D4AF37"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M32 14 C 20 18, 8 24, 4 34 C 14 32, 22 30, 32 26"
        stroke="#D4AF37"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M32 14 C 44 18, 56 24, 60 34 C 50 32, 42 30, 32 26"
        stroke="#D4AF37"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M32 26 C 26 34, 22 42, 22 52"
        stroke="#3FBE8C"
        strokeWidth={strokeWidth * 0.85}
        strokeLinecap="round"
        opacity={0.8}
      />
      <path
        d="M32 26 C 38 34, 42 42, 42 52"
        stroke="#3FBE8C"
        strokeWidth={strokeWidth * 0.85}
        strokeLinecap="round"
        opacity={0.8}
      />
      <circle cx="32" cy="10" r="2.2" fill="#D4AF37" />
    </svg>
  );
}
