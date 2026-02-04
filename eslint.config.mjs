import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginImport from "eslint-plugin-import";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Base JS recommendations
  js.configs.recommended,

  // Linter options
  {
    linterOptions: {
      reportUnusedDisableDirectives: "off",
    },
  },
  
  // Global ignores to avoid linting build output
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "archive/**",
      "backups/**",
      "docs/**",
      "logs/**",
      "test-results/**",
      "kollect-it-deployment-scripts/**",
      "product-application/**",
      "scripts/**",
      "prisma/**",
      "tests/**",
      "types/**",
      "check-users.ts",
      "reset-*.js",
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
      "import/order": "off",
      "import/no-duplicates": "off",
      
      // Code quality
      "no-console": "off",
      "prefer-const": "off",
      "no-var": "warn",
      "consistent-return": "off",
    },
  },
  
  // TypeScript/React files
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tseslint.parser,
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      react: pluginReact,
      "react-hooks": pluginReactHooks,
    },
    rules: {
      // Type safety
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-case-declarations": "off",
      "prefer-const": "off",
      "no-redeclare": "off",
      "no-useless-escape": "off",
      "@next/next/no-inline-styles": "off",
      "no-inline-styles": "off",
      
      // React
      "react/prop-types": "off", // Using TypeScript
      "react/react-in-jsx-scope": "off", // Next.js
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "off",
    },
  },
  
  // Test files - relaxed rules
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/tests/**/*", "**/e2e/**/*"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
        describe: "readonly",
        test: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
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
