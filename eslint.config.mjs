import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginImport from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Global ignores to avoid linting build output
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "build/**",
      "dist/**",
      "*.config.js", // Config files may use CommonJS
      "*.config.ts", // TypeScript config files
      "*.config.mjs", // Module config files
    ],
  },
  // Global rules and plugins (flat config)
  {
    plugins: {
      import: pluginImport,
    },
    rules: {
      // Prevent sneaky CommonJS in our TS/ESM codebase
      "import/no-commonjs": "error",
    },
  },
  {
    languageOptions: {
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    rules: {},
  },
  // Prevent regressions: tailwind config should use ESM imports (no require())
  {
    files: ["tailwind.config.ts", "tailwind.config.js"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.name='require']",
          message: "Use ESM import in Tailwind config (e.g., import animate from 'tailwindcss-animate')",
        },
      ],
    },
  },
];

export default eslintConfig;
