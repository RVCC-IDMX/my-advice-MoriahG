# Use .dataset for data attributes

## The rule

Use `.dataset` instead of `getAttribute('data-...')` and `setAttribute('data-...', value)`.

## Why

`.dataset` gives you a clean object with camelCase property names. Less typing, easier to read.

## Before and after

```html
<div data-user-id="42" data-item-count="5"></div>
```

```js
// old pattern
const id = element.getAttribute("data-user-id");
element.setAttribute("data-item-count", "10");

// modern pattern
const id = element.dataset.userId;
element.dataset.itemCount = "10";
```

Notice the conversion: `data-user-id` in HTML becomes `dataset.userId` in JavaScript (hyphens become camelCase).

## In your project

Your Week 3 code uses `card.dataset.id` to store each advice item's ID on its card element, and reads it back with `card.dataset.id` during event delegation. This is the modern pattern in action.

## AGENTS.md rule

```
Use .dataset for data attributes — never getAttribute('data-...') or setAttribute('data-...', value)
```
