# Completion checklist — Week 3: Events & View Functions

Use this checklist to make sure you have completed every part of the assignment. Each item should be a clear yes or no.

## Part 0 — Prepare your agent

- [x] Updated AGENTS.md "About this student" section (start-of-week ritual)
- [x] Read `docs/rules/README.md` and browsed the rule pages
- [x] Added modern JS rules to AGENTS.md before starting any code work

## Part 1 — Know your code

- [x] Filled out every section of `docs/my-code-map.md` by reading actual files
- [x] Reviewed experiments.js and decided which experiments to keep
- [x] Moved keeper experiments into `app.js`
- [x] Deleted `src/js/experiments.js`
- [x] Removed the experiments script tag from `index.html`
- [x] Ran `npm run lint` — passes

## Part 2 — Extract view functions into views.js

- [x] Created `src/js/views.js`
- [x] `showResults(items, container)` builds cards with createElement/textContent
- [x] `showNoResults(container)` displays a no-results message
- [x] `showDetail(item, container)` displays a single item with all properties and a back button
- [x] All three functions are exported
- [x] `app.js` imports view functions from `views.js`
- [x] `.hidden` class exists in CSS (`display: none`)
- [x] Form submit still displays results correctly
- [x] Ran `npm run lint` — passes

## Part 3 — Wire events and delegation

- [x] Added a comment above the inherited form submit handler explaining what it does
- [x] Event delegation: one click listener on the results container (not on individual cards)
- [x] Uses `.closest()` to identify the clicked card
- [x] Clicking a card shows the detail view
- [x] Clicking the back button returns to the results view
- [ ] Uses `preventDefault()` on the form
- [x] All event handlers are named callback functions (not anonymous inline)
- [x] Full flow works: submit form → results → click card → detail → click back → results
- [x] Ran `npm run lint` — passes

## Part 4 — AGENTS.md + reflect

- [x] Updated AGENTS.md "About this student" with what you actually learned
- [x] Added at least 2 more personal instructions about events or SPA patterns
- [x] Completed every question in `docs/reflections/week-3-reflection.md`
- [x] Ran `npm run lint` — passes
- [x] Ran `npm run build` — builds successfully
- [x] Deployed to Netlify
- [x] Pushed to GitHub
- [x] GitHub Actions lint check shows green

## What to submit

- [ ] Live Netlify URL
- [ ] GitHub repo URL
- [ ] 2-3 sentence Canvas answer: What was the most important thing you learned about how events work in the browser?
