# Use .append() over .appendChild()

## The rule

Use `.append()` instead of `.appendChild()`.

## Why

`.append()` accepts multiple elements and strings in one call. `.appendChild()` only takes one node at a time. Less code, same result.

## Before and after

```js
// old pattern
list.appendChild(item1);
list.appendChild(item2);
list.appendChild(item3);

// modern pattern
list.append(item1, item2, item3);
```

You can also append text directly:

```js
// .append() accepts strings too
paragraph.append("Hello, ", strongElement, "!");
```

## In your project

Your `views.js` and `app.js` use `.appendChild()` to add cards and elements to containers. Each of these could be `.append()` instead — especially when you are adding multiple children.

## AGENTS.md rule

```
Use .append() — never .appendChild()
```
