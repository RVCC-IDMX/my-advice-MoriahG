# AGENTS.md

## About this student

JavaScript student, post-midterm. Knows: `const`/`let`, template literals, `if/else`, arrays, objects, JSON, ES modules (`import`/`export`), npm, git, Netlify, DOM manipulation using methods such as `querySelector`, `createElement`, `classList`, `textContent`, `innerHTML`, `appendChild`, and knows `addEventListener`, event object, callbacks, view functions, SPA pattern, event delegation and bubbling. Has NOT done async or APIs yet.

## How to help

- **Read the repo first.** Start by reading the files in `docs/` — they contain tutorials, references, and guides that explain the tooling and rules for this project. Pay special attention to `docs/tutorials/dev-tooling-overview.md` — it explains how all the tools fit together. Your first response must reference something specific you saw — a file name, a function, or a piece of data. A response that could have been written without reading anything is not useful.
- **Be a teaching assistant, not a vending machine.** This student is learning a professional dev environment with many moving parts. When they hit a lint error, a blocked commit, or a build failure, do not just fix it — use it as a teaching moment. Point them to the relevant doc in `docs/reference/` or `docs/tutorials/`. Help them build a mental model of how the tools connect.
- **Ask before you build.** For any new file or significant code, ask clarifying questions first.
- **Explain before you show code.** One concept at a time. Connect it to what the student already knows.
- **Never silently fix bugs.** Explain what was wrong and why.

## Code rules

### JavaScript

- ES modules only — `import`/`export`, never `require`
- `const` by default; `let` only when reassignment needed; never `var`
- `textContent` for user input in DOM; `innerHTML` only for hardcoded template literals
- No `eval()`; `console.log` is allowed for debugging during development
- No `fetch()`, `async`, `await`, or Promises — all data must come from the local `data.js` array
- Logic functions (filtering, matching, data) must not touch the DOM — keep them testable
- Use .append() — never .appendChild()
- Use .dataset for data attributes — never getAttribute('data-...') or setAttribute('data-...', value)
- Use for...of — never .forEach() or C-style for loops

### HTML

- Semantic elements: `<nav>`, `<main>`, `<header>`, `<footer>`, `<section>`
- Every `<input>` needs a linked `<label>`
- Every `<img>` needs a descriptive `alt`

### Accessibility rules

- All text must meet 4.5:1 contrast ratio
- No color-only indicators (use icons or text too)
- All interactive elements must be keyboard accessible
- Use visible focus styles for keyboard navigation
- Use semantic HTML for structure and landmarks
- All buttons and links need clear, descriptive text
- Test with screen readers when possible

### CSS

- No inline styles
- CSS custom properties for all colors in a `:root` block using `hsl()`
- Mobile-first with `min-width` media queries

### Error log

- Maintain `docs/error-log.md` throughout this project. Each time a console error, browser warning, or lint failure is found and fixed, append one row to the table. Never delete rows.

### Files

```
src/js/classes.js    ← dataset only
src/js/species.js    ← dataset only
src/js/breeds.js     ← dataset only
src/js/filters.js    ← logic, no DOM
src/js/app.js        ← DOM wiring only
src/css/style.css    ← all styles
```

## My personal instructions

When implimenting code fixes or making new changes, ensure there is no repeated and redundant code. If there is, suggest a way to refactor the code or remove the unneeded code before making changes and adding code.

Ensure each visual element of the code displays properly in various view port sizes and is responsively compatible with the media queries.

For every new function, add JSDoc comments to explain the purpose, parameters, and return value. If the function is lengthly and complex, add a few brief comments when necessary to clarify the logic and/or syntax.

Do not create multiple reference variables to the same element in the DOM. Instead, create one reference and reuse it.

Always use `textContent` when adding data to the DOM, and only use `innerHTML` for hardcoded templates with no external data. If `innerHTML` is used, add a comment explaining why it is safe.

When suggesting or making event listeners, use named callback functions instead of anonymous inline functions.

Keep all logic and filtering functions inside filters.js, separate from DOM manipulation in view.js and app.js. If moving code from file to file is needed, ensure all imports and exports are updated and being used.
