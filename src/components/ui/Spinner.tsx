import { cx } from "@/utils/cx";

export type SpinnerSize = "sm" | "md" | "lg";

const sizeStyles: Record<SpinnerSize, string> = {
  sm: "size-4",
  md: "size-6",
  lg: "size-10",
};

export interface SpinnerProps {
  size?: SpinnerSize;
  /** Announced to screen readers. */
  label?: string;
  className?: string;
}

export function Spinner({
  size = "md",
  label = "Loading",
  className,
}: SpinnerProps) {
  return (
    <span role="status" className={cx("inline-flex", className)}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className={cx("animate-spin motion-reduce:animate-none", sizeStyles[size])}
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="3"
        />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}
