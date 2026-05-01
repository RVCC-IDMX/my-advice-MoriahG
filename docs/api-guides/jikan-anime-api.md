# Jikan (MyAnimeList) API guide

**Best for:** Anime recommendation projects (oliviad118)
**Base URL:** `https://api.jikan.moe/v4/`
**Auth:** None required
**CORS:** Yes
**Rate limit:** 3 requests/second, 60 requests/minute

---

## Endpoints

| Endpoint                       | Description                  |
| ------------------------------ | ---------------------------- |
| `GET /anime`                   | Search and filter anime      |
| `GET /anime/{id}`              | Single anime details         |
| `GET /top/anime`               | Top-rated anime              |
| `GET /seasons/now`             | Currently airing anime       |
| `GET /seasons/{year}/{season}` | Anime from a specific season |
| `GET /genres/anime`            | All genres with IDs          |
| `GET /random/anime`            | Random anime                 |

---

## Response structure

### Paginated list response

```json
{
  "data": [],
  "pagination": {
    "last_visible_page": 5,
    "has_next_page": true,
    "current_page": 1,
    "items": {
      "count": 25,
      "total": 100,
      "per_page": 25
    }
  }
}
```

### Anime object (inside `data` array)

```json
{
  "mal_id": 20,
  "url": "https://myanimelist.net/anime/20/Naruto",
  "images": {
    "jpg": {
      "image_url": "https://cdn.myanimelist.net/images/anime/13/17405.jpg",
      "small_image_url": "https://cdn.myanimelist.net/images/anime/13/17405t.jpg",
      "large_image_url": "https://cdn.myanimelist.net/images/anime/13/17405l.jpg"
    },
    "webp": {
      "image_url": "https://cdn.myanimelist.net/images/anime/13/17405.webp",
      "small_image_url": "https://cdn.myanimelist.net/images/anime/13/17405t.webp",
      "large_image_url": "https://cdn.myanimelist.net/images/anime/13/17405l.webp"
    }
  },
  "trailer": {
    "youtube_id": "abc123",
    "url": "https://www.youtube.com/watch?v=abc123",
    "embed_url": "https://www.youtube.com/embed/abc123"
  },
  "title": "Naruto",
  "title_english": "Naruto",
  "title_japanese": "\u30ca\u30eb\u30c8",
  "type": "TV",
  "source": "Manga",
  "episodes": 220,
  "status": "Finished Airing",
  "airing": false,
  "aired": {
    "from": "2002-10-03T00:00:00+00:00",
    "to": "2007-02-08T00:00:00+00:00",
    "string": "Oct 3, 2002 to Feb 8, 2007"
  },
  "duration": "23 min per ep",
  "rating": "PG-13 - Teens 13 or older",
  "score": 8.0,
  "scored_by": 1234567,
  "rank": 763,
  "popularity": 8,
  "members": 2345678,
  "favorites": 78901,
  "synopsis": "Moments prior to Naruto Uzumaki's birth...",
  "season": "fall",
  "year": 2002,
  "genres": [
    { "mal_id": 1, "name": "Action" },
    { "mal_id": 2, "name": "Adventure" }
  ],
  "themes": [{ "mal_id": 68, "name": "Martial Arts" }],
  "demographics": [{ "mal_id": 27, "name": "Shounen" }],
  "studios": [{ "mal_id": 1, "name": "Pierrot" }],
  "producers": [{ "mal_id": 16, "name": "TV Tokyo" }]
}
```

### Field reference

