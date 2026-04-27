# Use .before(), .after(), and .replaceWith()

## The rule

Use `.before()`, `.after()`, and `.replaceWith()` instead of `.insertBefore()` and `.replaceChild()`.

## Why

The old methods are called on the parent and require a reference to both the new element and the target. The new methods are called on the target element itself and read like plain English.

## Before and after

```js
// old pattern — called on the parent
parent.insertBefore(newElement, referenceElement);
parent.replaceChild(newElement, oldElement);

// modern pattern — called on the target
referenceElement.before(newElement);
oldElement.replaceWith(newElement);
```

You can also insert after an element:

```js
// insert newElement right after referenceElement
referenceElement.after(newElement);
```

## In your project

If you ever need to insert an element at a specific position — like adding a message before the results container or replacing a card with an updated version — these methods are cleaner than navigating to the parent first.

## AGENTS.md rule

```
Use .before(), .after(), .replaceWith() — never .insertBefore() or .replaceChild()
```
