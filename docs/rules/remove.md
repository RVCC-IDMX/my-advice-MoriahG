# Use .remove() over parentNode.removeChild()

## The rule

Use `.remove()` instead of `parentNode.removeChild()`.

## Why

The old pattern requires you to navigate to the parent first. `.remove()` is called directly on the element you want gone.

## Before and after

```js
// old pattern — find the parent, then remove the child
element.parentNode.removeChild(element);

// modern pattern — just remove it
element.remove();
```

## In your project

When you clear a container before rebuilding its content, you might use `container.textContent = ""` (which removes all children at once). But if you ever need to remove a single specific element — like a notification or a temporary message — `.remove()` is the clean way.

## AGENTS.md rule

```
Use .remove() — never parentNode.removeChild()
```
