# Completion checklist — Week 2: DOM Fundamentals

Use this checklist to make sure you have completed every part of the assignment. Each item should be a clear yes or no.

## Part 1 — Read your code

- [ ] Updated AGENTS.md "About this student" section before starting (start-of-week ritual)
- [ ] Ran `npm run dev` and confirmed site loads
- [ ] Read `src/js/app.js` top to bottom — can explain what each function does
- [ ] Read `src/js/matching.js` — can explain the logic
- [ ] Read `src/js/data.js` — know the shape and count of your data
- [ ] Tried `document.querySelector()` in the browser console

## Part 2 — Modernize your code

- [ ] Replaced every `getElementById` with `querySelector` (using CSS selector syntax)
- [ ] Replaced every data-driven `innerHTML` with `createElement` + `textContent`
- [ ] Any remaining `innerHTML` has a comment explaining why it is safe
- [ ] Site still works after changes — form submits, results display
- [ ] Ran `npm run lint` and fixed any errors
- [ ] Updated `docs/error-log.md` with any errors encountered

## Part 3 — DOM experiments

- [ ] Created `src/js/experiments.js`
- [ ] Linked it in `index.html` with a `<script type="module">` tag
- [ ] Completed at least 5 experiments from `docs/tutorials/dom-experiments.md`
- [ ] Each experiment is commented — what it does and why you tried it
- [ ] Ran `npm run lint` and fixed any errors
- [ ] Updated `docs/error-log.md`

## Part 4 — Update AGENTS.md and reflect

- [ ] Updated "About this student" section again with what you actually learned
- [ ] Added at least 2 new personal instructions based on this week's learning
- [ ] Completed `docs/reflections/week-2-reflection.md`
- [ ] Ran `npm run lint` — passes
- [ ] Ran `npm run build` — builds successfully
- [ ] Deployed to Netlify
- [ ] Pushed to GitHub
- [ ] GitHub Actions lint check shows green

## What to submit

- [ ] Live Netlify URL
- [ ] GitHub repo URL
- [ ] 2–3 sentence Canvas answer: What was the most surprising thing you discovered when reading the code the agent wrote for you?

## Extra credit

- [ ] Write one Vitest test for a pure function in `matching.js`
- [ ] Run `npm run test` and confirm it passes
