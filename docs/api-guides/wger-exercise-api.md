# wger Workout Manager API guide

**Best for:** Workout/exercise recommendation projects (ivsanpedro)
**Base URL:** `https://wger.de/api/v2/`
**Auth:** None required for read-only endpoints
**CORS:** Yes
**Rate limit:** Not documented (open source project, be respectful)

---

## Key endpoints

| Endpoint                                | Description                                                     |
| --------------------------------------- | --------------------------------------------------------------- |
| `GET /exercise/?format=json&language=2` | List exercises (language=2 is English)                          |
| `GET /exercise/{id}/?format=json`       | Single exercise                                                 |
| `GET /exerciseinfo/?format=json`        | Exercises with full nested details (muscles, equipment, images) |
| `GET /exercisecategory/?format=json`    | All exercise categories (muscle groups)                         |
| `GET /equipment/?format=json`           | All equipment types                                             |
| `GET /muscle/?format=json`              | All muscles                                                     |
| `GET /exerciseimage/?format=json`       | Exercise images                                                 |

**Important:** Always include `format=json` — the API defaults to HTML otherwise. Always include `language=2` on exercise endpoints to get English descriptions.

---

## Response structure

### Paginated list response

```json
{
  "count": 500,
  "next": "https://wger.de/api/v2/exercise/?format=json&language=2&limit=20&offset=20",
  "previous": null,
  "results": []
}
```

### Exercise object (from `/exercise/`)

```json
{
  "id": 345,
  "uuid": "abc-123-def",
  "name": "Bicep Curls",
  "exercise_base": 100,
  "description": "<p>Stand with a dumbbell in each hand...</p>",
  "creation_date": "2015-06-12",
  "category": 8,
  "muscles": [1],
  "muscles_secondary": [13],
  "equipment": [3],
  "language": 2,
  "license": 2,
  "license_author": "wger.de",
  "variations": [100, 200]
}
```

### Exercise info object (from `/exerciseinfo/` — richer)

```json
{
  "id": 100,
  "uuid": "abc-123-def",
  "name": "Bicep Curls",
  "aliases": ["Arm Curls"],
  "description": "<p>Stand with a dumbbell in each hand...</p>",
  "creation_date": "2015-06-12",
  "category": {
    "id": 8,
    "name": "Arms"
  },
  "muscles": [{ "id": 1, "name": "Biceps brachii", "name_en": "Biceps", "is_front": true }],
  "muscles_secondary": [{ "id": 13, "name": "Brachialis", "name_en": "", "is_front": true }],
  "equipment": [{ "id": 3, "name": "Dumbbell" }],
  "images": [
    {
      "id": 50,
      "uuid": "xyz-456",
      "exercise_base": 100,
      "image": "https://wger.de/media/exercise-images/100/abc.jpg",
      "is_main": true,
      "style": "1"
    }
  ],
  "videos": [],
  "comments": [],
  "variations": null
}
```

### Field reference (exercise object)

| Field               | Type                                    | Description                               |
| ------------------- | --------------------------------------- | ----------------------------------------- |
| `id`                | integer                                 | Exercise ID                               |
| `name`              | string                                  | Exercise name                             |
| `description`       | string                                  | HTML description (may contain `<p>` tags) |
| `category`          | integer (or object in exerciseinfo)     | Category/muscle group ID                  |
| `muscles`           | integer[] (or object[] in exerciseinfo) | Primary muscle IDs                        |
| `muscles_secondary` | integer[] (or object[])                 | Secondary muscle IDs                      |
| `equipment`         | integer[] (or object[])                 | Equipment IDs                             |
| `creation_date`     | string                                  | Date created (YYYY-MM-DD)                 |
| `language`          | integer                                 | Language ID (2 = English)                 |

### Field reference (exercise info additions)

| Field                | Type     | Description                       |
| -------------------- | -------- | --------------------------------- |
| `aliases`            | string[] | Alternative names                 |
| `category.name`      | string   | Category name (e.g., "Arms")      |
| `muscles[].name_en`  | string   | English muscle name               |
| `muscles[].is_front` | boolean  | Front or back of body             |
| `equipment[].name`   | string   | Equipment name                    |
| `images[].image`     | string   | Full image URL                    |
| `images[].is_main`   | boolean  | Whether this is the primary image |

