# Completion checklist

Use this checklist to make sure you have completed every part of the assignment. Each item should be a clear yes or no.

## Part 1 — Plan your site with your agent

- [x] Opened original "What Should I...?" repo in VS Code
- [x] Started a Copilot agent conversation (in the original repo, not this one) with the planning guide gist
- [x] Agent's first response referenced specific files and content from the repo
- [x] Had a back-and-forth planning conversation (not just one message)
- [x] Produced a `BUILD-PROMPT.md` file
- [x] Copied `BUILD-PROMPT.md` into this repo

## Part 2 — Get it running

- [ ] Cloned the repo and opened it in VS Code
- [ ] Ran `npm install` successfully
- [ ] Ran `npm run dev` — Vite started without errors
- [ ] Ran `npm run lint` — passed with no errors
- [ ] Made a test commit and confirmed Husky ran lint-staged

## Part 3 — Build the site

- [ ] Pasted build prompt into an agent conversation in this repo
- [ ] Agent generated `index.html`
- [ ] Agent generated JS files in `src/js/` and CSS in `src/css/`
- [ ] Ran `npm run lint` and fixed any errors
- [ ] Ran `npm run dev` and confirmed the site loads

## Part 4 — Modify your AGENTS.md

- [ ] Read `docs/a-good-agents-md.md`
- [ ] Added at least 3 personal instructions to AGENTS.md
- [ ] Tested the instructions in a short agent conversation
- [ ] Noted what changed in the agent's behavior

## Part 5 — Deploy and reflect

- [ ] Ran `npm run build` successfully
- [ ] Deployed to Netlify
- [ ] Pushed to GitHub
- [ ] GitHub Actions lint workflow shows a green check
- [ ] Completed `ai-collaboration-summary-template.md`

## Files to submit

- [ ] Live Netlify URL
- [ ] GitHub repo URL
- [ ] Completed `ai-collaboration-summary-template.md` in the repo
