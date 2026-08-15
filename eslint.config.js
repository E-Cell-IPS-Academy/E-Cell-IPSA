import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import { globalIgnores } from "eslint/config";

export default tseslint.config([
  globalIgnores(["dist", "playwright-report", "test-results"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
      // Must be last: turns off ESLint rules that conflict with Prettier.
      eslintConfigPrettier,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Relaxed to WARN during the legacy → modular-architecture migration so
      // pre-existing debt stays visible without blocking commits. Tighten these
      // back to "error" as features are refactored (see ARCHITECTURE.md).
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_|^error$|^err$",
        },
      ],
      "no-empty": ["warn", { allowEmptyCatch: true }],
      "@typescript-eslint/no-unused-expressions": "warn",
      // Context files legitimately export a Provider + a hook; HMR hint only.
      "react-refresh/only-export-components": "warn",
    },
  },
  // Node-context config files & scripts
  {
    files: ["scripts/**/*.{js,mjs,cjs}", "*.config.{js,ts}", "e2e/**/*.ts"],
    languageOptions: {
      globals: globals.node,
    },
  },
]);
