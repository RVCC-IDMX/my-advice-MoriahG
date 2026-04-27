# Use querySelector over getElementById

## The rule

Use `querySelector` and `querySelectorAll` instead of `getElementById`, `getElementsByClassName`, or `getElementsByTagName`.

## Why

One API that works for everything — IDs, classes, attributes, combinations. You learn CSS selectors once and use them everywhere. The older methods each handle one case and return different types (Element vs HTMLCollection vs NodeList).

## Before and after

```js
// old pattern
const header = document.getElementById("header");
const cards = document.getElementsByClassName("card");
const paragraphs = document.getElementsByTagName("p");

// modern pattern
const header = document.querySelector("#header");
const cards = document.querySelectorAll(".card");
const paragraphs = document.querySelectorAll("p");
```

## In your project

Your Week 2 modernization replaced `getElementById` with `querySelector` throughout `app.js`. This is the same rule — your agent may still reach for the old method, especially for IDs.

## AGENTS.md rule

```
Use querySelector/querySelectorAll — never getElementById, getElementsByClassName, or getElementsByTagName
```
