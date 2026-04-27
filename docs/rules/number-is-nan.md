# Use Number.isNaN() over isNaN()

## The rule

Use `Number.isNaN()` instead of the global `isNaN()`.

## Why

The global `isNaN()` coerces its argument to a number first, which produces surprising results: `isNaN("hello")` returns `true` even though `"hello"` is not `NaN` — it is a string. `Number.isNaN()` only returns `true` for actual `NaN` values.

## Before and after

```js
// old pattern — coerces, then checks
isNaN("hello"); // true (surprising — "hello" is not NaN)
isNaN(undefined); // true (also surprising)
isNaN(42); // false

// modern pattern — no coercion
Number.isNaN("hello"); // false (correct — it is a string)
Number.isNaN(undefined); // false (correct — it is undefined)
Number.isNaN(NaN); // true (the only thing that is NaN)
```

## In your project

You may not encounter `NaN` often in your current code. But when you start working with user input or API responses that should be numbers, `Number.isNaN()` is the safe check.

## AGENTS.md rule

```
Use Number.isNaN() — never global isNaN()
```
