# Fetch API quick reference

## Basic GET request

```js
async function getData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
```

## Check response before parsing

`fetch` does **not** throw on 404 or 500 — only on network failure. Always check `response.ok`.

```js
const response = await fetch(url);
if (!response.ok) {
  throw new Error(`HTTP error: ${response.status}`);
}
const data = await response.json();
```

## Error handling with try/catch

```js
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  const data = await response.json();
} catch (error) {
  /* network failure OR the error you threw above */
  console.error("Fetch failed:", error.message);
}
```

## POST request with JSON body

```js
const response = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt: "Hello" }),
});
const data = await response.json();
```

## Setting headers

```js
const response = await fetch(url, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
});
```

## Common gotcha

- `fetch("https://example.com/missing")` resolves normally with `status: 404`
- `fetch` only rejects on **network errors** (DNS failure, no internet, CORS block)
- You must check `response.ok` yourself — fetch considers any server reply a success

## Response properties

| Property     | Type    | What it tells you                        |
| ------------ | ------- | ---------------------------------------- |
| `ok`         | boolean | `true` when status is 200-299            |
| `status`     | number  | HTTP status code (200, 404, 500, etc.)   |
| `statusText` | string  | Status message ("OK", "Not Found", etc.) |
| `headers`    | Headers | Response headers (use `.get("name")`)    |
| `json()`     | method  | Parse body as JSON (returns a promise)   |
| `text()`     | method  | Parse body as plain text                 |
