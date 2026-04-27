# Use .includes() over .indexOf()

## The rule

Use `.includes()` instead of `.indexOf() !== -1`.

## Why

`.includes()` returns a boolean — exactly what you need for "is this in the array?" or "does this string contain this substring?" The `.indexOf()` pattern returns a number and requires a comparison that is easy to get wrong.

## Before and after

```js
// old pattern — returns -1 if not found
if (fruits.indexOf("apple") !== -1) {
  // found
}

// modern pattern — returns true or false
if (fruits.includes("apple")) {
  // found
}
```

Works for strings too:

```js
// old pattern
if (message.indexOf("error") !== -1) {
  /* contains "error" */
}

// modern pattern
if (message.includes("error")) {
  /* clear */
}
```

## In your project

Your `matching.js` filters data by mood. If you ever need to check whether a value exists in an array or a string contains a substring, use `.includes()`.

## AGENTS.md rule

```
Use .includes() — never .indexOf() !== -1
```