| Field                        | Type            | Description                                      |
| ---------------------------- | --------------- | ------------------------------------------------ |
| `mal_id`                     | integer         | MyAnimeList ID                                   |
| `title`                      | string          | Default title                                    |
| `title_english`              | string or null  | English title                                    |
| `title_japanese`             | string or null  | Japanese title                                   |
| `type`                       | string or null  | TV, OVA, Movie, Special, ONA, Music              |
| `source`                     | string or null  | Manga, Light novel, Original, etc.               |
| `episodes`                   | integer or null | Episode count (null if unknown)                  |
| `status`                     | string          | Finished Airing, Currently Airing, Not yet aired |
| `airing`                     | boolean         | Currently airing                                 |
| `aired.string`               | string          | Human-readable air date range                    |
| `duration`                   | string or null  | Episode duration (e.g., "23 min per ep")         |
| `rating`                     | string or null  | Age rating (G, PG, PG-13, R-17+, R+, Rx)         |
| `score`                      | number or null  | Average score (0-10)                             |
| `scored_by`                  | integer or null | Number of scorers                                |
| `rank`                       | integer or null | Overall rank                                     |
| `popularity`                 | integer or null | Popularity rank                                  |
| `members`                    | integer         | MAL members count                                |
| `favorites`                  | integer         | Favorites count                                  |
| `synopsis`                   | string or null  | Plot summary                                     |
| `season`                     | string or null  | spring, summer, fall, winter                     |
| `year`                       | integer or null | Year of first airing                             |
| `genres`                     | array           | `[{ mal_id, name }]`                             |
| `themes`                     | array           | `[{ mal_id, name }]`                             |
| `demographics`               | array           | `[{ mal_id, name }]`                             |
| `studios`                    | array           | `[{ mal_id, name }]`                             |
| `images.jpg.image_url`       | string          | Standard JPG image                               |
| `images.jpg.large_image_url` | string          | Large JPG image                                  |
| `images.webp.image_url`      | string          | Standard WebP image                              |
| `trailer.youtube_id`         | string or null  | YouTube trailer ID                               |

---

## Search and filter parameters

All parameters for `GET /anime`:

| Parameter        | Type    | Values                                          | Description                  |
| ---------------- | ------- | ----------------------------------------------- | ---------------------------- |
| `q`              | string  | any text                                        | Search query                 |
| `page`           | integer | >= 1                                            | Page number                  |
| `limit`          | integer | 1-25                                            | Results per page             |
| `type`           | string  | `tv`, `movie`, `ova`, `special`, `ona`, `music` | Anime type                   |
| `score`          | number  | 0-10                                            | Exact score                  |
| `min_score`      | number  | 0-10                                            | Minimum score                |
| `max_score`      | number  | 0-10                                            | Maximum score                |
| `status`         | string  | `airing`, `complete`, `upcoming`                | Airing status                |
| `rating`         | string  | `g`, `pg`, `pg13`, `r17`, `r`, `rx`             | Age rating                   |
| `sfw`            | boolean | `true`                                          | Hide adult content           |
| `genres`         | string  | comma-separated IDs                             | Include genres (e.g., `1,2`) |
| `genres_exclude` | string  | comma-separated IDs                             | Exclude genres               |
| `order_by`       | string  | see below                                       | Sort field                   |
| `sort`           | string  | `asc`, `desc`                                   | Sort direction               |
| `letter`         | string  | single letter                                   | Filter by first letter       |
| `producers`      | string  | comma-separated IDs                             | Filter by producer           |
| `start_date`     | string  | `YYYY-MM-DD`                                    | Aired after this date        |
| `end_date`       | string  | `YYYY-MM-DD`                                    | Aired before this date       |

### Order-by options

`mal_id`, `title`, `start_date`, `end_date`, `episodes`, `score`, `scored_by`, `rank`, `popularity`, `members`, `favorites`

### Rating values explained

| Value  | Meaning                          |
| ------ | -------------------------------- |
| `g`    | G - All Ages                     |
| `pg`   | PG - Children                    |
| `pg13` | PG-13 - Teens 13 or older        |
| `r17`  | R - 17+ (violence and profanity) |
| `r`    | R+ - Mild Nudity                 |
| `rx`   | Rx - Hentai                      |

---

## Genre IDs (most useful for students)

| ID  | Genre        | ID  | Genre         |
| --- | ------------ | --- | ------------- |
| 1   | Action       | 2   | Adventure     |
| 4   | Comedy       | 8   | Drama         |
| 10  | Fantasy      | 14  | Horror        |
| 22  | Romance      | 24  | Sci-Fi        |
| 30  | Sports       | 36  | Slice of Life |
| 37  | Supernatural | 41  | Thriller      |
| 7   | Mystery      | 25  | Shoujo        |
| 27  | Shounen      | 42  | Seinen        |

