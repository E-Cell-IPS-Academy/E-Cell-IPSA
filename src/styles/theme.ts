export type Theme = "dark" | "light";

export type ThemeElement =
  | "bg-primary"
  | "bg-secondary"
  | "bg-card"
  | "text-primary"
  | "text-secondary"
  | "text-accent"
  | "border"
  | "glass"
  | "nav"
  | "footer"
  | "input"
  | "button-primary"
  | "button-secondary";

type ThemeConfig = Record<Theme, Record<ThemeElement, string>>;

export const themeConfig: ThemeConfig = {
  dark: {
    "bg-primary": "bg-black",
    "bg-secondary": "bg-gray-900",
    "bg-card":
      "bg-gray-900/60 border border-white/10 shadow-xl shadow-black/30",
    "text-primary": "text-white",
    "text-secondary": "text-gray-400",
    "text-accent": "text-purple-400",
    border: "border-white/10",
    glass:
      "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40",
    nav: "bg-black/70 backdrop-blur-2xl border-b border-white/20 shadow-2xl shadow-black/50",
    footer:
      "bg-gradient-to-br from-gray-900 via-black to-purple-900 border-t border-white/10",
    input:
      "bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20",
    "button-primary":
      "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50",
    "button-secondary":
      "bg-white/10 text-white border border-white/10 hover:bg-white/20 hover:border-white/20",
  },
  light: {
    "bg-primary": "bg-gradient-to-br from-gray-50 via-white to-purple-50/30",
    "bg-secondary": "bg-gray-100/80",
    "bg-card":
      "bg-white/70 border border-gray-200/60 shadow-lg shadow-gray-200/40 backdrop-blur-sm",
    "text-primary": "text-gray-900",
    "text-secondary": "text-gray-500",
    "text-accent": "text-purple-600",
    border: "border-black/10",
    glass:
      "bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl shadow-gray-300/20",
    nav: "bg-white/70 backdrop-blur-2xl border-b border-gray-200/60 shadow-lg shadow-gray-200/30",
    footer:
      "bg-gradient-to-br from-gray-100 via-white to-purple-100/40 border-t border-gray-200/60",
    input:
      "bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 shadow-sm",
    "button-primary":
      "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-400/30 hover:shadow-purple-400/50",
    "button-secondary":
      "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 hover:border-gray-300",
  },
};

/**
 * Returns the Tailwind classes for a given theme and element.
 *
 * @param theme - The current theme ('dark' or 'light')
 * @param element - The UI element to get classes for
 * @returns A string of Tailwind CSS classes
 *
 * @example
 * ```tsx
 * const { theme } = useTheme();
 * <div className={getThemeClasses(theme, 'bg-primary')}>...</div>
 * ```
 */
export function getThemeClasses(theme: Theme, element: ThemeElement): string {
  return themeConfig[theme][element];
}

/**
 * Returns multiple theme class strings merged together.
 * Useful when an element needs classes from several theme elements.
 *
 * @param theme - The current theme ('dark' or 'light')
 * @param elements - Array of UI elements to get classes for
 * @returns A single merged string of Tailwind CSS classes
 *
 * @example
 * ```tsx
 * const { theme } = useTheme();
 * <div className={getMultipleThemeClasses(theme, ['bg-primary', 'text-primary'])}>
 * ```
 */
export function getMultipleThemeClasses(
  theme: Theme,
  elements: ThemeElement[]
): string {
  return elements.map((el) => themeConfig[theme][el]).join(" ");
}