---

## Categories (muscle groups)

| ID  | Name      |
| --- | --------- |
| 8   | Arms      |
| 9   | Legs      |
| 10  | Abs       |
| 11  | Chest     |
| 12  | Back      |
| 13  | Shoulders |
| 14  | Calves    |
| 15  | Cardio    |

Fetch with `GET /exercisecategory/?format=json`.

## Equipment

| ID  | Name              |
| --- | ----------------- |
| 1   | Barbell           |
| 2   | SZ-Bar            |
| 3   | Dumbbell          |
| 4   | Gym mat           |
| 5   | Swiss Ball        |
| 6   | Pull-up bar       |
| 7   | none (bodyweight) |
| 8   | Bench             |
| 9   | Incline bench     |
| 10  | Kettlebell        |

Fetch with `GET /equipment/?format=json`.

## Muscles

| ID  | Name              | ID  | Name               |
| --- | ----------------- | --- | ------------------ |
| 1   | Biceps brachii    | 2   | Anterior deltoid   |
| 3   | Serratus anterior | 4   | Pectoralis major   |
| 5   | Triceps brachii   | 6   | Rectus abdominis   |
| 7   | Gastrocnemius     | 8   | Gluteus maximus    |
| 9   | Trapezius         | 10  | Quadriceps femoris |
| 11  | Biceps femoris    | 12  | Latissimus dorsi   |
| 13  | Brachialis        | 14  | Obliquus externus  |
| 15  | Soleus            | 16  | Infraspinatus      |

Fetch with `GET /muscle/?format=json`.

---

## Query parameters for filtering exercises

| Parameter           | Type    | Description                                         |
| ------------------- | ------- | --------------------------------------------------- |
| `format`            | string  | **Required:** `json`                                |
| `language`          | integer | **Required for English:** `2`                       |
| `category`          | integer | Filter by muscle group ID                           |
| `equipment`         | integer | Filter by equipment ID                              |
| `muscles`           | integer | Filter by primary muscle ID                         |
| `muscles_secondary` | integer | Filter by secondary muscle ID                       |
| `limit`             | integer | Results per page (default 20)                       |
| `offset`            | integer | Pagination offset                                   |
| `ordering`          | string  | Sort field (prefix `-` for descending, e.g., `-id`) |

### Example filtered request

```
GET /exercise/?format=json&language=2&category=8&equipment=3&limit=10
```

This returns English exercises for Arms using Dumbbells, 10 per page.

---

## How to use in a my-advice project

### Basic fetch

```javascript
const WGER_URL = "https://wger.de/api/v2";

async function getExercises() {
  const response = await fetch(`${WGER_URL}/exercise/?format=json&language=2&limit=20`);
  const data = await response.json();
  return data.results;
}
```

### Fetch with full details (exerciseinfo)

```javascript
async function getExerciseInfo(limit = 20) {
  const response = await fetch(`${WGER_URL}/exerciseinfo/?format=json&limit=${limit}`);
  const data = await response.json();
  return data.results;
}
```

### Filtered search from form

```javascript
async function filterExercises(category, equipment) {
  const params = new URLSearchParams({
    format: "json",
    language: "2",
    limit: "20",
  });

  if (category) params.set("category", category);
  if (equipment) params.set("equipment", equipment);

  const response = await fetch(`${WGER_URL}/exercise/?${params}`);
  const data = await response.json();
  return data.results;
}
```

### Rendering exercise cards

```javascript
function renderExercises(exercises) {
  const container = document.getElementById("results-list");
  container.textContent = "";

  for (const exercise of exercises) {
    const card = document.createElement("div");
    card.classList.add("card");

    const title = document.createElement("h3");
    title.textContent = exercise.name;

    const desc = document.createElement("div");
    // description is HTML — use DOMParser to safely extract text
    const parser = new DOMParser();
    const doc = parser.parseFromString(exercise.description, "text/html");
    desc.textContent = doc.body.textContent || "No description available.";

    card.append(title, desc);
    container.append(card);
  }
}
```

### Mapping to ivsanpedro's existing form

Ivana's form has selects for workout type, target area, equipment, duration, and difficulty:

