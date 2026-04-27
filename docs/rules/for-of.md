# Use for...of over .forEach() and C-style loops

## The rule

Use `for...of` instead of `.forEach()` or C-style `for (let i = 0; ...)` loops.

## Why

`for...of` supports `break`, `continue`, and `return` (in functions). `.forEach()` does not — you cannot exit early, which leads to wasted iterations or workarounds. C-style loops invite off-by-one errors and require managing an index variable.

## Before and after

```js
// .forEach() — cannot break or continue
items.forEach((item) => {
  console.log(item.name);
});

// C-style — index management, off-by-one risk
for (let i = 0; i < items.length; i++) {
  console.log(items[i].name);
}

// modern pattern
for (const item of items) {
  console.log(item.name);
}
```

If you need the index:

```js
for (const [index, item] of items.entries()) {
  console.log(index, item.name);
}
```

## In your project

Your `views.js` uses `for...of` to build cards. Your agent may generate `.forEach()` — it is not wrong, but `for...of` is the preferred pattern because it gives you more control.

## AGENTS.md rule

```
Use for...of — never .forEach() or C-style for loops
```
