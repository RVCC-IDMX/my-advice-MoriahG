# Use textContent over innerText

## The rule

Use `textContent` instead of `innerText`.

## Why

`innerText` triggers a browser reflow — it checks CSS to determine what is visible. `textContent` is faster and returns all text regardless of styling. For setting text safely, both prevent XSS, but `textContent` is the standard choice.

## Before and after

```js
// old pattern
paragraph.innerText = userName;
const name = heading.innerText;

// modern pattern
paragraph.textContent = userName;
const name = heading.textContent;
```

## In your project

You replaced `innerHTML` with `createElement` + `textContent` in Week 2. This rule reinforces that — when your agent writes `innerText`, change it to `textContent`. They look similar but `textContent` is more predictable.

## AGENTS.md rule

```
Use textContent — never innerText
```
