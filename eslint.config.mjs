import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginImport from "eslint-plugin-import";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Base JS recommendations
  js.configs.recommended,
  
  // Global ignores to avoid linting build output
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "build/**",
      "dist/**",
      "out/**",
      "public/**",
      "*.config.js", // Config files may use CommonJS
      "*.config.ts", // TypeScript config files
      "*.config.mjs", // Module config files
      "prisma/generated/**",
      "coverage/**",
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
      
      // Import organization
      "import/order": ["warn", {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      }],
      "import/no-duplicates": "error",
      
      // Code quality
      "no-console": ["warn", { 
        allow: ["warn", "error"] 
      }],
      "prefer-const": "error",
      "no-var": "error",
      "consistent-return": "warn",
    },
  },
  
  // TypeScript/React files
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    rules: {
      // Type safety
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],
      "@typescript-eslint/no-non-null-assertion": "warn",
      
      // React
      "react/prop-types": "off", // Using TypeScript
      "react/react-in-jsx-scope": "off", // Next.js
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  
  // Test files - relaxed rules
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/tests/**/*", "**/e2e/**/*"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
    },
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
