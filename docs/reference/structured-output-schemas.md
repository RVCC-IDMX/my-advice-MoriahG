# Structured output schemas — patterns for Groq JSON mode

This document collects the schema shapes you will use for Patterns A, B, and A+B. JSON mode (`response_format: { type: "json_object" }`) tells Groq to return a JSON object; _what shape_ that object takes is up to your schema.

## What JSON mode does

Groq's JSON mode guarantees the response is parseable JSON. It does _not_ guarantee the response matches a specific schema — that is your schema's job (defined in your system prompt and validated in your code).

## Pattern A schema — translate input to API parameters

The schema is the parameter shape your REST API needs.

```js
// Open Library example (used in pattern-a-translate-input.md)
{
  "q": string,
  "subject": string | null,
  "first_publish_year_start": number | null,
  "first_publish_year_end": number | null,
  "refused": boolean,
  "refusal_reason": string
}
```

**Translate to your API.** Replace these fields with whatever your REST API takes:

- TMDB `/discover/movie`: `with_genres`, `primary_release_year`, `vote_average.gte`, `sort_by`
- wger Exercise API: `category`, `equipment`, `muscles`
- Jikan `/anime`: `genres`, `min_score`, `type`, `status`
- Deezer search: `search_query` (single string)

The **`refused` flag is universal across patterns.** Any time Groq might decide it cannot or should not process the input, it gets a polite escape hatch.

## Pattern B schema — narrate API results

```js
{
  "intro": string,
  "picks": [
    { "title": string, "why": string }
    // or { "id": number, "why": string } if you key by ID
  ],
  "refused": boolean,
  "refusal_reason": string
}
```

**`intro`** is a short overall sentence — sets the tone for the user's request.

**`picks`** is one note per result. Keep `why` short (1–2 sentences). The model is rewarded for brevity; long `why` fields drift into hallucination.

**Key by what is stable.** If your API gives every result a stable ID (TMDB `id`, Jikan `mal_id`, Open Library `key`), use that. Title-keying breaks if two results share a title.

**Render the refusal carefully.** If `refused` is true, render _only_ `refusal_reason`. Do not render `picks` or `intro` — they may be present but should be considered untrusted.

## Pattern A+B — two schemas, two calls

A+B uses both schemas above, called in sequence. The first call uses the Pattern A schema. The second call uses the Pattern B schema, with the results of the REST call passed in as a delimited summary.

There is no combined "A+B schema" — they are two independent calls with two independent schemas. Keep them that way; combining them creates a brittle prompt.

## Validating the response in code

JSON mode guarantees parseable JSON. It does NOT guarantee the keys you expect are present. Defensive parse:

```js
const raw = JSON.parse(groqResponse.choices[0].message.content);
const params = {
  q: typeof raw.q === "string" ? raw.q : "",
  subject: typeof raw.subject === "string" ? raw.subject : null,
  refused: raw.refused === true,
  refusal_reason: typeof raw.refusal_reason === "string" ? raw.refusal_reason : "",
  // ...etc
};
```

Optional but recommended for production-style polish: a tiny schema-checker (a few lines per field) catches drift between what you asked Groq for and what it actually returned.

## Refusal text — your voice

The schema _shape_ is class-wide; the refusal _prose_ is yours. A movie recommender refuses differently from a workout recommender:

> "I can recommend movies, not workout plans — try something like 'a tense 90s thriller'."

> "I am here for workouts. If you are looking for recipes, you will want a different app."

The reasoning: agency is the design principle for the final, and refusal text is part of each project's voice. Designing the failure-case response is itself part of the engineering lesson.
