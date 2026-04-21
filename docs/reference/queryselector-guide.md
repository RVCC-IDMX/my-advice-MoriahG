# querySelector guide

## Why querySelector?

JavaScript gives you several ways to find elements in the DOM. The modern standard is `querySelector` and `querySelectorAll`. They use CSS selectors — the same syntax you already know from your stylesheets.

`getElementById` still works. You will see it in tutorials, Stack Overflow answers, and AI-generated code. But `querySelector` is more flexible and more consistent. One method, one syntax, finds anything.

If you have done the HAP DOM lab, this is the lesson from Station 2 — where HAP pushed back on `getElementById` after Grace flagged it as outdated. The story behind *why* querySelector replaced getElementById is there. This doc gives you the *how*.

## The connection to CSS

If you have this CSS:

```css
.card { background: white; }
#results { padding: 1rem; }
form { margin-bottom: 2rem; }
```

Then in JavaScript:

```js
document.querySelector('.card');      // finds first element with class "card"
document.querySelector('#results');   // finds element with id "results"
document.querySelector('form');       // finds first <form> element
```

Same selectors. Same dots and hashes. That is the whole idea.

## querySelector vs querySelectorAll

`querySelector` returns the **first** matching element, or `null` if nothing matches.

`querySelectorAll` returns a **NodeList** of all matching elements. A NodeList looks like an array but is not exactly one. You can loop through it with `forEach` or `for...of`.

```js
// One element
const form = document.querySelector('form');

// All elements with class "card"
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
  // do something with each card
});
```

## Common selector patterns

| Selector | Finds | Example |
|----------|-------|---------|
| `'form'` | First element of that tag | `querySelector('form')` |
| `'.card'` | First element with that class | `querySelector('.card')` |
| `'#results'` | Element with that ID | `querySelector('#results')` |
| `'input[type="text"]'` | First input with type text | `querySelector('input[type="text"]')` |
| `'main .card'` | First `.card` inside `<main>` | `querySelector('main .card')` |
| `'main > h2'` | First `<h2>` that is a direct child of `<main>` | `querySelector('main > h2')` |

## What about getElementById?

`document.getElementById('results')` and `document.querySelector('#results')` do the same thing. The difference:

- `getElementById` can only find by ID. Nothing else.
- `querySelector` can find by ID, class, tag, attribute, or any combination.

If you learn one method, learn the one that works everywhere.

When you see `getElementById` in your agent's code, replace it with `querySelector` and add the `#` prefix. When you see `getElementsByClassName`, replace it with `querySelectorAll` and add the `.` prefix.

## When querySelector returns null

If no element matches your selector, `querySelector` returns `null`. If you then try to do something with that `null` — like `null.textContent` — you get an error.

Always check:

```js
const element = document.querySelector('.card');
if (element) {
  element.textContent = 'Updated';
}
```

Or if the element should always exist and something is wrong if it does not, let the error happen — it will show up in your error log and tell you something important about your HTML structure.
