# TheDogAPI guide

**Best for:** Dog breed recommendation / "What dog breed is right for me?" projects
**Base URL:** `https://api.thedogapi.com/v1/`
**Auth:** API key in `x-api-key` header (free signup)
**CORS:** Yes
**Rate limit:** 10,000 requests/month on free tier
**Difficulty:** Beginner — simple key auth, no OAuth flow

---

## Getting your key

1. Sign up at [thedogapi.com/signup](https://thedogapi.com/signup) — email and password only, no credit card
2. Confirm via the email link
3. Your API key arrives in the confirmation email (also visible in your dashboard)
4. Include in requests as `x-api-key: your_key_here`

The `/breeds` endpoint works without a key for testing — try it in your browser before signing up.

---

## Endpoints

| Endpoint                       | Description                            | Key required |
| ------------------------------ | -------------------------------------- | ------------ |
| `GET /breeds`                  | List all breeds (paginated)            | No           |
| `GET /breeds/{id}`             | Single breed details                   | No           |
| `GET /breeds/search?q={query}` | Search breeds by name                  | No           |
| `GET /images/search`           | Random dog images, filterable by breed | Yes          |
| `GET /images/{id}`             | Single image details                   | Yes          |

For a my-advice project, `/breeds` is what you want — it returns the full breed catalog with metadata in one call.

---

## Response structure

### `GET /breeds` returns an array of breed objects

```json
[
  {
    "id": 1,
    "name": "Affenpinscher",
    "weight": {
      "imperial": "6 - 13",
      "metric": "3 - 6"
    },
    "height": {
      "imperial": "9 - 11.5",
      "metric": "23 - 29"
    },
    "bred_for": "Small rodent hunting, lapdog",
    "breed_group": "Toy",
    "life_span": "10 - 12 years",
    "temperament": "Stubborn, Curious, Playful, Adventurous, Active, Fun-loving",
    "origin": "Germany, France",
    "reference_image_id": "BJa4kxc4X",
    "image": {
      "id": "BJa4kxc4X",
      "width": 1600,
      "height": 1199,
      "url": "https://cdn2.thedogapi.com/images/BJa4kxc4X.jpg"
    }
  }
]
```

### Field reference

| Field                | Type             | Description                                                   |
| -------------------- | ---------------- | ------------------------------------------------------------- |
| `id`                 | integer          | TheDogAPI breed ID                                            |
| `name`               | string           | Breed name                                                    |
| `weight.imperial`    | string           | Pounds range, e.g. `"6 - 13"`                                 |
| `weight.metric`      | string           | Kilograms range, e.g. `"3 - 6"`                               |
| `height.imperial`    | string           | Inches range                                                  |
| `height.metric`      | string           | Centimeters range                                             |
| `life_span`          | string           | e.g. `"10 - 12 years"`                                        |
| `temperament`        | string or absent | Comma-separated traits, e.g. `"Stubborn, Curious, Playful"`   |
| `breed_group`        | string or absent | Toy, Hound, Sporting, Working, Herding, Terrier, Non-Sporting |
| `bred_for`           | string or absent | Original purpose, e.g. `"Small rodent hunting, lapdog"`       |
| `origin`             | string or absent | Country/countries of origin                                   |
| `image.url`          | string           | Reference image URL                                           |
| `reference_image_id` | string           | Image ID — useful for fetching alternate sizes                |

### What can be missing

`temperament`, `breed_group`, `bred_for`, and `origin` are not present on every breed. Always guard with `||` defaults when reading them:

```javascript
const traits = (breed.temperament || "").split(", ").filter(Boolean);
const group = breed.breed_group || "Unknown";
```

`weight` and `height` ranges are strings, not numbers. Parse them when you need numeric comparisons.

---

## How to use in a my-advice project

### Fetching all breeds

```javascript
const BASE_URL = "https://api.thedogapi.com/v1";

async function fetchBreeds() {
  const response = await fetch(`${BASE_URL}/breeds`, {
    headers: { "x-api-key": API_KEY },
  });
  if (!response.ok) {
    throw new Error(`TheDogAPI returned ${response.status}`);
  }
  return response.json();
}
```

The full breed list is small enough (~170 breeds) to fetch once and cache in localStorage.

### Through a Netlify serverless function

In Week 4 you'll wire this through a serverless function so your API key stays server-side:

```javascript
// netlify/functions/dogs.mjs
export default async function handler(request) {
  const response = await fetch("https://api.thedogapi.com/v1/breeds", {
    headers: { "x-api-key": process.env.DOG_API_KEY },
  });
  const breeds = await response.json();
  return new Response(JSON.stringify(breeds), {
    headers: { "Content-Type": "application/json" },
  });
}
```

Set `DOG_API_KEY` in your Netlify site environment variables. Your client code calls `/api/dogs` (your function URL), not the API directly.

### Transforming API data into your view shape

If your views currently expect items shaped like `{ id, name, image, imageAlt, temperament, lifeSpan, size, ... }`, your transform turns API breeds into that shape:

```javascript
function parseRange(rangeString) {
  // "10 - 12 years" → [10, 12]
  // "3 - 6" → [3, 6]
  if (!rangeString) return [null, null];
  const numbers = rangeString.match(/\d+(\.\d+)?/g);
  if (!numbers || numbers.length < 2) return [null, null];
  return [Number(numbers[0]), Number(numbers[1])];
}

function sizeFromWeight(weightKg) {
  // weight in kg → size category
  const [min, max] = parseRange(weightKg);
  if (max === null) return "unknown";
  const avg = (min + max) / 2;
  if (avg < 10) return "small";
  if (avg < 25) return "medium";
  return "large";
}

function transformBreed(breed) {
  return {
    id: String(breed.id),
    name: breed.name,
    image: breed.image?.url || "",
    imageAlt: `Photo of ${breed.name}`,
    temperament: (breed.temperament || "").split(", ").filter(Boolean),
    lifeSpan: parseRange(breed.life_span),
    size: sizeFromWeight(breed.weight?.metric),
    breedGroup: breed.breed_group || "Unknown",
    bredFor: breed.bred_for || "",
    origin: breed.origin || "Unknown",
  };
}
```

Where you used to write `import { breeds } from './breeds.js'`, you now write `const breeds = (await fetchBreeds()).map(transformBreed)` and the rest of your code stays the same.

### Filtering pattern

Your existing `filters.js` doesn't need to change — feed it the transformed breeds and your `matchesFilter`, `matchesDropdownRange`, and descriptor-driven filter logic all keep working:

```javascript
const allBreeds = await loadBreedsFromCacheOrFetch();
const transformed = allBreeds.map(transformBreed);
const { results } = filterPets(getFilters(...), transformed);
showResults(results, resultsSection);
```

### localStorage caching pattern

```javascript
const CACHE_KEY = "dogBreedsCache";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { timestamp, data } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
  } catch {
    // localStorage full or unavailable — fall through
  }
}

async function loadBreedsFromCacheOrFetch() {
  const cached = readCache();
  if (cached) return cached;
  const fresh = await fetchBreeds();
  writeCache(fresh);
  return fresh;
}
```

---

## Gotchas and tips

- **Comma-separated strings, not arrays.** `temperament` looks array-like but is a single string. Split on `", "` to get an array.
- **Range fields are strings.** `weight.metric`, `life_span`, `height.imperial` — all strings with a hyphen separator. Parse with `match(/\d+/g)` if you need numbers.
- **Optional fields really are optional.** Some breeds have no `temperament`, no `bred_for`, no `breed_group`, no `origin`. Always guard.
- **One fetch covers everything.** The full breed list is ~170 entries. You don't need pagination — just fetch once, cache, and filter client-side.
- **No "good with children" or "good with pets" fields.** TheDogAPI does not return these. If your filter UI needs them, either drop those filters or infer them from temperament keywords (and be honest in your reflection that you invented the data).
- **Reference images are stable.** Each breed has one canonical image — they don't rotate. Good for caching, predictable for testing.
- **Free tier is generous.** 10,000 requests/month means you would need to deploy and refetch every 4 minutes for a full month to hit the limit. With caching, you'll use ~30 requests total during development.
- **The `/images/search` endpoint** can give you multiple images per breed if you want a gallery. Requires the API key.
