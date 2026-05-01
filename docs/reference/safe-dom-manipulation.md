# Safe DOM manipulation

## Three ways to put content on the page

When you want to change what the user sees, you have three main tools. They are not equally safe.

### textContent — safe by default

`textContent` sets or reads the plain text inside an element. It never interprets HTML. If someone puts `<script>alert('hacked')</script>` in your data, `textContent` displays it as literal text on screen. Nothing executes.

```js
const heading = document.querySelector("h2");
heading.textContent = "My Results";
```

Use `textContent` whenever you are displaying data — especially data that could come from a user, a form, or an external source.

### innerHTML — powerful and dangerous (now blocked by your linter)

`innerHTML` sets or reads the HTML inside an element. It parses the string as real HTML, which means it will execute anything that looks like a script or event handler.

```js
/* This works — but it executes any HTML in the string */
container.innerHTML = `<h3>${item.title}</h3>`;
```

If `item.title` contains `<img src=x onerror="alert('hacked')">`, `innerHTML` will execute that code. This is Cross-Site Scripting (XSS) — one of the vulnerabilities you found in Security Safari.

**As of Week 4, your linter blocks all `innerHTML` usage.** The `no-restricted-properties` rule in your `eslint.config.js` flags every use of `innerHTML` as an error. This means your pre-commit hook will prevent any code with `innerHTML` from being committed.

If you have done the HAP DOM lab, this connects to Stations 3 and 4 — Grace's warning that innerHTML is dangerous precisely because it is powerful, and the safe code path HAP learned in response.

### createElement + append — safe and explicit

The programmatic approach: create an element, configure it, attach it to the page.

```js
const card = document.createElement("div");
card.className = "recommendation-card";

const title = document.createElement("h3");
title.textContent = item.title;

const detail = document.createElement("p");
detail.textContent = item.category;

card.append(title);
card.append(detail);
container.append(card);
```

This is more lines of code than `innerHTML`. But every line is explicit — you can see exactly what is being created, and `textContent` ensures nothing is interpreted as HTML.

## Which should you use?

| Situation                                  | Use                                        | Why                                                                                          |
| ------------------------------------------ | ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Displaying data from your dataset          | `textContent`                              | Safe. Never executes HTML.                                                                   |
| Displaying data from a form or user input  | `textContent`                              | Absolutely never use `innerHTML` with user input.                                            |
| Displaying data from an API                | `textContent`                              | You do not control what the API sends.                                                       |
| Building a card or list item from data     | `createElement` + `textContent` + `append` | Safe and explicit.                                                                           |
| A static HTML template with zero variables | `createElement` + `textContent`            | Your linter now blocks innerHTML even for static strings. Use the safe pattern consistently. |

## Clearing a container

Before rendering new content, you usually need to clear what was there before:

```js
container.textContent = "";
```

This removes all child nodes and text content. It is safe because you are not inserting anything — you are removing everything.

**Note:** You may see older code use `container.innerHTML = ''` for clearing. Your linter will now flag this. Use `container.textContent = ''` instead — same result, no linter error, and consistent with the safe pattern throughout your code.

## classList — changing appearance without changing content

When you need to change how an element looks, do not reach for `element.style`. Toggle a CSS class instead:

```js
card.classList.add("highlighted");
card.classList.remove("highlighted");
card.classList.toggle("highlighted");
```

This keeps your styles in CSS where they belong. Your JavaScript says _what_ should change. Your CSS says _how_ it looks.

## The security thread

This is not the first time you have encountered these ideas. In Security Safari, you found XSS vulnerabilities caused by `innerHTML` and `eval()`. In the HAP DOM lab, HAP discovered that AI-generated code used `innerHTML` without warning about the risks.

Your linter now catches both. `eval()` is blocked by the `no-eval` rule (since Week 1). `innerHTML` is blocked by the `no-restricted-properties` rule (since Week 4). These are two layers of the enforcement ladder working together:

- **Advisory:** Your AGENTS.md says "never use innerHTML with external data"
- **Linting:** Your ESLint config flags every `innerHTML` usage as an error
- **Blocking:** Your pre-commit hook runs ESLint — code with `innerHTML` cannot be committed

Before Week 4, `innerHTML` required your judgment. Now your linter enforces it mechanically. The judgment still matters — understanding _why_ innerHTML is dangerous is what lets you make good decisions in codebases that do not have this rule. But in your project, the guardrail is in place.
