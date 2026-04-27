# No nested ternary expressions

## The rule

Do not nest ternary expressions. One level is fine for simple conditions. For anything more complex, use `if/else`.

## Why

Nested ternaries create code that is hard to read and debug. Even experienced developers have to slow down and mentally parse them.

## Before and after

```js
// nested ternary — hard to follow
const label = score > 90 ? "A" : score > 80 ? "B" : score > 70 ? "C" : "F";

// if/else — clear and readable
let label;
if (score > 90) {
  label = "A";
} else if (score > 80) {
  label = "B";
} else if (score > 70) {
  label = "C";
} else {
  label = "F";
}
```

A single ternary is fine when the condition is simple:

```js
// this is readable — one level, simple condition
const status = isOnline ? "Online" : "Offline";
```

## In your project

Your agent may generate nested ternaries to be concise. When you see them, rewrite as `if/else`. The few extra lines are worth the readability.

## AGENTS.md rule

```
No nested ternary expressions — use if/else
```
