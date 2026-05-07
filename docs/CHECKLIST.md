# Completion checklist — Week 4: Fetch, serverless, and live data

Use this checklist to make sure you have completed every part of the assignment. Each item should be a clear yes or no.

## Part 0 — Merge, install, and meet your new linter

- [x] Merged the Week 4 PR
- [x] Ran `npm install` — saw preinstall and postinstall messages
- [x] Deleted `.eslintrc.cjs` (replaced by `eslint.config.js`)
- [x] Ran `npm run lint` — noted violations from new unicorn rules
- [x] Read `docs/tutorials/what-are-hooks.md`
- [x] Read `docs/tutorials/harness-engineering.md`
- [x] Read `docs/reference/safe-dom-manipulation.md` (updated — innerHTML now blocked by linter)
- [x] Fixed lint violations (used `--fix` where possible, manual fixes where needed)
- [x] Logged lint fixes in `docs/error-log.md`
- [x] Updated AGENTS.md with async/fetch rules and enforcement layer notes
- [x] Ran `npm run dev:api` and visited `http://localhost:8888/.netlify/functions/api` — saw Dog API JSON
- [x] Ran `npm run lint` — passes

## Part 1 — Serverless proxy

- [x] Read `docs/tutorials/your-first-serverless-function.md` and your API guide in `docs/api-guides/`
- [x] Replaced hardcoded Dog API data with a fetch to my project's API
- [x] Serverless function transforms API response to match my views' expected shape
- [x] try/catch around the API call with 502 error response on failure
- [x] Checks response.ok before parsing upstream response
- [x] If API key needed: `.env` file created with the key, accessed via `process.env`
- [x] `npm run dev:api` → `http://localhost:8888/.netlify/functions/api` shows my API data in the right shape
- [x] Ran `npm run lint` — passes

## Part 2 — Fetch and render

- [x] Replaced `import { data }` with async fetch to `/.netlify/functions/api`
- [x] View functions receive fetched data and render cards
- [x] Loading state visible while data loads
- [x] try/catch around fetch with response.ok check
- [x] Error message appears in the DOM on fetch failure (not just console.log)
- [x] Cards render from live API data (same look as before, different source)
- [x] Ran `npm run lint` — passes

## Part 3A — Enrich your views

- [x] Added 1-2 new fields from the API that data.js didn't have
- [x] Updated serverless function to include new field(s)
- [x] Updated views.js to display new data
- [x] Defensive rendering: missing fields don't crash the app
- [x] New data visible in cards or detail view
- [x] Ran `npm run lint` — passes

## Part 3B — Cache with localStorage

- [x] loadCache and saveCache functions use try/catch wrapper pattern
- [x] API response cached after successful fetch
- [x] Page load checks cache first, fetches only if cache is empty or invalid
- [x] Shape validation on cached data
- [x] Self-heals on corrupt cache data (removes bad entry, falls back to fetch)
- [x] Tested: refresh loads from cache, clear cache triggers re-fetch, offline mode works
- [x] Ran `npm run lint` — passes

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
