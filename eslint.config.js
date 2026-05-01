/**
 * ESLint flat config — Week 4 upgrade
 *
 * This file replaces .eslintrc.cjs. It uses the "flat config" format
 * introduced in ESLint 9. The key differences:
 *
 * - Uses import/export instead of require/module.exports
 * - No "env" or "extends" — use the globals package and spread configs instead
 * - Plugins are objects, not strings
 * - File targeting uses "files" arrays instead of "overrides"
 *
 * This config adds eslint-plugin-unicorn, which enforces modern JavaScript
 * patterns. The rules are split into two tiers:
 *
 * - Tier 1 (error): Patterns you should always use. Blocks commits.
 * - Tier 2 (warn): Good habits. Shows warnings but does not block.
 *
 * See docs/reference/unicorn-rules-guide.md for what each rule does.
 * See docs/tutorials/harness-engineering.md for why enforcement matters.
 */

import js from "@eslint/js";
import globals from "globals";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

export default [
  js.configs.recommended,
  {
    files: ["src/js/**/*.js"],
    plugins: {
      unicorn: eslintPluginUnicorn,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      /* --- Existing rules (carried over from .eslintrc.cjs) --- */

      /* eval() executes arbitrary strings as code — a serious security risk */
      "no-eval": "error",

      /* innerHTML parses strings as live HTML — XSS risk with any external data.
         Use createElement + textContent instead. See docs/reference/safe-dom-manipulation.md */
      "no-restricted-properties": [
        "error",
        {
          property: "innerHTML",
          message:
            "Use createElement + textContent instead of innerHTML. See docs/reference/safe-dom-manipulation.md",
        },
      ],

      /* var has confusing scope rules; let and const behave predictably */
      "no-var": "error",

      /* if you never reassign a variable, const makes that clear to readers */
      "prefer-const": "error",

      /* console.log is useful for debugging but should not ship in production */
      "no-console": "warn",

      /* --- Tier 1: Modern DOM and JS patterns (error — blocks commits) --- */

      /* querySelector over getElementById — one consistent API */
      "unicorn/prefer-query-selector": "error",

      /* .append() over .appendChild() — modern, simpler */
      "unicorn/prefer-dom-node-append": "error",

      /* .remove() over parentNode.removeChild() — dramatically simpler */
      "unicorn/prefer-dom-node-remove": "error",

      /* textContent over innerText — safer and more predictable */
      "unicorn/prefer-dom-node-text-content": "error",

      /* addEventListener over onclick — proper event handling */
      "unicorn/prefer-add-event-listener": "error",

      /* .before(), .replaceWith() over legacy DOM methods */
      "unicorn/prefer-modern-dom-apis": "error",

      /* template literals over string concatenation (core ESLint rule, not unicorn) */
      "prefer-template": "error",

      /* .includes() over .indexOf() !== -1 */
      "unicorn/prefer-includes": "error",

      /* for...of over .forEach() — supports break/continue */
      "unicorn/no-array-for-each": "error",

      /* .key over .keyCode — keyCode is deprecated */
      "unicorn/prefer-keyboard-event-key": "error",

      /* for...of over C-style for loops — eliminates off-by-one errors */
      "unicorn/no-for-loop": "error",

      /* no nested ternary expressions — too confusing */
      "unicorn/no-nested-ternary": "error",

      /* kebab-case filenames — professional habit, prevents cross-platform issues */
      "unicorn/filename-case": ["error", { case: "kebabCase" }],

      /* --- Tier 2: Good habits, gentle nudge (warn — does not block) --- */

      /* .dataset over getAttribute('data-...') */
      "unicorn/prefer-dom-node-dataset": "warn",

      /* .slice() over .substring()/.substr() */
      "unicorn/prefer-string-slice": "warn",

      /* .startsWith()/.endsWith() over regex */
      "unicorn/prefer-string-starts-ends-with": "warn",

      /* Number.isNaN() over global isNaN() */
      "unicorn/prefer-number-properties": "warn",

      /* .find() over .filter()[0] */
      "unicorn/prefer-array-find": "warn",

      /* consistent 'error' name in catch blocks */
      "unicorn/catch-error-name": "warn",

      /* no stray spaces in console.log arguments */
      "unicorn/no-console-spaces": "warn",

      /* throw new Error() not throw Error() */
      "unicorn/throw-new-error": "warn",

      /* require message in new Error('...') */
      "unicorn/error-message": "warn",
    },
  },
  {
    files: ["netlify/functions/**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      /* serverless functions use console for logging — allow it */
      "no-console": "off",
    },
  },
];
