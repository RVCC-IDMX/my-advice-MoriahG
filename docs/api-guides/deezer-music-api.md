# Deezer API guide

**Best for:** Music recommendation projects (nedetample)
**Base URL:** `https://api.deezer.com/`
**Auth:** None required for search and catalog endpoints
**CORS:** Yes
**Rate limit:** ~50 requests per 5 seconds (undocumented exact limit)

---

## Key endpoints

| Endpoint                  | Description                                    |
| ------------------------- | ---------------------------------------------- |
| `GET /search`             | Search tracks (default), returns track objects |
| `GET /search/artist`      | Search artists only                            |
| `GET /search/album`       | Search albums only                             |
| `GET /genre`              | List all genres with IDs                       |
| `GET /genre/{id}/artists` | Top artists in a genre                         |
| `GET /artist/{id}`        | Artist details                                 |
| `GET /artist/{id}/top`    | Artist's top tracks                            |
| `GET /album/{id}`         | Album details with tracklist                   |
| `GET /track/{id}`         | Single track details                           |

---

## Response structure

### Search response wrapper

```json
{
  "data": [],
  "total": 1234,
  "next": "https://api.deezer.com/search?q=radiohead&index=25&limit=25"
}
```

- `data` — array of track objects
- `total` — total results available
- `next` — URL for next page (absent on last page)

### Track object (from search results)

```json
{
  "id": 2309560,
  "readable": true,
  "title": "Creep",
  "title_short": "Creep",
  "title_version": "",
  "link": "https://www.deezer.com/track/2309560",
  "duration": 238,
  "rank": 856432,
  "explicit_lyrics": false,
  "explicit_content_lyrics": 0,
  "explicit_content_cover": 0,
  "preview": "https://cdns-preview-e.dzcdn.net/stream/c-XXXXX.mp3",
  "md5_image": "a1b2c3d4...",
  "type": "track",
  "artist": {
    "id": 399,
    "name": "Radiohead",
    "link": "https://www.deezer.com/artist/399",
    "picture": "https://api.deezer.com/artist/399/image",
    "picture_small": "https://...-56x56...",
    "picture_medium": "https://...-250x250...",
    "picture_big": "https://...-500x500...",
    "picture_xl": "https://...-1000x1000...",
    "tracklist": "https://api.deezer.com/artist/399/top?limit=50",
    "type": "artist"
  },
  "album": {
    "id": 221261,
    "title": "Pablo Honey",
    "cover": "https://api.deezer.com/album/221261/image",
    "cover_small": "https://...-56x56...",
    "cover_medium": "https://...-250x250...",
    "cover_big": "https://...-500x500...",
    "cover_xl": "https://...-1000x1000...",
    "md5_image": "a1b2c3d4...",
    "tracklist": "https://api.deezer.com/album/221261/tracks",
    "type": "album"
  }
}
```

### Field reference

| Field                   | Type    | Description                                          |
| ----------------------- | ------- | ---------------------------------------------------- |
| `id`                    | integer | Track ID                                             |
| `title`                 | string  | Full track title                                     |
| `title_short`           | string  | Short title (without version)                        |
| `title_version`         | string  | Version info (e.g., "Live", "Remix")                 |
| `duration`              | integer | Duration in **seconds**                              |
| `rank`                  | integer | Popularity ranking                                   |
| `explicit_lyrics`       | boolean | Explicit content flag                                |
| `preview`               | string  | **30-second MP3 preview URL** (128kbps, direct link) |
| `link`                  | string  | Deezer web page URL                                  |
| `artist.name`           | string  | Artist name                                          |
| `artist.picture_medium` | string  | 250x250 artist photo URL                             |
| `album.title`           | string  | Album name                                           |
| `album.cover_medium`    | string  | 250x250 album cover URL                              |
| `album.cover_big`       | string  | 500x500 album cover URL                              |

---

## Search parameters

| Parameter | Type    | Default   | Description                           |
| --------- | ------- | --------- | ------------------------------------- |
| `q`       | string  | required  | Search query                          |
| `strict`  | string  | off       | Set to `on` to disable fuzzy matching |
| `order`   | string  | `RANKING` | Sort order                            |
| `index`   | integer | 0         | Offset for pagination                 |
| `limit`   | integer | 25        | Results per page (max 100)            |
| `output`  | string  | `json`    | Response format (`json` or `xml`)     |

### Order values

`RANKING` (default), `TRACK_ASC`, `TRACK_DESC`, `ARTIST_ASC`, `ARTIST_DESC`, `ALBUM_ASC`, `ALBUM_DESC`, `RATING_ASC`, `RATING_DESC`, `DURATION_ASC`, `DURATION_DESC`

### Advanced search modifiers (inside the `q` parameter)

These prefixes go directly in the query string:

| Modifier   | Example                 | Description                 |
| ---------- | ----------------------- | --------------------------- |
| `artist:`  | `artist:"daft punk"`    | Filter by artist name       |
| `album:`   | `album:"discovery"`     | Filter by album name        |
| `track:`   | `track:"creep"`         | Filter by track name        |
| `label:`   | `label:"xl recordings"` | Filter by record label      |
| `dur_min:` | `dur_min:300`           | Minimum duration in seconds |
| `dur_max:` | `dur_max:600`           | Maximum duration in seconds |
| `bpm_min:` | `bpm_min:100`           | Minimum BPM                 |
| `bpm_max:` | `bpm_max:140`           | Maximum BPM                 |

Combine modifiers: `q=artist:"radiohead" dur_min:200 dur_max:400`

---

## Genre list

Fetch with `GET /genre`:

| ID  | Name      | ID  | Name        |
| --- | --------- | --- | ----------- |
| 132 | Pop       | 116 | Rap/Hip Hop |
| 152 | Rock      | 113 | Dance       |
| 165 | R&B       | 85  | Alternative |
| 106 | Electro   | 466 | Folk        |
| 144 | Reggae    | 129 | Jazz        |
| 98  | Classical | 173 | Films/Games |
| 464 | Metal     | 169 | Soul & Funk |
| 153 | Blues     | 65  | Country     |
| 95  | Kids      | 197 | Latino      |

Each genre object: `{ id, name, picture, picture_small, picture_medium, picture_big, picture_xl, type }`.

---

## The 30-second preview (bonus feature)

The `preview` field is a direct URL to a 30-second MP3 clip. Students can play it in an `<audio>` element:

```javascript
function createAudioPlayer(previewUrl) {
  const audio = document.createElement("audio");
  audio.controls = true;
  audio.src = previewUrl;
  return audio;
}
```

- Format: MP3, 128kbps
- No auth required — the URL is publicly accessible
- Some tracks have an empty string for `preview` (rights restrictions) — check before rendering

---

## How to use in a my-advice project

### Basic search

```javascript
const DEEZER_URL = "https://api.deezer.com";

async function searchTracks(query) {
  const response = await fetch(`${DEEZER_URL}/search?q=${encodeURIComponent(query)}&limit=10`);
  const data = await response.json();
  return data.data;
}
```

### Search with filters from form

```javascript
async function searchMusic(artist, genre, maxDuration) {
  const parts = [];
  if (artist) parts.push(`artist:"${artist}"`);
  if (genre) parts.push(genre);
  if (maxDuration) parts.push(`dur_max:${maxDuration}`);

  const query = parts.join(" ") || "top hits";
  const response = await fetch(`${DEEZER_URL}/search?q=${encodeURIComponent(query)}&limit=10`);
  const data = await response.json();
  return data.data;
}
```

### Rendering track cards with audio preview

```javascript
function renderTracks(tracks) {
  const container = document.getElementById("recommendations");
  container.textContent = "";

  for (const track of tracks) {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = track.album.cover_medium;
    img.alt = `${track.album.title} cover`;

    const title = document.createElement("h3");
    title.textContent = track.title;

    const artist = document.createElement("p");
    artist.textContent = track.artist.name;

    const duration = document.createElement("p");
    const mins = Math.floor(track.duration / 60);
    const secs = String(track.duration % 60).padStart(2, "0");
    duration.textContent = `${mins}:${secs}`;

    card.append(img, title, artist, duration);

    if (track.preview) {
      const audio = document.createElement("audio");
      audio.controls = true;
      audio.src = track.preview;
      card.append(audio);
    }

    container.append(card);
  }
}
```

### Mapping to nedetample's existing form

Ned's form has selects for vibe, time available, genre, and activity:

| Form field     | Deezer approach     | Notes                                                          |
| -------------- | ------------------- | -------------------------------------------------------------- |
| Vibe           | Map to search terms | "chill" -> `q=chill`, "hyped" -> `q=hype energy`               |
| Time available | `dur_max:` modifier | Convert minutes to seconds (e.g., 180, 300)                    |
| Genre          | Genre name in query | Use genre name directly: `q=jazz` or `q=rock`                  |
| Activity       | Map to search terms | "workout" -> `q=workout energy`, "studying" -> `q=study focus` |

```javascript
const vibeToQuery = {
  chill: "chill relaxing",
  hyped: "hype energy",
  focused: "focus concentration",
  upbeat: "upbeat happy",
};

const activityToQuery = {
  driving: "road trip driving",
  studying: "study lo-fi",
  workout: "workout energy",
  sleeping: "sleep ambient",
  party: "party dance",
  relaxing: "relaxing calm",
};
```

---

## Gotchas and tips

- **Duration is in seconds**, not minutes. Convert for display: `Math.floor(duration / 60)` for minutes.
- **No mood/vibe filter:** Deezer search is text-based. Students need to map mood select options to search terms.
- **Empty previews:** Some tracks have `preview: ""`. Always check before creating an audio element.
- **Images are full URLs:** Unlike TMDB, Deezer returns complete image URLs in multiple sizes.
- **Pagination uses `index`**, not `page`. To get page 2 with limit 10: `index=10&limit=10`.
- **CORS works:** No proxy needed for browser fetch calls.
- **`next` field:** The response includes the URL for the next page — can use this directly instead of computing index.
