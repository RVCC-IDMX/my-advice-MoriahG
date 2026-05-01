# TMDB (The Movie Database) API guide

**Best for:** Movie recommendation projects (DFROSTEXD, kit-on-github)
**Base URL:** `https://api.themoviedb.org/3/`
**Auth:** Free API key required (signup at themoviedb.org, then account settings > API)
**CORS:** Yes
**Rate limit:** ~40 requests/second

---

## Getting your API key

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/signup)
2. Go to **Settings > API** in your account
3. Request an API key (select "Developer" use case)
4. Your key goes in every request as `?api_key=YOUR_KEY`

**Alternative:** Use a Bearer token in the `Authorization` header instead:

```javascript
const options = {
  headers: {
    Authorization: "Bearer YOUR_ACCESS_TOKEN",
  },
};
const response = await fetch("https://api.themoviedb.org/3/movie/popular", options);
```

---

## Key endpoints

| Endpoint                 | Description                                            |
| ------------------------ | ------------------------------------------------------ |
| `GET /discover/movie`    | Browse movies with filters (genre, year, rating, etc.) |
| `GET /search/movie`      | Search movies by title                                 |
| `GET /movie/popular`     | Currently popular movies                               |
| `GET /movie/top_rated`   | Highest-rated movies                                   |
| `GET /movie/now_playing` | Currently in theaters                                  |
| `GET /movie/upcoming`    | Upcoming releases                                      |
| `GET /genre/movie/list`  | All genres with IDs                                    |
| `GET /movie/{id}`        | Single movie details                                   |

---

## Response structure

### Paginated list response

```json
{
  "page": 1,
  "results": [],
  "total_pages": 500,
  "total_results": 10000
}
```

### Movie object (inside `results` array)

```json
{
  "adult": false,
  "backdrop_path": "/abc123.jpg",
  "genre_ids": [28, 12, 878],
  "id": 550,
  "original_language": "en",
  "original_title": "Fight Club",
  "overview": "A ticking-Loss-of-clock worker and a slippery soap maker...",
  "popularity": 73.5,
  "poster_path": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  "release_date": "1999-10-15",
  "title": "Fight Club",
  "video": false,
  "vote_average": 8.4,
  "vote_count": 26234
}
```

### Field reference

| Field               | Type           | Description                                         |
| ------------------- | -------------- | --------------------------------------------------- |
| `id`                | integer        | TMDB movie ID                                       |
| `title`             | string         | Localized title                                     |
| `original_title`    | string         | Original language title                             |
| `overview`          | string         | Plot summary                                        |
| `release_date`      | string         | Release date (`YYYY-MM-DD`)                         |
| `vote_average`      | number         | Average rating (0-10 scale)                         |
| `vote_count`        | integer        | Number of votes                                     |
| `popularity`        | number         | Popularity score                                    |
| `genre_ids`         | integer[]      | Array of genre IDs (use genre list to map to names) |
| `poster_path`       | string or null | Poster image path fragment                          |
| `backdrop_path`     | string or null | Backdrop image path fragment                        |
| `original_language` | string         | ISO 639-1 language code                             |
| `adult`             | boolean        | Adult content flag                                  |
| `video`             | boolean        | Has associated video                                |

---

## Building image URLs

`poster_path` and `backdrop_path` are path fragments like `/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg`. Build the full URL with:

```
https://image.tmdb.org/t/p/{size}{path}
```

### Poster sizes

`w92`, `w154`, `w185`, `w342`, `w500`, `w780`, `original`

### Backdrop sizes

`w300`, `w780`, `w1280`, `original`

### Example

```javascript
const posterUrl = `https://image.tmdb.org/t/p/w342${movie.poster_path}`;
```

**Always check for null** before building a URL:

```javascript
const posterUrl = movie.poster_path
  ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
  : "placeholder.jpg";
