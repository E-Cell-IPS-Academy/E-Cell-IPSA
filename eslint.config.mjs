import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Node scripts, config files, and Playwright e2e tests run in Node, not the
    // browser. Declare the Node globals they rely on so `no-undef` does not fire.
    // (Globals are declared inline to avoid depending on the removed `globals` pkg.)
    files: [
      "scripts/**/*.{js,mjs,cjs}",
      "*.config.{js,mjs,cjs,ts}",
      "e2e/**/*.{ts,js}",
      "playwright.config.ts",
    ],
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
        Buffer: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        fetch: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "writable",
        require: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
      },
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
