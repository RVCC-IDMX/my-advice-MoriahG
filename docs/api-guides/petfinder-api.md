# Petfinder API guide

**Best for:** Pet adoption finder / "What pet should I adopt?" projects
**Base URL:** `https://api.petfinder.com/v2/`
**Auth:** OAuth 2.0 client credentials (free signup)
**CORS:** Yes
**Rate limit:** Not publicly documented; generous for student use
**Difficulty:** Intermediate — requires OAuth token flow

---

## Getting your credentials

1. Create a free account at [petfinder.com](https://www.petfinder.com)
2. Visit [petfinder.com/developers](https://www.petfinder.com/developers/)
3. Select a reason for use, accept terms, click "Request a Key"
4. You receive a `client_id` (API key) and `client_secret`

---

## Authentication: OAuth 2.0 token flow

Before making any data requests, you must obtain a Bearer token.

### Getting a token

```javascript
async function getToken(clientId, clientSecret) {
  const response = await fetch("https://api.petfinder.com/v2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
  });

  const data = await response.json();
  return data.access_token;
}
```

### Token response

```json
{
  "token_type": "Bearer",
  "expires_in": 3600,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOi..."
}
```

- Token expires after **1 hour** (3600 seconds)
- Request a new token when the current one expires
- Include in all subsequent requests as `Authorization: Bearer {token}`

### Token management pattern

```javascript
let accessToken = null;
let tokenExpiry = 0;

const CLIENT_ID = "your_client_id";
const CLIENT_SECRET = "your_client_secret";

async function ensureToken() {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const response = await fetch("https://api.petfinder.com/v2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
  });

  const data = await response.json();
  accessToken = data.access_token;
  // Refresh 5 minutes early to avoid edge cases
  tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;
  return accessToken;
}
```

---

## Endpoints

| Endpoint                   | Description                 |
| -------------------------- | --------------------------- |
| `POST /oauth2/token`       | Get access token            |
| `GET /animals`             | Search adoptable animals    |
| `GET /animals/{id}`        | Single animal details       |
| `GET /types`               | List all animal types       |
| `GET /types/{type}`        | Details for a specific type |
| `GET /types/{type}/breeds` | Breeds for a type           |
| `GET /organizations`       | Search rescue organizations |
| `GET /organizations/{id}`  | Single organization details |

### Animal types

`dog`, `cat`, `rabbit`, `small-furry`, `horse`, `bird`, `scales-fins-other`, `barnyard`

---

## Response structure

### Paginated list response

```json
{
  "animals": [],
  "pagination": {
    "count_per_page": 20,
    "total_count": 5432,
    "current_page": 1,
    "total_pages": 272,
    "_links": {
      "next": { "href": "/v2/animals?page=2" }
    }
  }
}
```

### Animal object

```json
{
  "id": 12345,
  "organization_id": "NJ333",
  "url": "https://www.petfinder.com/dog/buddy-12345/nj/sometown/nj333/",
  "type": "Dog",
  "species": "Dog",
  "breeds": {
    "primary": "Labrador Retriever",
    "secondary": "Golden Retriever",
    "mixed": true,
    "unknown": false
  },
  "colors": {
    "primary": "Yellow / Tan / Blond / Fawn",
    "secondary": null,
    "tertiary": null
  },
  "age": "Young",
  "gender": "Male",
  "size": "Large",
  "coat": "Short",
  "name": "Buddy",
  "description": "Buddy is a sweet and playful dog...",
  "photos": [
    {
      "small": "https://dl5zpyw5k3jeb.cloudfront.net/.../width=100",
      "medium": "https://dl5zpyw5k3jeb.cloudfront.net/.../width=300",
      "large": "https://dl5zpyw5k3jeb.cloudfront.net/.../width=600",
      "full": "https://dl5zpyw5k3jeb.cloudfront.net/.../width=1024"
    }
  ],
  "videos": [],
  "status": "adoptable",
  "attributes": {
    "spayed_neutered": true,
    "house_trained": true,
    "declawed": false,
    "special_needs": false,
    "shots_current": true
  },
  "environment": {
    "children": true,
    "dogs": true,
    "cats": null
  },
  "tags": ["Friendly", "Playful", "Trained"],
  "contact": {
    "email": "org@example.com",
    "phone": "555-555-5555",
    "address": {
      "address1": "123 Main St",
      "address2": null,
      "city": "Sometown",
      "state": "NJ",
      "postcode": "08801",
      "country": "US"
    }
  },
  "published_at": "2026-03-15T12:00:00+0000",
  "distance": 5.2
}
```

### Field reference

| Field                        | Type            | Description                                           |
| ---------------------------- | --------------- | ----------------------------------------------------- |
| `id`                         | integer         | Petfinder animal ID                                   |
| `type`                       | string          | Animal type (Dog, Cat, etc.)                          |
| `species`                    | string          | Species name                                          |
| `name`                       | string          | Animal's name                                         |
| `description`                | string or null  | Bio/description text                                  |
| `age`                        | string          | Baby, Young, Adult, Senior                            |
| `gender`                     | string          | Male, Female, Unknown                                 |
| `size`                       | string          | Small, Medium, Large, Extra Large                     |
| `coat`                       | string or null  | Short, Medium, Long, Wire, Hairless, Curly            |
| `status`                     | string          | adoptable, adopted, found                             |
| `breeds.primary`             | string          | Primary breed                                         |
| `breeds.secondary`           | string or null  | Secondary breed (if mixed)                            |
| `breeds.mixed`               | boolean         | Mixed breed flag                                      |
| `colors.primary`             | string or null  | Primary color                                         |
| `photos`                     | array           | Photos in 4 sizes (small, medium, large, full)        |
| `tags`                       | string[]        | Descriptive tags (Friendly, Playful, etc.)            |
| `attributes.spayed_neutered` | boolean         | Spayed/neutered                                       |
| `attributes.house_trained`   | boolean         | House trained                                         |
| `attributes.special_needs`   | boolean         | Has special needs                                     |
| `attributes.shots_current`   | boolean         | Vaccinations current                                  |
| `environment.children`       | boolean or null | Good with children                                    |
| `environment.dogs`           | boolean or null | Good with dogs                                        |
| `environment.cats`           | boolean or null | Good with cats                                        |
| `contact.address`            | object          | City, state, postcode, country                        |
| `published_at`               | string          | ISO 8601 publish date                                 |
| `distance`                   | number or null  | Miles from search location (only with location param) |
| `url`                        | string          | Petfinder listing page URL                            |

---

## Search parameters for `GET /animals`

| Parameter         | Type    | Values                                                                  | Description                  |
| ----------------- | ------- | ----------------------------------------------------------------------- | ---------------------------- |
| `type`            | string  | dog, cat, rabbit, small-furry, horse, bird, scales-fins-other, barnyard | Animal type                  |
| `breed`           | string  | Breed name (use `/types/{type}/breeds` to get list)                     | Filter by breed              |
| `size`            | string  | small, medium, large, xlarge                                            | Animal size                  |
| `gender`          | string  | male, female, unknown                                                   | Gender                       |
| `age`             | string  | baby, young, adult, senior                                              | Age group                    |
| `color`           | string  | Color name                                                              | Primary color                |
| `coat`            | string  | short, medium, long, wire, hairless, curly                              | Coat type                    |
| `status`          | string  | adoptable, adopted, found                                               | Adoption status              |
| `name`            | string  | any text                                                                | Search by name               |
| `organization_id` | string  | Org ID (e.g., "NJ333")                                                  | Filter by rescue org         |
| `location`        | string  | City/state, lat/long, or postal code                                    | Location for distance search |
| `distance`        | integer | Miles from location (default 100)                                       | Radius around location       |
| `sort`            | string  | distance, -distance, recent, -recent                                    | Sort order                   |
| `page`            | integer | Page number                                                             | Pagination                   |
| `limit`           | integer | 1-100 (default 20)                                                      | Results per page             |

Multiple values can be comma-separated for some parameters (e.g., `age=baby,young`).

---

## How to use in a my-advice project

### Making authenticated requests

```javascript
const BASE_URL = "https://api.petfinder.com/v2";

async function fetchPets(params) {
  const token = await ensureToken();
  const response = await fetch(`${BASE_URL}/animals?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data.animals;
}
```

### Search with filters from a form

```javascript
async function searchPets(type, age, size, gender) {
  const params = new URLSearchParams({ limit: "20" });

  if (type) params.set("type", type);
  if (age) params.set("age", age);
  if (size) params.set("size", size);
  if (gender) params.set("gender", gender);

  return fetchPets(params);
}
```

### Getting breed list for a type

```javascript
async function getBreeds(type) {
  const token = await ensureToken();
  const response = await fetch(`${BASE_URL}/types/${type}/breeds`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data.breeds; // [{ name: "Labrador Retriever" }, ...]
}
```

### Populating a breed select dynamically

```javascript
async function populateBreeds(typeSelect, breedSelect) {
  const type = typeSelect.value;
  breedSelect.textContent = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Any breed";
  breedSelect.append(defaultOption);

  if (!type) return;

  const breeds = await getBreeds(type);
  for (const breed of breeds) {
    const option = document.createElement("option");
    option.value = breed.name;
    option.textContent = breed.name;
    breedSelect.append(option);
  }
}
```

### Rendering pet cards

```javascript
function renderPets(animals) {
  const container = document.getElementById("results");
  container.textContent = "";

  for (const animal of animals) {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    if (animal.photos.length > 0) {
      img.src = animal.photos[0].medium;
      img.alt = `Photo of ${animal.name}`;
    } else {
      img.src = "placeholder-pet.jpg";
      img.alt = "No photo available";
    }

    const name = document.createElement("h3");
    name.textContent = animal.name;

    const breed = document.createElement("p");
    const breedText = animal.breeds.secondary
      ? `${animal.breeds.primary} / ${animal.breeds.secondary} mix`
      : animal.breeds.primary;
    breed.textContent = breedText;

    const details = document.createElement("p");
    details.textContent = `${animal.age} | ${animal.gender} | ${animal.size}`;

    const traits = document.createElement("p");
    const traitList = [];
    if (animal.attributes.house_trained) traitList.push("House trained");
    if (animal.attributes.shots_current) traitList.push("Vaccinated");
    if (animal.environment.children) traitList.push("Good with kids");
    if (animal.environment.dogs) traitList.push("Good with dogs");
    if (animal.environment.cats) traitList.push("Good with cats");
    traits.textContent = traitList.join(" | ");

    const link = document.createElement("a");
    link.href = animal.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View on Petfinder";

    card.append(img, name, breed, details, traits, link);
    container.append(card);
  }
}
```

### Example filter form

```html
<form id="pet-form">
  <select id="type-select">
    <option value="">Any animal</option>
    <option value="dog">Dog</option>
    <option value="cat">Cat</option>
    <option value="rabbit">Rabbit</option>
    <option value="small-furry">Small & Furry</option>
    <option value="bird">Bird</option>
  </select>

  <select id="breed-select">
    <option value="">Any breed</option>
    <!-- Populated dynamically when type changes -->
  </select>

  <select id="age-select">
    <option value="">Any age</option>
    <option value="baby">Baby</option>
    <option value="young">Young</option>
    <option value="adult">Adult</option>
    <option value="senior">Senior</option>
  </select>

  <select id="size-select">
    <option value="">Any size</option>
    <option value="small">Small</option>
    <option value="medium">Medium</option>
    <option value="large">Large</option>
    <option value="xlarge">Extra Large</option>
  </select>

  <select id="gender-select">
    <option value="">Any gender</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
  </select>

  <button type="submit">Find Pets</button>
</form>
```

---

## Security note for student projects

The `client_secret` should not be exposed in client-side JavaScript in a real production app. For student projects deployed on Netlify, two options:

1. **Accept the risk for learning purposes** — the free API key has no billing attached, so exposure has minimal consequences
2. **Use Netlify Functions as a proxy** — advanced approach where the secret stays server-side:

```javascript
// netlify/functions/pets.js (serverless function)
export default async function handler(request) {
  const token = await getToken(process.env.PETFINDER_ID, process.env.PETFINDER_SECRET);
  const url = new URL(request.url);
  const params = url.searchParams;

  const response = await fetch(`https://api.petfinder.com/v2/animals?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
```

For the scope of this course, option 1 is fine.

---

## Gotchas and tips

- **OAuth is the main hurdle:** The token flow adds complexity that other APIs in this course don't require. Make sure the student is comfortable with async/await before tackling this.
- **Token expires hourly:** The `ensureToken()` pattern above handles this automatically.
- **Many animals have no photos:** Always provide a fallback image. Check `animal.photos.length > 0` before accessing.
- **Null fields everywhere:** `breeds.secondary`, `coat`, `colors.secondary`, `environment.children` can all be null. Guard every access.
- **Description can be long and messy:** Some descriptions contain HTML or formatting. Truncate for cards.
- **Distance requires location:** The `distance` field only appears in results when you include a `location` parameter in the request.
- **Breed select depends on type:** Breeds are type-specific. Update the breed dropdown whenever the type select changes.
- **Real data, real animals:** Results change daily as animals are adopted or listed. Great for demonstrating live APIs but means students can't hardcode expected results in tests.
- **No "mood" or "personality" filter:** The API has `tags` but they aren't filterable via query parameters. Students would need to fetch results and filter client-side by tag content.
