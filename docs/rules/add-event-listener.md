# Use addEventListener over onclick

## The rule

Use `addEventListener` instead of `onclick`, `onchange`, or other `on`-properties.

## Why

`onclick` only allows one handler per event — adding a second one silently replaces the first. `addEventListener` allows multiple handlers and gives you control over event phases. This is what the HAP Events lab teaches in Station 6.

## Before and after

```js
// old pattern — only one handler allowed
button.onclick = handleClick;
// this REPLACES the first handler:
button.onclick = handleOtherClick;

// modern pattern — both handlers run
button.addEventListener("click", handleClick);
button.addEventListener("click", handleOtherClick);
```

## In your project

Your Week 3 code uses `addEventListener` for form submission, card clicks, and back navigation. Your agent may sometimes generate `onclick` assignments — especially for simple cases. Change them to `addEventListener`.

## AGENTS.md rule

```
Use addEventListener — never onclick, onchange, or other on-properties
```
