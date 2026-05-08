# Final project — your Groq integration

> [!NOTE]
> This is the first self-directed assignment in the course. Week 4 was the last guided one. From here, you write your own scope and pick your own rough edges to polish.
>
> **See _Suggested reading order_ at the bottom for a path through these docs.**

## The premise

Your final project is not a new project — it is your Week 4 project with one or two Groq calls added inside the serverless function you already built. Your existing code (HTML, CSS, transform, cache wrapper, and view layer) carries over, but parts of it may need modifications depending on how you integrate Groq. The new code sits inside `netlify/functions/api.mjs` alongside your existing REST fetch.

You shipped a working serverless transform, a safe localStorage cache, and a clean view layer in Week 4. That architectural muscle is exactly what the final builds on.

## Three architecture patterns

You pick one of three patterns. Read `docs/suggestions.md` first — it is a planning brief written for _your_ project specifically. It walks through how each pattern would look for your API and your data, and ends with a soft recommendation.

All three pattern walkthroughs use the **Open Library Search API** as the worked example. Its shape (rich query parameters on a single endpoint, no auth, JSON response with a list of results) is similar to most of your Week 4 APIs, so the patterns translate cleanly to whichever API your project uses. See `docs/tutorials/open-library-quickstart.md` for a one-page orientation to the API itself.

### Pattern A — Groq before the REST call

User input arrives at the serverless function. Groq translates the input into the structured query parameters your existing REST API needs. The existing fetch runs against those parameters. Results render through the existing view layer.

```text
user input (free text)
  → Groq (returns JSON: { query, filters: {...} })
  → existing REST fetch
  → transform
  → view layer (unchanged)
```

What it does to UX: a multi-dropdown form collapses into one input. "A 1990s science fiction novel about colonization" becomes the user's whole interaction.

What is gained: natural-language interaction. Your project starts to feel like an assistant, not a filter.

Walkthrough: `docs/tutorials/pattern-a-translate-input.md` (with an Open Library worked example).

### Pattern B — Groq after the REST call

User input runs through your existing form. Your existing fetch returns its results. Groq generates personalized commentary on top of those results. The view layer renders the commentary alongside or in place of the raw cards.

```text
user input (form / dropdowns)
  → existing REST fetch
  → transform (existing)
  → Groq (returns JSON: { commentary, refused, refusal_reason })
  → view layer (renders commentary)
```

What it does to UX: your project gains a voice. "Here's why these three picks fit your reading mood" instead of "here are three results."

What is gained: a recommendation engine, not a search filter. The same data feels meaningfully different when narrated.

Walkthrough: `docs/tutorials/pattern-b-narrate-output.md` (with an Open Library worked example).

### Pattern A+B — both, chained

Two Groq calls per user request. Groq translates the input, the REST call runs, Groq narrates the results.

```text
user input
  → Groq (translate to params)
  → existing REST fetch
  → transform
  → Groq (narrate the results)
  → view layer
```

What it does to UX: the most "intelligent assistant" feel. Free-text input, narrated output, no dropdowns or filters in the middle.

The cost is real: doubled latency, doubled cost, doubled failure modes, doubled prompt-injection surface. Worth it when both ends of the loop genuinely benefit. Overkill when only one end has friction.

Walkthrough: `docs/tutorials/pattern-a-plus-b.md`.

## The moderation floor (required)

A Groq integration adds a new attack surface — user input now flows into an LLM whose output can render arbitrary content. Every student implements four required defenses:

1. **System prompt** — defines the role, names the schema, forbids deviation.
2. **Structured output (JSON mode)** — Groq returns a JSON object matching your schema; no free-text channel.
3. **Delimited user input** — wrap input in `<user_input>...</user_input>` tags; the system prompt names them as untrusted data.
4. **Input length cap** — reject input over 500 characters before the Groq call.

The four together are roughly 30 lines of code. None alone is enough; the combination is.

See `docs/tutorials/groq-moderation-floor.md` for the full walkthrough with code, and `docs/reference/groq-prompt-injection-defenses.md` for the threat ranking and optional ceiling items.

## What carries over from Week 4

Most of your Week 4 code carries over with small modifications. Your REST transform stays (still mapping API data to your views shape), your `loadCache`/`saveCache` wrapper stays (likely with a different cache-key strategy), and your `views.js` `createElement` + `textContent` discipline stays (you will add a refusal renderer for `refused: true`). The form is yours: keep it for Pattern B, simplify it for Pattern A, or replace it entirely for A+B.

You may swap your REST API for a different one, but it is discouraged — trading a known-working integration for unknown work competes with the Groq learning, which is the point of the final.

## Caching

Serverless functions are stateless across invocations. Any caching has to live in the front-end (your existing localStorage wrapper). Whether your existing cache survives unchanged, evolves to handle Groq output, or gets removed because per-request narration should not be cached is your design call.

## Deadline and shipping

See Canvas for the final due date. The final is a one-week sprint. The Part 0 → parts → reflection cadence from Weeks 2–4 carries forward.

To ship:

- All work merged to `main`
- Live site at your Netlify URL works end-to-end
- `README.md` updated to describe the Groq integration and the env var requirement
- `docs/reflections/final-project-reflection.md` completed

The full deliverables list is `docs/CHECKLIST.md`.

## Suggested reading order

Read in four phases — orientation, deep dive, references while building, wrap.

### Phase 1 — orientation (read before coding)

1. **`INSTRUCTIONS.md`** (this doc) — the assignment overview.
2. **`docs/suggestions.md`** — your personalized planning brief: how each pattern fits _your_ project, a sketched schema, a soft pick.

### Phase 2 — deep dive (read once you have picked your pattern)

3. **`docs/tutorials/groq-moderation-floor.md`** — required for everyone regardless of pattern. Four layers, why all four together.
4. **`docs/tutorials/open-library-quickstart.md`** — optional, ~5 minutes. Orients you to the API the walkthroughs use.
5. **The walkthrough for your chosen pattern:**
   - Pattern A → `docs/tutorials/pattern-a-translate-input.md`
   - Pattern B → `docs/tutorials/pattern-b-narrate-output.md`
   - Pattern A+B → read A and B first, then `docs/tutorials/pattern-a-plus-b.md`

### Phase 3 — keep open while building

6. **`docs/CHECKLIST.md`** — tick items as you ship them.
7. **`docs/reference/structured-output-schemas.md`** — when designing your schema or refusal voice.
8. **`docs/reference/groq-prompt-injection-defenses.md`** — when wrestling with refusal logic or doing the optional ceiling.

### Phase 4 — when done

9. **`docs/reflections/final-project-reflection.md`** — 7 prompts. Last thing you do before merging.

End-to-end reading time: about 45–60 minutes. The walkthroughs are the bulk; everything else is short. The order is a suggestion — read what's useful when you need it.
