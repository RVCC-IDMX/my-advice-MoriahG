# DummyJSON Recipes API guide

**Best for:** Recipe/cooking recommendation projects
**Base URL:** `https://dummyjson.com/`
**Auth:** None required
**CORS:** Yes
**Rate limit:** None documented (designed for development/testing)

---

## Endpoints

| Endpoint                            | Description             |
| ----------------------------------- | ----------------------- |
| `GET /recipes`                      | All recipes (paginated) |
| `GET /recipes/{id}`                 | Single recipe by ID     |
| `GET /recipes/search?q={query}`     | Search recipes by name  |
| `GET /recipes/tags`                 | All available tags      |
| `GET /recipes/tag/{tag}`            | Recipes by tag          |
| `GET /recipes/meal-type/{mealType}` | Recipes by meal type    |

---

## Response structure

### Paginated list response

```json
{
  "recipes": [],
  "total": 50,
  "skip": 0,
  "limit": 30
}
```

**Total recipes in database: 50** (fixed dataset)

### Recipe object

```json
{
  "id": 1,
  "name": "Classic Margherita Pizza",
  "ingredients": [
    "Pizza dough",
    "Tomato sauce",
    "Fresh mozzarella cheese",
    "Fresh basil leaves",
    "Olive oil",
    "Salt and pepper to taste"
  ],
  "instructions": [
    "Preheat the oven to 475\u00b0F (245\u00b0C).",
    "Roll out the pizza dough and spread tomato sauce evenly.",
    "Top with slices of fresh mozzarella and fresh basil leaves.",
    "Drizzle with olive oil and season with salt and pepper.",
    "Bake in the preheated oven for 12-15 minutes or until the crust is golden brown.",
    "Slice and serve hot."
  ],
  "prepTimeMinutes": 20,
  "cookTimeMinutes": 15,
  "servings": 4,
  "difficulty": "Easy",
  "cuisine": "Italian",
  "caloriesPerServing": 300,
  "tags": ["Pizza", "Italian"],
  "userId": 166,
  "image": "https://cdn.dummyjson.com/recipe-images/1.webp",
  "rating": 4.6,
  "reviewCount": 98,
  "mealType": ["Dinner"]
}
```

### Field reference

| Field                | Type     | Description                               |
| -------------------- | -------- | ----------------------------------------- |
| `id`                 | integer  | Recipe ID                                 |
| `name`               | string   | Recipe name                               |
| `ingredients`        | string[] | List of ingredients                       |
| `instructions`       | string[] | Step-by-step instructions                 |
| `prepTimeMinutes`    | integer  | Prep time in minutes                      |
| `cookTimeMinutes`    | integer  | Cook time in minutes                      |
| `servings`           | integer  | Number of servings                        |
| `difficulty`         | string   | `"Easy"` or `"Medium"`                    |
| `cuisine`            | string   | Cuisine type (e.g., "Italian", "Mexican") |
| `caloriesPerServing` | integer  | Calories per serving                      |
| `tags`               | string[] | Descriptive tags                          |
| `userId`             | integer  | Creator user ID                           |
| `image`              | string   | Full image URL (WebP format)              |
| `rating`             | number   | Rating (float, e.g., 4.6)                 |
| `reviewCount`        | integer  | Number of reviews                         |
| `mealType`           | string[] | Meal types (e.g., ["Dinner", "Lunch"])    |

---

## Query parameters (apply to all list endpoints)

| Parameter | Type    | Default    | Description                                                  |
| --------- | ------- | ---------- | ------------------------------------------------------------ |
| `limit`   | integer | 30         | Items per page (set to 0 for all)                            |
| `skip`    | integer | 0          | Items to skip (pagination offset)                            |
| `sortBy`  | string  | -          | Field to sort by (e.g., `name`, `rating`, `cookTimeMinutes`) |
| `order`   | string  | `asc`      | Sort direction: `asc` or `desc`                              |
| `select`  | string  | all fields | Comma-separated field names to return                        |
| `q`       | string  | -          | Search query (on `/search` endpoint only)                    |

### Select specific fields

Reduce response size by requesting only needed fields:

```
GET /recipes?limit=10&select=name,cuisine,tags,rating,image
```

---

## Available filter values

### Cuisine values (21)

American, Asian, Brazilian, Cocktail, Greek, Hawaiian, Indian, Italian, Japanese, Korean, Lebanese, Mediterranean, Mexican, Moroccan, Pakistani, Russian, Smoothie, Spanish, Thai, Turkish, Vietnamese

### Meal type values (9)

