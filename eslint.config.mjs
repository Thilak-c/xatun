import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: { js: { ignorePatterns: ["**/node_modules/**", "**/dist/**"] } },
});

export default [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      "prefer-const": "error",
      "no-var": "error",
      "no-unused-vars": "warn",
      "no-console": "warn",
      "prefer-arrow-callback": "error",
      "arrow-spacing": "error",
      "object-shorthand": "error",
      "prefer-template": "error",
      "template-curly-spacing": "error",
      "no-useless-escape": "error",
      "no-duplicate-imports": "error",
      "no-multiple-empty-lines": ["error", { "max": 2 }],
      "eol-last": "error",
      "no-trailing-spaces": "error",
      "comma-dangle": ["error", "always-multiline"],
      "quotes": ["error", "single", { "avoidEscape": true }],
      "semi": ["error", "always"],
      "indent": ["error", 2, { "SwitchCase": 1 }],
    },
  },
];
