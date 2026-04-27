# Use template literals over concatenation

## The rule

Use template literals (backtick strings with `${}`) instead of string concatenation with `+`.

## Why

Template literals are easier to read, especially with multiple variables. No more `+` between every piece. They also support multi-line strings without escape characters.

## Before and after

```js
// old pattern
const message = "Hello, " + name + "! You have " + count + " items.";

// modern pattern
const message = `Hello, ${name}! You have ${count} items.`;
```

## In your project

You have been using template literals since early in the semester. Your agent knows them well. This rule is here as reinforcement — if you ever see your agent fall back to concatenation, you know to change it.

## AGENTS.md rule

```
Use template literals — never string concatenation with +
```