```

---

## Genre ID list

Use `GET /genre/movie/list?api_key=KEY` to fetch this, or hardcode:

| ID   | Genre           | ID    | Genre       |
| ---- | --------------- | ----- | ----------- |
| 28   | Action          | 12    | Adventure   |
| 16   | Animation       | 35    | Comedy      |
| 80   | Crime           | 99    | Documentary |
| 18   | Drama           | 10751 | Family      |
| 14   | Fantasy         | 36    | History     |
| 27   | Horror          | 10402 | Music       |
| 9648 | Mystery         | 10749 | Romance     |
| 878  | Science Fiction | 10770 | TV Movie    |
| 53   | Thriller        | 10752 | War         |
| 37   | Western         |       |             |

---

## Discover endpoint query parameters

The `/discover/movie` endpoint is the most powerful for filter forms.

### Most useful for students

| Parameter                  | Type        | Example           | Description                       |
| -------------------------- | ----------- | ----------------- | --------------------------------- |
| `api_key`                  | string      | required          | Your API key                      |
| `with_genres`              | string      | `28\|35`          | Genre IDs. Comma = AND, pipe = OR |
| `vote_average.gte`         | number      | `7`               | Minimum rating (0-10)             |
| `vote_average.lte`         | number      | `9`               | Maximum rating                    |
| `primary_release_year`     | integer     | `2024`            | Exact release year                |
| `primary_release_date.gte` | date string | `2020-01-01`      | Released after this date          |
| `primary_release_date.lte` | date string | `2025-12-31`      | Released before this date         |
| `with_runtime.gte`         | integer     | `60`              | Minimum runtime in minutes        |
| `with_runtime.lte`         | integer     | `120`             | Maximum runtime in minutes        |
| `sort_by`                  | string      | `popularity.desc` | Sort order                        |
| `page`                     | integer     | `1`               | Page number (1-500)               |
| `language`                 | string      | `en-US`           | Response language                 |

### Sort options

`popularity.desc`, `popularity.asc`, `revenue.desc`, `revenue.asc`, `primary_release_date.desc`, `primary_release_date.asc`, `vote_average.desc`, `vote_average.asc`, `vote_count.desc`, `vote_count.asc`, `original_title.asc`, `original_title.desc`

### All parameters (complete list)

| Parameter                    | Description                           |
| ---------------------------- | ------------------------------------- |
| `certification`              | Exact certification (e.g., "R")       |
| `certification.gte` / `.lte` | Min/max certification                 |
| `certification_country`      | Country code for certification        |
| `include_adult`              | Include adult content (default false) |
| `include_video`              | Include videos (default false)        |
| `with_cast`                  | Person IDs in cast                    |
| `with_crew`                  | Person IDs in crew                    |
| `with_companies`             | Production company IDs                |
| `with_keywords`              | Keyword IDs                           |
| `with_origin_country`        | Origin country code                   |
| `with_original_language`     | Original language code                |
| `with_watch_providers`       | Watch provider IDs                    |
| `watch_region`               | Region for watch providers            |
| `without_genres`             | Exclude genre IDs                     |
| `without_keywords`           | Exclude keyword IDs                   |

**Comma vs pipe:** In multi-value parameters, comma-separated = AND logic, pipe-separated = OR logic.

### Search endpoint parameters

| Parameter              | Type    | Description                    |
| ---------------------- | ------- | ------------------------------ |
| `api_key`              | string  | Required                       |
| `query`                | string  | Search text (required)         |
| `page`                 | integer | Page number                    |
| `year`                 | integer | Filter by year                 |
| `primary_release_year` | integer | Filter by primary release year |
| `language`             | string  | Response language              |
| `region`               | string  | ISO 3166-1 region code         |
| `include_adult`        | boolean | Include adult content          |

---

## How to use in a my-advice project

### Basic fetch with API key

```javascript
const API_KEY = "your_api_key_here";
const BASE_URL = "https://api.themoviedb.org/3";

async function getPopularMovies() {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
}
```

### Discover with filters from a form

```javascript
async function discoverMovies(genre, minRating, year) {
  const params = new URLSearchParams({
    api_key: API_KEY,
    sort_by: "popularity.desc",
    "vote_count.gte": "50",
  });

  if (genre) params.set("with_genres", genre);
  if (minRating) params.set("vote_average.gte", minRating);
  if (year) params.set("primary_release_year", year);

  const response = await fetch(`${BASE_URL}/discover/movie?${params}`);
  const data = await response.json();
  return data.results;
}
```

### Mapping genre IDs to names

```javascript
async function getGenreMap() {
  const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  const data = await response.json();
  const map = {};
  for (const genre of data.genres) {
    map[genre.id] = genre.name;
  }
  return map;
}

// Usage: genreMap[28] → "Action"
```

### Rendering movie cards

```javascript
function renderMovies(movies, genreMap) {
  const container = document.getElementById("results");
  container.textContent = "";

  for (const movie of movies) {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = movie.poster_path
      ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
      : "placeholder.jpg";
    img.alt = `${movie.title} poster`;

    const title = document.createElement("h3");
    title.textContent = movie.title;

    const rating = document.createElement("p");
    rating.textContent = `Rating: ${movie.vote_average}/10`;

    const genres = document.createElement("p");
    genres.textContent = movie.genre_ids.map((id) => genreMap[id] || "Unknown").join(", ");

    const overview = document.createElement("p");
    overview.textContent = movie.overview;

    card.append(img, title, rating, genres, overview);
    container.append(card);
  }
}
```

### Wiring to a filter form

```html
<form id="movie-form">
  <select id="genre-select">
    <option value="">Any genre</option>
    <!-- Populated dynamically from /genre/movie/list -->
  </select>
  <select id="rating-select">
    <option value="">Any rating</option>
    <option value="7">7+ stars</option>
    <option value="8">8+ stars</option>
  </select>
  <button type="submit">Find movies</button>
</form>
```

```javascript
// Populate genre select dynamically
async function populateGenres() {
  const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  const data = await response.json();
  const select = document.getElementById("genre-select");

  for (const genre of data.genres) {
    const option = document.createElement("option");
    option.value = genre.id;
    option.textContent = genre.name;
    select.append(option);
  }
}

// Handle form submit
document.getElementById("movie-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const genre = document.getElementById("genre-select").value;
  const minRating = document.getElementById("rating-select").value;
  const movies = await discoverMovies(genre, minRating);
  renderMovies(movies, genreMap);
});
```

---

## Gotchas and tips

- **API key in URL:** The key is visible in network requests. This is fine for student projects but not for production.
- **Null poster paths:** Some movies have no poster. Always provide a fallback image.
- **Genre IDs vs names:** The movie object returns `genre_ids` (numbers), not genre names. Fetch the genre list once and build a lookup map.
- **Vote count matters:** Sort by `vote_average` alone returns obscure movies with one 10/10 vote. Add `vote_count.gte=50` to get meaningful ratings.
- **Pagination:** Results are paginated at 20 per page. Use `page` parameter for more.
- **Rate limit:** 40 req/sec is very generous. Students won't hit it during normal use.
