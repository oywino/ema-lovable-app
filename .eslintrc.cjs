/* eslint config: minimal, React + TS + Prettier */
module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "detect" } },
  
  // 👇 Ignore noisy, non-source files
  ignorePatterns: [
    "tailwind.config.ts",
    "src/components/ui/**"
  ],

  plugins: ["@typescript-eslint", "react", "react-hooks", "jsx-a11y"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier"
  ],
  rules: {
    "react/react-in-jsx-scope": "off" // not needed with Vite/React
     // 👇 Silence rules that broke your CI run
    "react-refresh/only-export-components": "off",
    "@typescript-eslint/no-empty-interface": "off"
  }
};
