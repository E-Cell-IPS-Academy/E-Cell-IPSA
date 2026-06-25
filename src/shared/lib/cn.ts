/**
 * Tiny classNames joiner — filters falsy values and joins with spaces.
 * Keeps JSX className expressions readable without pulling in a dependency.
 *
 * @example cn("btn", isActive && "btn--active", disabled && "opacity-50")
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