### Theme IDs (most useful for students)

| ID  | Theme         | ID  | Theme            |
| --- | ------------- | --- | ---------------- |
| 63  | Isekai        | 69  | Mecha            |
| 73  | Music         | 84  | School           |
| 68  | Martial Arts  | 82  | Romantic Subtext |
| 80  | Reincarnation | 90  | Time Travel      |

Full genre and theme list available at `GET /genres/anime`.

---

## How to use in a my-advice project

### Basic search

```javascript
const JIKAN_URL = "https://api.jikan.moe/v4";

async function searchAnime(query) {
  const response = await fetch(
    `${JIKAN_URL}/anime?q=${encodeURIComponent(query)}&limit=10&sfw=true`,
  );
  const data = await response.json();
  return data.data;
}
```

### Filtered search from form selects

```javascript
async function filterAnime(genre, type, minScore, status) {
  const params = new URLSearchParams({
    limit: "10",
    sfw: "true",
    order_by: "score",
    sort: "desc",
  });

  if (genre) params.set("genres", genre);
  if (type) params.set("type", type);
  if (minScore) params.set("min_score", minScore);
  if (status) params.set("status", status);

  const response = await fetch(`${JIKAN_URL}/anime?${params}`);
  const data = await response.json();
  return data.data;
}
```

### Rendering anime cards

```javascript
function renderAnime(animeList) {
  const container = document.getElementById("recommendation-list");
  container.textContent = "";

  for (const anime of animeList) {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = anime.images.jpg.image_url;
    img.alt = `${anime.title} poster`;

    const title = document.createElement("h3");
    title.textContent = anime.title_english || anime.title;

    const info = document.createElement("p");
    info.textContent = `${anime.type} | ${anime.episodes || "?"} episodes | Score: ${anime.score || "N/A"}`;

    const genres = document.createElement("p");
    genres.textContent = anime.genres.map((g) => g.name).join(", ");

    const synopsis = document.createElement("p");
    synopsis.textContent = anime.synopsis
      ? anime.synopsis.slice(0, 200) + "..."
      : "No synopsis available.";

    card.append(img, title, info, genres, synopsis);
    container.append(card);
  }
}
```

### Mapping to oliviad118's existing form

Olivia's form has selects for genre, mood, sub/dub, rating, completion status, episode count, episode length, and min rating. Here's how those map to Jikan parameters:

| Form field        | Jikan parameter      | Notes                                                        |
| ----------------- | -------------------- | ------------------------------------------------------------ |
| Genre             | `genres`             | Map option values to genre IDs                               |
| Mood              | `genres` or `themes` | Map mood words to genre/theme IDs (e.g., "dark" = Horror 14) |
| Sub/dub           | No direct parameter  | Filter client-side or skip                                   |
| Rating level      | `rating`             | Map kids/teen/mature to `g`/`pg13`/`r17`                     |
| Completion status | `status`             | Map to `complete`/`airing`/`upcoming`                        |
| Episode count     | Filter client-side   | Compare `episodes` field after fetch                         |
| Episode length    | Filter client-side   | Parse `duration` field                                       |
| Min rating        | `min_score`          | Direct mapping                                               |

---

## Gotchas and tips

- **Rate limit is strict:** 3 req/sec, 60 req/min. Add a small delay between rapid calls. Students should avoid firing requests on every keystroke.
- **Null fields:** Many fields can be null (episodes, score, synopsis). Always check before displaying.
- **Synopsis length:** Synopses can be very long. Truncate for card displays.
- **`sfw=true`:** Always include this for student projects to filter out adult content.
- **No mood/vibe filter:** Jikan has no mood parameter. Students need to map their mood select options to genre/theme IDs manually.
- **Images are direct URLs:** Unlike TMDB, Jikan returns complete image URLs — no construction needed.
- **Pagination max:** 25 results per page maximum.
