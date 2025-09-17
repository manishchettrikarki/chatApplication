import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    ignores: ["dist/**", "node_modules/**", "*.config.js", "*.config.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      eqeqeq: "error",
      "@typescript-eslint/no-unused-vars": ["warn"],
    },
  },
];