| Form field   | wger approach         | Notes                                                                               |
| ------------ | --------------------- | ----------------------------------------------------------------------------------- |
| Workout Type | `category` parameter  | Map "Cardio" -> 15, "Strength" -> multiple categories                               |
| Target Area  | `category` parameter  | Map "Upper Body" -> 11,12,13, "Lower Body" -> 9,14, "Core" -> 10                    |
| Equipment    | `equipment` parameter | Map "No Equipment" -> 7, "Dumbbells" -> 3, "Kettlebell" -> 10                       |
| Duration     | No API parameter      | Client-side grouping (show fewer or more exercises)                                 |
| Difficulty   | No API parameter      | Not available in wger — remove select or filter client-side by description keywords |

```javascript
const targetToCategories = {
  "Full Body": "",
  "Upper Body": "11", // Chest (also filter for 8, 12, 13 client-side)
  "Lower Body": "9", // Legs
  Core: "10", // Abs
};

const equipmentMap = {
  "No Equipment": "7",
  Dumbbells: "3",
  "Resistance Bands": "", // Not in wger — skip or filter client-side
  Kettlebell: "10",
};
```

### Using exerciseinfo for richer cards

```javascript
async function getRichExercises(category, equipment) {
  // exerciseinfo returns nested objects instead of IDs
  const params = new URLSearchParams({
    format: "json",
    limit: "20",
  });

  if (category) params.set("category", category);
  if (equipment) params.set("equipment", equipment);

  const response = await fetch(`${WGER_URL}/exerciseinfo/?${params}`);
  const data = await response.json();

  // Filter to English-named exercises
  return data.results.filter((ex) => ex.name && ex.name.trim() !== "");
}

function renderRichExercise(exercise) {
  const card = document.createElement("div");
  card.classList.add("card");

  // Image (if available)
  if (exercise.images && exercise.images.length > 0) {
    const img = document.createElement("img");
    img.src = exercise.images[0].image;
    img.alt = `${exercise.name} illustration`;
    card.append(img);
  }

  const title = document.createElement("h3");
  title.textContent = exercise.name;

  const category = document.createElement("p");
  category.textContent = exercise.category.name;

  const muscles = document.createElement("p");
  muscles.textContent = `Muscles: ${exercise.muscles.map((m) => m.name_en || m.name).join(", ")}`;

  const equip = document.createElement("p");
  equip.textContent = `Equipment: ${exercise.equipment.map((e) => e.name).join(", ") || "None"}`;

  card.append(title, category, muscles, equip);
  return card;
}
```

---

## Gotchas and tips

- **Always include `format=json`:** The API defaults to an HTML browsable view without it.
- **Always include `language=2`:** Without this, you get exercises in all languages (German, Spanish, etc.) mixed together.
- **Description is HTML:** The `description` field contains HTML tags (`<p>`, `<ul>`, etc.). Either render as innerHTML (with DOMPurify) or extract text with DOMParser.
- **exerciseinfo vs exercise:** Use `/exerciseinfo/` for display (nested objects with names and images). Use `/exercise/` for filtered queries (accepts category/equipment params, returns IDs).
- **Missing data:** Many exercises have empty descriptions or no images. Build UI that handles missing data gracefully.
- **No difficulty field:** wger does not track exercise difficulty. Students could remove that select from their form or add client-side categorization.
- **No duration field:** Exercises don't have duration — students can adjust how many exercises they display based on their duration select.
- **Pagination:** Default page size is 20. Use `limit` and `offset` for pagination. The `next` and `previous` fields in the response provide full URLs for page navigation.
- **Muscle filtering returns exercises:** The `muscles` parameter filters by primary muscle, returning exercises that target that specific muscle.

## Alternative: API Ninjas Exercises

If wger proves too complex, [API Ninjas](https://api-ninjas.com/api/exercises) is simpler but requires a free API key:

```javascript
const response = await fetch(
  "https://api.api-ninjas.com/v1/exercises?muscle=biceps&difficulty=beginner",
  {
    headers: { "X-Api-Key": "YOUR_KEY" },
  },
);
```

Returns: `[{ name, type, muscle, equipment, difficulty, instructions }]` — simpler flat structure, includes difficulty field, but requires signup.