Appetizer, Beverage, Breakfast, Dessert, Dinner, Lunch, Side Dish, Snack, Snacks

### Difficulty values (2)

Easy, Medium

### Tags (88 total, most useful listed)

Asian, Baking, Beef, Chicken, Cookies, Curry, Dessert, Grilling, Italian, Japanese, Korean, Main course, Mediterranean, Mexican, Pasta, Pizza, Quick, Rice, Salad, Smoothie, Soup, Stir-fry, Thai, Vegetarian, Vietnamese, Wrap

Full tag list available at `GET /recipes/tags` (returns a flat JSON array of strings).

---

## How to use in a my-advice project

### Fetch all recipes

```javascript
const BASE_URL = "https://dummyjson.com";

async function getAllRecipes() {
  const response = await fetch(`${BASE_URL}/recipes?limit=0`);
  const data = await response.json();
  return data.recipes;
}
```

### Search by name

```javascript
async function searchRecipes(query) {
  const response = await fetch(`${BASE_URL}/recipes/search?q=${encodeURIComponent(query)}`);
  const data = await response.json();
  return data.recipes;
}
```

### Filter by tag

```javascript
async function getRecipesByTag(tag) {
  const response = await fetch(`${BASE_URL}/recipes/tag/${encodeURIComponent(tag)}`);
  const data = await response.json();
  return data.recipes;
}
```

### Filter by meal type

```javascript
async function getRecipesByMealType(mealType) {
  const response = await fetch(`${BASE_URL}/recipes/meal-type/${encodeURIComponent(mealType)}`);
  const data = await response.json();
  return data.recipes;
}
```

### Client-side filtering for fields without API endpoints

The API has no endpoint for filtering by cuisine, difficulty, or rating. Fetch all 50 recipes once and filter in JavaScript:

```javascript
let allRecipes = [];

async function loadRecipes() {
  const response = await fetch(`${BASE_URL}/recipes?limit=0`);
  const data = await response.json();
  allRecipes = data.recipes;
}

function filterRecipes(cuisine, difficulty, minRating, mealType) {
  return allRecipes.filter((recipe) => {
    if (cuisine && recipe.cuisine !== cuisine) return false;
    if (difficulty && recipe.difficulty !== difficulty) return false;
    if (minRating && recipe.rating < Number(minRating)) return false;
    if (mealType && !recipe.mealType.includes(mealType)) return false;
    return true;
  });
}
```

### Rendering recipe cards

```javascript
function renderRecipes(recipes) {
  const container = document.getElementById("results");
  container.textContent = "";

  for (const recipe of recipes) {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = recipe.image;
    img.alt = recipe.name;

    const title = document.createElement("h3");
    title.textContent = recipe.name;

    const meta = document.createElement("p");
    meta.textContent = `${recipe.cuisine} | ${recipe.difficulty} | ${recipe.prepTimeMinutes + recipe.cookTimeMinutes} min`;

    const rating = document.createElement("p");
    rating.textContent = `Rating: ${recipe.rating}/5 (${recipe.reviewCount} reviews)`;

    const tags = document.createElement("p");
    tags.textContent = recipe.tags.join(", ");

    card.append(img, title, meta, rating, tags);
    container.append(card);
  }
}
```

### Populating filter selects dynamically

```javascript
function populateSelects(recipes) {
  const cuisines = [...new Set(recipes.map((r) => r.cuisine))].sort();
  const mealTypes = [...new Set(recipes.flatMap((r) => r.mealType))].sort();

  populateSelect("cuisine-select", cuisines);
  populateSelect("meal-type-select", mealTypes);
}

function populateSelect(selectId, values) {
  const select = document.getElementById(selectId);
  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  }
}
```

---

## Gotchas and tips

- **Fixed dataset (50 recipes):** Small but sufficient for prototyping. Students can fetch all at once with `limit=0` and filter client-side.
- **No cuisine/difficulty endpoints:** Must filter client-side after fetching all recipes.
- **Tag and meal-type endpoints exist:** Use these for server-side filtering by tag or meal type.
- **Images are WebP:** All images are `.webp` format — supported by all modern browsers.
- **`mealType` is an array:** A recipe can belong to multiple meal types (e.g., `["Lunch", "Dinner"]`). Use `.includes()` for filtering.
- **`ingredients` and `instructions` are arrays:** Each step/ingredient is a separate string, making them easy to render as lists.
- **`select` parameter:** Great for reducing payload if students only need a few fields for cards.
- **Simulated write operations:** POST/PUT/PATCH/DELETE endpoints exist but don't persist changes — useful for learning but not real.
