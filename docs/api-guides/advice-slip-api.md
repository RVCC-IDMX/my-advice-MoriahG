# Advice Slip API guide

**Best for:** General advice / recommendations topics
**Base URL:** `https://api.adviceslip.com/`
**Auth:** None required
**CORS:** Yes (`Access-Control-Allow-Origin: *`)
**Rate limit:** No hard limit; random endpoint cached for 2 seconds

---

## Endpoints

| Endpoint                     | Description                        |
| ---------------------------- | ---------------------------------- |
| `GET /advice`                | Random advice slip (cached 2s)     |
| `GET /advice/{id}`           | Specific advice slip by numeric ID |
| `GET /advice/search/{query}` | Search slips by keyword            |

---

## Response structures

### Random advice — `GET /advice`

```json
{
  "slip": {
    "id": 143,
    "advice": "Remember that spiders are more afraid of you, than you are of them."
  }
}
```

| Field         | Type    | Description            |
| ------------- | ------- | ---------------------- |
| `slip.id`     | integer | Unique slip identifier |
| `slip.advice` | string  | The advice text        |

**Caching gotcha:** This endpoint returns the same slip for 2 seconds. Bust the cache by appending a timestamp:

```javascript
const response = await fetch(`https://api.adviceslip.com/advice?t=${Date.now()}`);
```

### Advice by ID — `GET /advice/{id}`

```javascript
const response = await fetch("https://api.adviceslip.com/advice/42");
const data = await response.json();
// data.slip.advice → "Never regret. If it's good, it's wonderful. If it's bad, it's experience."
```

Same `{ slip: { id, advice } }` structure as random.

### Search — `GET /advice/search/{query}`

```javascript
const response = await fetch("https://api.adviceslip.com/advice/search/love");
const data = await response.json();
```

```json
{
  "total_results": "10",
  "query": "love",
  "slips": [
    {
      "id": 136,
      "advice": "Love is being stupid together."
    },
    {
      "id": 121,
      "advice": "Remember that the hardest thing about learning something new is not embracing new ideas, but letting go of old ones."
    }
  ]
}
```

| Field           | Type                    | Description                       |
| --------------- | ----------------------- | --------------------------------- |
| `total_results` | **string** (not number) | Count of matching slips           |
| `query`         | string                  | The search term                   |
| `slips`         | array                   | Array of `{ id, advice }` objects |

**Important:** `total_results` is a string. Use `Number(data.total_results)` if comparing numerically.

### No results response

When a search finds nothing, the response structure changes completely:

```json
{
  "message": {
    "type": "notice",
    "text": "No advice slips found matching that search term."
  }
}
```

Students must check for `data.message` before accessing `data.slips`.

---

## How to use in a my-advice project

### Basic fetch pattern

```javascript
async function getRandomAdvice() {
  const response = await fetch(`https://api.adviceslip.com/advice?t=${Date.now()}`);
  const data = await response.json();
  return data.slip;
}
```

### Search with form input

```javascript
async function searchAdvice(query) {
  const response = await fetch(
    `https://api.adviceslip.com/advice/search/${encodeURIComponent(query)}`,
  );
  const data = await response.json();

  if (data.message) {
    // No results found
    return [];
  }

  return data.slips;
}
```

### Rendering results as cards

```javascript
function renderSlips(slips) {
  const container = document.getElementById("results");
  container.textContent = "";

  for (const slip of slips) {
    const card = document.createElement("div");
    card.classList.add("card");

    const quote = document.createElement("p");
    quote.textContent = slip.advice;

    const idTag = document.createElement("small");
    idTag.textContent = `Slip #${slip.id}`;

    card.append(quote, idTag);
    container.append(card);
  }
}
```

### Wiring to a filter form

Since this API only supports keyword search (no genre/mood/category filters), students can:

1. Use the search endpoint with a text input for keyword filtering
2. Keep a local category mapping that translates select options to search terms:

```javascript
const moodToQuery = {
  happy: "happiness",
  love: "love",
  work: "work",
  motivation: "believe",
  friendship: "friend",
};

async function getAdviceByMood(mood) {
  const query = moodToQuery[mood] || mood;
  return searchAdvice(query);
}
```

---

## Limitations

- **Small dataset:** The total number of advice slips is limited (a few hundred)
- **No category/tag system:** Only keyword search is available
- **No pagination:** Search returns all matches at once
- **2-second cache:** Random endpoint returns stale data without cache-busting
- **String numbers:** `total_results` is a string, not an integer
- **No images:** Slips are text-only — students need to design their own card visuals

## Error handling checklist

- Check for `data.message` before accessing `data.slips` on search
- Use `encodeURIComponent()` on user-entered search terms
- Add cache-busting parameter to random endpoint
- Handle network errors with try/catch around fetch
