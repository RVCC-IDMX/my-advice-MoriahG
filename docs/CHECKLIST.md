# Completion checklist — Week 4: Fetch, serverless, and live data

Use this checklist to make sure you have completed every part of the assignment. Each item should be a clear yes or no.

## Part 0 — Merge, install, and meet your new linter

- [ ] Merged the Week 4 PR
- [ ] Ran `npm install` — saw preinstall and postinstall messages
- [ ] Deleted `.eslintrc.cjs` (replaced by `eslint.config.js`)
- [ ] Ran `npm run lint` — noted violations from new unicorn rules
- [ ] Read `docs/tutorials/what-are-hooks.md`
- [ ] Read `docs/tutorials/harness-engineering.md`
- [ ] Read `docs/reference/safe-dom-manipulation.md` (updated — innerHTML now blocked by linter)
- [ ] Fixed lint violations (used `--fix` where possible, manual fixes where needed)
- [ ] Logged lint fixes in `docs/error-log.md`
- [ ] Updated AGENTS.md with async/fetch rules and enforcement layer notes
- [ ] Ran `npm run dev:api` and visited `http://localhost:8888/.netlify/functions/api` — saw Dog API JSON
- [ ] Ran `npm run lint` — passes

## Part 1 — Serverless proxy

- [ ] Read `docs/tutorials/your-first-serverless-function.md` and your API guide in `docs/api-guides/`
- [ ] Replaced hardcoded Dog API data with a fetch to my project's API
- [ ] Serverless function transforms API response to match my views' expected shape
- [ ] try/catch around the API call with 502 error response on failure
- [ ] Checks response.ok before parsing upstream response
- [ ] If API key needed: `.env` file created with the key, accessed via `process.env`
- [ ] `npm run dev:api` → `http://localhost:8888/.netlify/functions/api` shows my API data in the right shape
- [ ] Ran `npm run lint` — passes

## Part 2 — Fetch and render

- [ ] Replaced `import { data }` with async fetch to `/.netlify/functions/api`
- [ ] View functions receive fetched data and render cards
- [ ] Loading state visible while data loads
- [ ] try/catch around fetch with response.ok check
- [ ] Error message appears in the DOM on fetch failure (not just console.log)
- [ ] Cards render from live API data (same look as before, different source)
- [ ] Ran `npm run lint` — passes

## Part 3A — Enrich your views

- [ ] Added 1-2 new fields from the API that data.js didn't have
- [ ] Updated serverless function to include new field(s)
- [ ] Updated views.js to display new data
- [ ] Defensive rendering: missing fields don't crash the app
- [ ] New data visible in cards or detail view
- [ ] Ran `npm run lint` — passes

## Part 3B — Cache with localStorage

- [ ] loadCache and saveCache functions use try/catch wrapper pattern
- [ ] API response cached after successful fetch
- [ ] Page load checks cache first, fetches only if cache is empty or invalid
- [ ] Shape validation on cached data
- [ ] Self-heals on corrupt cache data (removes bad entry, falls back to fetch)
- [ ] Tested: refresh loads from cache, clear cache triggers re-fetch, offline mode works
- [ ] Ran `npm run lint` — passes

## Part 4 — Deploy and reflect

- [ ] If API key needed: environment variable set in Netlify UI
- [ ] Deployed to Netlify with `netlify deploy --prod`
- [ ] Deployed site shows API data correctly
- [ ] Filled out `docs/my-code-map-v2-additions.md`
- [ ] Completed `docs/reflections/week-4-reflection.md`
- [ ] Ran `npm run lint` — passes
- [ ] Ran `npm run build` — builds successfully
- [ ] Pushed to GitHub
- [ ] GitHub Actions lint check shows green

## What to submit

- [ ] Live Netlify URL
- [ ] GitHub repo URL
- [ ] 2-3 sentence Canvas answer: What is the enforcement ladder, and which layer changed your coding habits the most this week?
