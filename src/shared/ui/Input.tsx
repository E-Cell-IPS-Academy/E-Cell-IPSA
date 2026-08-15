import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const baseField =
  "w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50";

/** Labeled text input with error + hint support. */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={fieldId}
            className="block text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={fieldId}
          aria-invalid={!!error}
          className={cn(
            baseField,
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
              : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-red-600">{error}</p>
        ) : hint ? (
          <p className="text-xs text-slate-500">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
