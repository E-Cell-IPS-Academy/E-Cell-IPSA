import { cn } from "../lib/cn";

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SIZES: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[3px]",
};

/** Neutral loading spinner used across the admin UI. */
export function Spinner({ className, size = "md" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block animate-spin rounded-full border-current border-t-transparent text-slate-400",
        SIZES[size],
        className
      )}
    />
  );
}
