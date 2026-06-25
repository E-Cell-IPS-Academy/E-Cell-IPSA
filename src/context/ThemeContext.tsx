import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";

interface ThemeContextValue {
  theme: "dark";
  toggleTheme: () => void;
  isDark: true;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: "dark",
      toggleTheme: () => {}, // no-op — theme is locked to dark
      isDark: true,
    }),
    []
  );

  // Keep the dark class on <html> at all times
  if (typeof window !== "undefined") {
    const root = document.documentElement;
    root.classList.remove("light");
    root.classList.add("dark");
    root.setAttribute("data-theme", "dark");
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
