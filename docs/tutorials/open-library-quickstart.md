# Open Library — quickstart

The pattern walkthroughs in this folder use the **Open Library Search API** as the worked example. This page is a one-page orientation — what the endpoint looks like, what parameters it takes, and what the response shape is.

You will translate the patterns to your own API. This is just enough to read the walkthroughs.

## Why Open Library is the example

Its shape is similar to most Week 4 student APIs:

- One endpoint that accepts rich query parameters (like TMDB's `/discover/movie`, Jikan's `/anime`, wger's `/exercise`).
- JSON response with a list of results.
- No auth required — no API key, no signup.
- Free tier with reasonable limits for development.

If your Week 4 API has the same shape — query params in, list of results out — the patterns translate directly. If your API has a different shape (e.g., Deezer's single-string `/search?q=...`), the patterns still apply but the schema you ask Groq for will be simpler.

## The endpoint

```text
https://openlibrary.org/search.json
```

A `GET` request, no auth.

## Common parameters

- `q` — free-text query (the catch-all)
- `title` — title-only search
- `author` — author-only search
- `subject` — e.g., `"Science Fiction"`, `"Mystery"`
- `first_publish_year` — single year
- `language` — e.g., `"eng"`
- `limit` — number of results (default 100, max 1000)
- `page` — pagination

## Lucene-style query syntax

For year ranges and combined filters, embed Lucene syntax inside `q`:

- Year range: `q=colonization first_publish_year:[1990 TO 1999]`
- Subject filter: `q=mystery subject:Detective`
- Combined: `q=colonization subject:"Science Fiction" first_publish_year:[1990 TO 1999]`

This is the form the Pattern A walkthrough uses — Groq returns the parts and the function builds the `q` string.

## Response shape (key fields)

```js
{
  "numFound": 1234,
  "start": 0,
  "docs": [
    {
      "key": "/works/OL103123W",   // stable ID
      "title": "The Sparrow",
      "author_name": ["Mary Doria Russell"],
      "first_publish_year": 1996,
      "subject": ["Science Fiction", "Jesuits", "Aliens"],
      "cover_i": 8231856           // numeric cover ID, may be null
    }
    // ...more docs
  ]
}
```

## Cover images

Build the URL from `cover_i`:

```text
https://covers.openlibrary.org/b/id/{cover_i}-M.jpg
```

The size suffix is `-S`, `-M`, or `-L`. If `cover_i` is null, there is no cover.

## Limits

- Be polite — do not fire dozens of parallel requests in a tight loop.
- Use `limit=20` or so for typical UIs (the default 100 is more than you usually want).
- The cache wrapper from Week 4 helps keep request volume down.

## Try it

Open this URL in a browser (no auth needed):

```text
https://openlibrary.org/search.json?q=colonization+first_publish_year%3A%5B1990+TO+1999%5D&subject=Science+Fiction&limit=5
```

You should see `numFound`, `start`, and a `docs` array.

## Full docs

<https://openlibrary.org/dev/docs/api/search>
