# Safe DOM manipulation

## Three ways to put content on the page

When you want to change what the user sees, you have three main tools. They are not equally safe.

### textContent — safe by default

`textContent` sets or reads the plain text inside an element. It never interprets HTML. If someone puts `<script>alert('hacked')</script>` in your data, `textContent` displays it as literal text on screen. Nothing executes.

```js
const heading = document.querySelector('h2');
heading.textContent = 'My Results';
```

Use `textContent` whenever you are displaying data — especially data that could come from a user, a form, or an external source.

### innerHTML — powerful and dangerous

`innerHTML` sets or reads the HTML inside an element. It parses the string as real HTML, which means it will execute anything that looks like a script or event handler.

```js
// This works — but it executes any HTML in the string
container.innerHTML = `<h3>${item.title}</h3>`;
```

If `item.title` contains `<img src=x onerror="alert('hacked')">`, `innerHTML` will execute that code. This is Cross-Site Scripting (XSS) — one of the vulnerabilities you found in Security Safari.

`innerHTML` is acceptable in one specific case: when the content is a hardcoded template literal with no variables from external data. Even then, add a comment explaining why it is safe.

If you have done the HAP DOM lab, this connects to Stations 3 and 4 — Grace's warning that innerHTML is dangerous precisely because it is powerful, and the safe code path HAP learned in response.

### createElement + appendChild — safe and explicit

The programmatic approach: create an element, configure it, attach it to the page.

```js
const card = document.createElement('div');
card.className = 'recommendation-card';

const title = document.createElement('h3');
title.textContent = item.title;

const detail = document.createElement('p');
detail.textContent = item.category;

card.appendChild(title);
card.appendChild(detail);
container.appendChild(card);
```

This is more lines of code than `innerHTML`. But every line is explicit — you can see exactly what is being created, and `textContent` ensures nothing is interpreted as HTML.

## Which should you use?

| Situation | Use | Why |
|-----------|-----|-----|
| Displaying data from your dataset | `textContent` | Safe. Never executes HTML. |
| Displaying data from a form or user input | `textContent` | Absolutely never use `innerHTML` with user input. |
| Displaying data from an API | `textContent` | You do not control what the API sends. |
| Building a card or list item from data | `createElement` + `textContent` + `appendChild` | Safe and explicit. |
| A static HTML template with zero variables | `innerHTML` is acceptable | Add a comment: `// Safe: hardcoded template, no external data` |

## Clearing a container

Before rendering new content, you usually need to clear what was there before. Two common patterns:

```js
// Pattern 1: innerHTML (acceptable for clearing)
container.innerHTML = '';

// Pattern 2: remove children one by one
while (container.firstChild) {
  container.removeChild(container.firstChild);
}
```

Pattern 1 is simpler and widely used. Since you are setting innerHTML to an empty string — not to data — it is safe.

## classList — changing appearance without changing content

When you need to change how an element looks, do not reach for `element.style`. Toggle a CSS class instead:

```js
card.classList.add('highlighted');
card.classList.remove('highlighted');
card.classList.toggle('highlighted');
```

This keeps your styles in CSS where they belong. Your JavaScript says *what* should change. Your CSS says *how* it looks.

## The security thread

This is not the first time you have encountered these ideas. In Security Safari, you found XSS vulnerabilities caused by `innerHTML` and `eval()`. In the HAP DOM lab, HAP discovered that AI-generated code used `innerHTML` without warning about the risks.

The defensive instinct — thinking about what could go wrong — is something you bring yourself. The AI will not always warn you. Your linter catches `eval()` automatically, but `innerHTML` requires your judgment. When you see it in code, ask: where does this data come from? If the answer is anything other than "I hardcoded it," use `textContent` or `createElement` instead.
