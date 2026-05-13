# Final project — checklist

Tick each item as you ship it. Items in the **Optional ceiling** section are not required.

## Setup

- [ ] My `GROQ_API_KEY` is stored only in my password manager and in Netlify's environment variables — never pasted into an AI chat (Copilot, Claude, ChatGPT, etc.), never written to a `.env` file as plain text, never committed to source.
- [ ] If my key was ever exposed, I have cycled it and updated Netlify.
- [ ] `GROQ_API_KEY` set in this project's Netlify environment variables; the deployed function returns Groq responses end-to-end.
- [ ] Env var requirement documented in `README.md`.

## Architecture choice

- [ ] Pattern picked (A, B, or A+B); reasoning written down in `docs/reflections/final-project-reflection.md`.

## Moderation floor (all four required)

- [ ] System prompt defined as a named constant in the serverless function.
- [ ] Structured output: `response_format: { type: "json_object" }` set on the Groq call.
- [ ] User input wrapped in `<user_input>...</user_input>` inside the prompt.
- [ ] Input length cap enforced before the Groq call (suggested: 500 characters).

## Schema

- [ ] Response schema defined and documented (in code comments or a note in `docs/`).
- [ ] Front-end handles the `refused: true` branch — renders only `refusal_reason`, never `commentary`.

## Integration

- [ ] One Groq call + one REST call per user request (or two Groq + one REST if A+B).
- [ ] Existing Week 4 transform and `views.js` render path still work end-to-end.
- [ ] No new innerHTML; `createElement` + `textContent` discipline preserved.

## Polish

- [ ] At least one UX rough edge identified and smoothed (loading state, error state, refusal rendering, layout, copy, accessibility).
- [ ] Live site at your Netlify URL works end-to-end after deploy.

## Wrap

- [ ] `README.md` updated to describe the Groq integration.
- [ ] `docs/reflections/final-project-reflection.md` completed.
- [ ] All work merged to `main` and verified live before the deadline.

## Optional ceiling (recommended for students with time, not required)

- [ ] Cheap deterministic block-list for known injection signatures (~10 lines, see `docs/reference/groq-prompt-injection-defenses.md`).
- [ ] Optional zeroth Groq call returning `{ on_topic: bool, safe: bool }` before the main call (~20 lines, see same reference).
