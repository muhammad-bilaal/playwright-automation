import js from '@eslint/js';
import globals from 'globals';
import playwright from 'eslint-plugin-playwright';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  // Ignore folders
  {
    ignores: [
      'node_modules',
      'test-results',
      'playwright-report',
      'blob-report',
      'playwright/.cache',
      '.env',
      'allure-report',
      'allure-results',
    ],
  },

  // JavaScript files
  {
    files: ['**/*.js'],
    ...js.configs.recommended,
    languageOptions: {
      globals: globals.node,
    },
  },

  // TypeScript files
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: globals.node,
    },
    rules: {
      // Disable base ESLint rule for unused vars
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },

  // Playwright tests
  {
    files: ['tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-conditional-in-test': 'off',
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'CallExpression[callee.object.name="console"][callee.property.name="log"]',
          message: 'Unexpected console.log statement.',
        },
      ],
    },
  },

  // Prettier overrides
  {
    files: ['**/*.{js,ts}'],
    rules: {
      'array-bracket-spacing': 'off',
      'brace-style': 'off',
      'comma-dangle': 'off',
      'comma-spacing': 'off',
      'eol-last': 'off',
      indent: 'off',
      'key-spacing': 'off',
      'keyword-spacing': 'off',
      'no-mixed-spaces-and-tabs': 'off',
      'no-multiple-empty-lines': 'off',
      'no-trailing-spaces': 'off',
      'object-curly-spacing': 'off',
      quotes: 'off',
      semi: 'off',
      'space-before-function-paren': 'off',
      'space-infix-ops': 'off',
    },
  },

  // Global custom rules for all files
  {
    rules: {
      /* Possible Errors */
      'no-duplicate-case': 'error',
      'no-duplicate-imports': 'error',
      'no-fallthrough': 'error',
      'no-implied-eval': 'error',
      'no-undef': 'error',

      /* Best Practices */
      'consistent-return': 'error',
      'no-else-return': 'error',
      'no-param-reassign': ['error', { props: false }],
      'no-var': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],
      'prefer-template': 'error',

      /* Stylistic */
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'array-bracket-spacing': ['error', 'never'],
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'comma-spacing': ['error', { before: false, after: true }],
      'eol-last': ['error', 'always'],
      indent: ['error', 2],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'keyword-spacing': ['error', { before: true, after: true }],
      'max-len': 'off',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'space-before-function-paren': ['error', { anonymous: 'always', named: 'never', asyncArrow: 'always' }],
      'space-infix-ops': 'error',

      /* Debugging */
      'no-debugger': ['warn'],
    },
  },
];
