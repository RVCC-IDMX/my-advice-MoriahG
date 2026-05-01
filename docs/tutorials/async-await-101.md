# Async/await 101

## Why JavaScript needs async

When your code asks a server for data, the response might take half a second or more. If JavaScript froze the entire browser while waiting, you could not scroll, click, or type. Nothing would work until the data arrived.

JavaScript solves this by making network requests **asynchronous** -- your code sends the request, then keeps running. When the response arrives later, a callback handles it. `async`/`await` is the modern way to write that pattern.

## What a Promise is

A **Promise** is a placeholder for a value that does not exist yet. When you call `fetch()`, it does not return the data. It returns a Promise -- an object that says "I will have a value for you eventually."

A Promise can be in one of three states:

- **Pending** -- still waiting
- **Fulfilled** -- the value arrived
- **Rejected** -- something went wrong

You do not need to understand every detail of Promises right now. Just know that `fetch()` returns one, and `await` unwraps it for you.

## The async keyword

Adding `async` before a function declaration marks it as asynchronous. An `async` function always returns a Promise, even if you do not explicitly return one.

```js
async function getAdvice() {
  /* this function can now use await inside it */
}
```

You cannot use `await` outside of an `async` function. If you try, you get a syntax error.

## The await keyword

`await` pauses execution inside an `async` function until a Promise resolves. It then gives you the resolved value.

```js
async function getAdvice() {
  const response = await fetch("https://api.adviceslip.com/advice");
  const data = await response.json();
  console.log(data);
}
```

Notice there are **two** awaits. The first waits for the server to respond. The second waits for the response body to be parsed as JSON. Both `fetch()` and `.json()` return Promises.

If you completed hap-fetch Station 1, this is the same pattern -- you fetched a dog image URL and awaited both the response and the JSON parsing.

## Error handling with try/catch

Network requests can fail. The server might be down, the URL might be wrong, or the user might be offline. Wrap your async code in `try`/`catch` to handle errors gracefully.

```js
async function getAdvice() {
  try {
    const response = await fetch("https://api.adviceslip.com/advice");

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.slip.advice;
  } catch (error) {
    console.error("Failed to fetch advice:", error.message);
  }
}
```

Two things to note:

- `fetch()` only rejects on network failure. A 404 or 500 response does not throw automatically. Check `response.ok` yourself.
- The `catch` block receives the error object. Use `error.message` to see what went wrong.

## A simple fetch example

Here is a complete example that fetches advice and displays it on the page:

```js
async function displayAdvice() {
  try {
    const response = await fetch("https://api.adviceslip.com/advice");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    const adviceEl = document.querySelector("#advice");
    adviceEl.textContent = data.slip.advice;
  } catch (error) {
    console.error("Could not load advice:", error.message);
  }
}

/* call the function to kick off the fetch */
displayAdvice();
```

## Common mistakes

- **Forgetting `await`** -- Without `await`, you get a Promise object instead of the actual data. If you see `[object Promise]` on your page, you probably forgot an `await`.
- **Forgetting `async`** -- Using `await` in a regular function causes a syntax error. The function must be marked `async`.
- **Not handling errors** -- If you skip `try`/`catch` and the request fails, you get an unhandled promise rejection. Always wrap fetch calls in `try`/`catch`.
- **Only awaiting `fetch()` but not `.json()`** -- Both return Promises. You need `await` on both.
- **Checking the data shape** -- APIs return different structures. Always `console.log(data)` first to see what you are working with before trying to access nested properties.

## Quick reference

```js
async function fetchData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch failed:", error.message);
  }
}
```

This pattern works for any JSON API. Change the URL, adjust how you read `data`, and you are set.
