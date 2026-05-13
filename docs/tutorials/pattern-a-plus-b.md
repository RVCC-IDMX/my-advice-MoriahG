# Pattern A+B — chain Pattern A and Pattern B

This is the "intelligent assistant" version: Groq translates the input, your REST API runs, Groq narrates the results. Two Groq calls per user request, two structured-output schemas, two error paths.

The cost is real: doubled latency, doubled cost, doubled failure modes, doubled prompt-injection surface. **A+B is the right answer for some; for others it is two calls where one would have been enough.** Read your `suggestions.md` before deciding.

## Read these first

A+B is built from Pattern A and Pattern B chained together. You do not need new mental models — you need to compose two you already learned.

- `tutorials/pattern-a-translate-input.md` — read in full, build the translation call
- `tutorials/pattern-b-narrate-output.md` — read in full, build the narration call
- `tutorials/groq-moderation-floor.md` — both calls need the floor

This walkthrough assumes you have both A and B working and want to chain them. If you do not, build A first, ship it, then layer B on top.

## The pattern

```text
user input (free text)
  → Groq #1 (translate to params)         <-- Pattern A
  → existing REST fetch
  → transform
  → Groq #2 (narrate the results)         <-- Pattern B
  → view layer (renders narration)
```

Both Groq calls implement the full moderation floor. They are independent — each has its own system prompt, its own schema, its own refusal flag. If Groq #1 refuses, you do not run the REST call or Groq #2. If Groq #2 refuses, you have results but no narration; render the cards plain.

## The serverless function

```js
// netlify/functions/api.mjs
const MAX_INPUT = 500;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT_TRANSLATE = `...`; // see Pattern A walkthrough
const SYSTEM_PROMPT_NARRATE = `...`; // see Pattern B walkthrough

export async function handler(event) {
  const userInput = event.body || "";

  // Layer 4 — length cap (applies to both calls; check once at the top)
  if (userInput.length > MAX_INPUT) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Input too long" }),
    };
  }

  // ---- Groq #1: translate input to API params (Pattern A) ----
  let params;
  try {
    const r1 = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT_TRANSLATE },
          { role: "user", content: `<user_input>${userInput}</user_input>` },
        ],
      }),
    });
    const r1Data = await r1.json();
    params = JSON.parse(r1Data.choices[0].message.content);
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: "Translate call failed" }),
    };
  }

  if (params.refused) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        refused: true,
        refusal_reason: params.refusal_reason,
      }),
    };
  }

  // ---- REST fetch (build URL from params, fetch, transform) ----
  const books = await fetchAndTransform(params); // your existing logic

  // ---- Groq #2: narrate the results (Pattern B) ----
  const resultsSummary = books
    .map((b, i) => `${i + 1}. "${b.title}" by ${b.author} (${b.year ?? "year unknown"})`)
    .join("\n");

  let narration;
  try {
    const r2 = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT_NARRATE },
          {
            role: "user",
            content: `<user_input>${userInput}</user_input>\n<results>\n${resultsSummary}\n</results>`,
          },
        ],
      }),
    });
    const r2Data = await r2.json();
    narration = JSON.parse(r2Data.choices[0].message.content);
  } catch (err) {
    // Soft fail: render the books without narration
    narration = { intro: "", picks: [], refused: false, refusal_reason: "" };
  }

  return { statusCode: 200, body: JSON.stringify({ books, narration }) };
}
```

## What the front-end renders

```js
const data = await response.json();

if (data.refused) {
  // Groq #1 refused — no books fetched, no narration
  showRefusal(data.refusal_reason);
  return;
}

if (data.narration.refused) {
  // Groq #2 refused — books fetched, narration declined
  renderBooks(data.books);
  showRefusal(data.narration.refusal_reason, "narration");
  return;
}

// Happy path: intro + books + per-pick narration
renderIntro(data.narration.intro);
renderBooks(data.books);
renderPicks(data.narration.picks);
```

## Common pitfalls (read this list)

- **Refused #1 vs refused #2 are different states.** Render them differently. Refused #1 means "I could not even understand what you asked for"; refused #2 means "I have results but will not write commentary about them."
- **Soft-fail Groq #2 if it errors.** If the narration call throws, you still have books — render them plain. Do not blow up the whole request because the narration LLM had a hiccup.
- **Latency is real.** Two Groq calls + one REST call means three round-trips. Show a clear loading state. Consider showing the books first as soon as the REST call returns, then the narration when Groq #2 finishes (a streaming-style render).
- **Cost is real.** Two LLM calls per user request, every request. Test conservatively while you are building.
- **The length cap applies once.** Do not re-check after each Groq call — check once at the top of the handler. The user input does not change.
- **Both system prompts share the same delimited-input rule.** Do not get sloppy and skip the wrap on the second call. Both calls see user input.

## What carries over from your Week 4

Same as Pattern A and Pattern B individually (with the modifications each one calls out in its walkthrough). The new code is the orchestration — the sequencing logic between the two Groq calls, the soft-fail logic on Groq #2, and the front-end split between the two refused states.

## How the cache changes

Pattern A+B has the lowest cache value of the three patterns:

- **Free-text input is the only cache key** — same low hit rate as Pattern A.
- **Two Groq calls always run** — even on a hit, you skip the REST call but still pay for both Groq calls (translate + narrate). The savings are small.

What you can still cache: the REST results, keyed by user input. On a literal repeat, you skip the REST call; both Groq calls re-run.

### Your call

- **Drop caching** is defensible for A+B. The hit rate is low and the win is small. Most A+B implementations gain little from caching, and dropping it simplifies the function.
- **Keep caching** if you want the modest "user reloaded after a search" win. Cache `books` only — never cache either Groq output.
