# Use .find() over .filter()[0]

## The rule

Use `.find()` instead of `.filter()[0]`.

## Why

`.filter()` scans the entire array and builds a new array just so you can grab the first element. `.find()` stops as soon as it finds a match — faster and clearer about intent.

## Before and after

```js
// old pattern — scans everything, builds array, takes first
const admin = users.filter((user) => user.role === "admin")[0];

// modern pattern — stops at first match
const admin = users.find((user) => user.role === "admin");
```

Both return `undefined` if nothing matches.

## In your project

Your Week 3 `app.js` uses `.find()` in the card click handler to look up an advice item by its ID:

```js
const item = lastResults.find((result) => result.id === itemId);
```

This is the correct pattern. If your agent generates `.filter(...)[0]` for the same task, change it to `.find()`.

## AGENTS.md rule

```
Use .find() — never .filter()[0]
```
