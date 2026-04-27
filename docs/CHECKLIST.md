# Completion checklist — Week 3: Events & View Functions

Use this checklist to make sure you have completed every part of the assignment. Each item should be a clear yes or no.

## Part 0 — Prepare your agent

- [ ] Updated AGENTS.md "About this student" section (start-of-week ritual)
- [ ] Read `docs/rules/README.md` and browsed the rule pages
- [ ] Added modern JS rules to AGENTS.md before starting any code work

## Part 1 — Know your code

- [ ] Filled out every section of `docs/my-code-map.md` by reading actual files
- [ ] Reviewed experiments.js and decided which experiments to keep
- [ ] Moved keeper experiments into `app.js`
- [ ] Deleted `src/js/experiments.js`
- [ ] Removed the experiments script tag from `index.html`
- [ ] Ran `npm run lint` — passes

## Part 2 — Extract view functions into views.js

- [ ] Created `src/js/views.js`
- [ ] `showResults(items, container)` builds cards with createElement/textContent
- [ ] `showNoResults(container)` displays a no-results message
- [ ] `showDetail(item, container)` displays a single item with all properties and a back button
- [ ] All three functions are exported
- [ ] `app.js` imports view functions from `views.js`
- [ ] `.hidden` class exists in CSS (`display: none`)
- [ ] Form submit still displays results correctly
- [ ] Ran `npm run lint` — passes

## Part 3 — Wire events and delegation

- [ ] Added a comment above the inherited form submit handler explaining what it does
- [ ] Event delegation: one click listener on the results container (not on individual cards)
- [ ] Uses `.closest()` to identify the clicked card
- [ ] Clicking a card shows the detail view
- [ ] Clicking the back button returns to the results view
- [ ] Uses `preventDefault()` on the form
- [ ] All event handlers are named callback functions (not anonymous inline)
- [ ] Full flow works: submit form → results → click card → detail → click back → results
- [ ] Ran `npm run lint` — passes

## Part 4 — AGENTS.md + reflect

- [ ] Updated AGENTS.md "About this student" with what you actually learned
- [ ] Added at least 2 more personal instructions about events or SPA patterns
- [ ] Completed every question in `docs/reflections/week-3-reflection.md`
- [ ] Ran `npm run lint` — passes
- [ ] Ran `npm run build` — builds successfully
- [ ] Deployed to Netlify
- [ ] Pushed to GitHub
- [ ] GitHub Actions lint check shows green

## What to submit

- [ ] Live Netlify URL
- [ ] GitHub repo URL
- [ ] 2-3 sentence Canvas answer: What was the most important thing you learned about how events work in the browser?
