# Final project suggestions for what-pet-should-i-get

> [!IMPORTANT]
> Before starting the final, complete and close your "Pre-final feedback" issue.

## Your Week 4 starting point (recap)

Your Week 4 was substantive — five sequential commits, parts in order, ending with a live Netlify deployment at what-pet-should-i-get.netlify.app. Your serverless function `netlify/functions/api.mjs` fetches TheDogAPI's `/breeds` endpoint and transforms each breed into your app's shape with three new enrichment fields (`breedGroup`, `origin`, `description`) plus computed values (`size` from weight buckets, `lifeSpan` from a parsed range string, `temperament` split into an array). When you discovered TheDogAPI had stopped returning the `image` property mid-semester, you didn't fall back to placeholders — you built a second serverless function (`netlify/functions/image.mjs`) that fetches images dynamically through `/image/search?breed_id=${id}`. That "the data shape doesn't fit, so I'll add another function" instinct is the same muscle the final's Groq call uses. You also paginated rather than load all 627 breeds at once, and your three-tier cache (`dogBreedsCache`, `breedImage_${id}`, `noPhotoBreeds`) prevents re-fetching breeds you already know have no photo. That defensive caching pattern transfers directly to whatever shape your Groq response takes.

## How each pattern fits your project

### Pattern A — translate input to API params

**Uniquely strong fit. The single cleanest case in the cohort.** Your current UI is a multi-step filter form — pick a class, then a species, then a breed, then size and temperament. That cascading-dropdown structure exists because the breed taxonomy is multi-level. Pattern A collapses all of it into one input: "a small calm dog that's good with kids" → Groq returns `{ "size": "small", "temperaments": ["calm", "good with children"], "breed_group"?: string }`. The dropdowns become unnecessary; the underlying filter logic you already wrote runs unchanged. No other student in the cohort has this clean a "natural language replaces a multi-step form" mapping.

### Pattern B — narrate the API results

Moderate fit. Pet recommendations are a domain where commentary helps — "here's why a Cavalier King Charles Spaniel matches what you described — they're small, gentle, and bred to be companion dogs" is more useful than displaying the bare `description` field. Your `description` and `temperament` fields are rich enough to feed into a "why this breed" prompt, and your existing card layout already has a slot for narrative text. The win is smaller than Pattern A's UX collapse, but it's real.

### Pattern A+B — both, chained

Worth the two calls. The natural-language input is the headline feature; the narrated output completes the assistant feel. For your project specifically, the chained version is what most clearly distinguishes your final from your Week 4 — Week 4 is a filter app with great enrichment, A+B is a conversational pet matcher.

## What carries over (and what doesn't)

- **Your `transformBreed` function** — stays. The shape stays the same. Pattern A produces filter params; the transformed breed objects are still what get rendered.
- **Your two serverless functions** — both stay. `api.mjs` keeps fetching breeds; `image.mjs` keeps fetching dynamic images. You add a third function for the Groq call.
- **Your three-tier cache** — stays for breeds and images. Decide whether to cache Groq responses too. Argument for caching: identical user inputs should return identical responses for free. Argument against: per-request narration is supposed to feel personal, and stale narration ages worse than stale breed data. Either is defensible — name your decision in the reflection.
- **Your views.js** — keeps `createElement` + `textContent`. Add a refusal renderer for `refused: true`. For Pattern B, add a render hook for per-breed `why_this_breed` text.
- **Your pagination** — stays. Pattern A returns filter params, then your existing breed array (already paginated) gets filtered client-side.
- **What changes** — your form (depending on pattern). Pattern A replaces the cascading dropdowns with a single input. Pattern B keeps the form; A+B replaces the form and adds narration.

## A sketched Pattern A schema for TheDogAPI breed filtering

```js
{
  "size": "small" | "medium" | "large" | null,           // matches your sizeFromWeight buckets
  "temperaments": string[],                              // free-form; matched against breed.temperament array
  "breed_group": string | null,                          // "Sporting" | "Working" | "Toy" | etc.
  "max_life_span": number | null,                        // optional minimum lifespan
  "refused": boolean,
  "refusal_reason": string
}
```

The matcher logic stays in JavaScript. Groq translates "good with kids and not too big" into `{ size: "small" | "medium", temperaments: ["good with children", "gentle"] }`. Your existing breed array — already transformed and cached — gets filtered against those criteria. If Groq returns `refused: true`, you render the `refusal_reason` instead of running the filter.

## My soft recommendation

If I had to pick one for you, I would pick **Pattern A** as the headline. Your project has the strongest Pattern A fit in the cohort because the cascading-dropdown UI exists specifically to handle a multi-dimensional taxonomy — and Pattern A's whole purpose is to collapse that kind of taxonomy into one input. Start there. If Pattern A is shipping cleanly with time to spare, layer Pattern B on top to A+B; the per-breed "why this breed" commentary is the kind of polish that compounds well with your existing rich `description` and `temperament` data.

The Pattern B-only path would also work, but it leaves the dropdown cascade in place — and the dropdown cascade is the part of your Week 4 that most obviously belongs to a "form-driven" era of the app rather than a "talk to it" era.

## What to read next

- `INSTRUCTIONS.md` — the assignment overview
- `CHECKLIST.md` — concrete deliverables
- `docs/tutorials/pattern-a-translate-input.md` — Pattern A walkthrough; translate the schema to TheDogAPI's filter shape
- `docs/tutorials/groq-moderation-floor.md` — the four required defenses (system prompt, JSON mode, delimited input, length cap)
