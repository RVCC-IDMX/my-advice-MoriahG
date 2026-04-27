# Use classList.toggle() for switching classes

## The rule

Use `classList.toggle()` when you need to switch a class on and off. It replaces the pattern of checking, then adding or removing.

## Why

One method, one line. No conditional logic needed.

## Before and after

```js
// old pattern — check, then add or remove
if (menu.classList.contains("open")) {
  menu.classList.remove("open");
} else {
  menu.classList.add("open");
}

// modern pattern
menu.classList.toggle("open");
```

## In your project

Your view functions use `classList.add("hidden")` and `classList.remove("hidden")` to swap views. That is correct — you are explicitly showing or hiding. But if you ever build a feature where the same action should flip a class (like a dark mode toggle or an expand/collapse), `classList.toggle()` is the right tool.

## AGENTS.md rule

```
Use classList.toggle() to switch classes on and off
```
