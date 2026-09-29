"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

interface SegmentedProps<T extends string | number> {
  label: string;
  value: T;
  options: { value: T; label: ReactNode; title?: string }[];
  onChange: (value: T) => void;
  disabled?: boolean;
}

/** Radio-group styled as a compact segmented control. */
export function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
  disabled,
}: SegmentedProps<T>) {
  return (
    <div>
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      <div
        role="radiogroup"
        aria-label={label}
        className={cn(
          "inline-flex overflow-hidden rounded-lg border border-slate-300 bg-white",
          disabled && "opacity-50"
        )}
      >
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              role="radio"
              aria-checked={active}
              title={o.title}
              disabled={disabled}
              onClick={() => onChange(o.value)}
              className={cn(
                "min-h-8 border-r border-slate-200 px-3 text-xs font-medium last:border-r-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500",
                active ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface IconBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  danger?: boolean;
}

/** Small icon-only button. `label` becomes both the tooltip and accessible name. */
export function IconBtn({ label, danger, className, children, ...props }: IconBtnProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors",
        "hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        "disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent",
        danger && "hover:bg-red-50 hover:text-red-600",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/** Plain text field for use inside block editors (compact, no label wrapper). */
export const fieldClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";
