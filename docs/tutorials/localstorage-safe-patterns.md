# Safe localStorage patterns

If you completed hap-fetch Station 3, this is the same pattern. This tutorial explains why you need it and how to use it in your own projects.

## Why localStorage needs a wrapper

localStorage only stores strings. When you save an object or array, you must convert it with `JSON.stringify`. When you read it back, you must convert it with `JSON.parse`. Both of those steps can fail:

- `JSON.parse` throws an error if the string is not valid JSON
- Another tab, an old version of your app, or a browser extension can write unexpected data to your key
- The browser can hit its storage quota (usually 5 MB) and refuse to write
- Private browsing mode in some browsers blocks localStorage entirely

Without a wrapper, any of these problems crashes your app. With a wrapper, your app handles every failure gracefully and keeps running.

## The loadCache function

This function reads from localStorage, parses the JSON, checks the shape, and returns the data. If anything goes wrong, it removes the bad data and returns `null`.

```js
function loadCache(key) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}
```

What each line does:

- `localStorage.getItem(key)` — returns the raw string, or `null` if the key does not exist
- `JSON.parse(saved)` — converts the string back to a JavaScript value. This is the line that can throw
- `if (!Array.isArray(parsed))` — shape validation. You expected an array, so reject anything else
- The `catch` block — if parsing failed, the data is corrupt. Remove it and return `null`

## The saveCache function

This function writes data to localStorage. If the write fails (quota exceeded, private browsing), it catches the error silently.

```js
function saveCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* quota exceeded or private browsing — safe to ignore */
  }
}
```

You do not need to alert the user when saving fails. The app still works — it just fetches fresh data next time.

## Shape validation

The `loadCache` function above checks `Array.isArray(parsed)`. That is shape validation — you check that what you read is actually what you expect.

If your cached data is an object with specific properties, validate those too:

```js
function loadSettingsCache(key) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (!parsed.theme || !parsed.fontSize) return null;
    return parsed;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}
```

Without shape validation, your app can read data that parses as valid JSON but has the wrong structure. That causes confusing errors far from the actual problem.

## Self-healing cache

Notice that the `catch` block calls `localStorage.removeItem(key)`. This is self-healing — if the cached data is corrupt, delete it and fall back to fetching fresh data. The next successful fetch writes clean data back to the cache.

Your app recovers automatically. You never need to tell users to open DevTools and manually clear their storage.

## When to cache

Follow this pattern:

- On page load, call `loadCache` first
- If it returns data, use that data immediately
- If it returns `null`, fetch from the API
- After a successful fetch, call `saveCache` to store the response

```js
async function loadDogs() {
  const cached = loadCache("dogs");
  if (cached) {
    renderDogs(cached);
    return;
  }

  const response = await fetch("https://dog.ceo/api/breeds/image/random/5");
  const data = await response.json();
  saveCache("dogs", data.message);
  renderDogs(data.message);
}
```

## How to test

- **View stored data** — Open DevTools, go to the Application tab, expand Local Storage in the sidebar, and click your site's origin. You can see, edit, and delete keys directly
- **Test with corrupted data** — In the Application tab, double-click a value and replace it with `{bad json`. Reload your page and confirm it recovers
- **Test offline** — In DevTools, open the Network tab, check the "Offline" checkbox, and reload. Your cached data should still appear
- **Test quota errors** — In the Console, try writing a very large string to localStorage and confirm your `saveCache` does not throw

## The pattern connection

This is the same try/catch philosophy as your serverless function error handling and the npm lint guard in package.json — try something, handle the failure gracefully. You will see this pattern everywhere in professional JavaScript:

- **localStorage wrapper** — try to read cached data, fall back to null
- **Serverless function** — try to call an API, return an error response
- **npm scripts** — try to run the linter, exit cleanly if it is not installed

The shape is always the same: try the risky operation inside `try`, recover inside `catch`.
