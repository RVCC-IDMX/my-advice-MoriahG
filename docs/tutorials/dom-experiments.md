# DOM experiments

This is a menu of things to try. Each experiment uses the DOM methods you learned this week: `querySelector`, `textContent`, `classList`, `createElement`, `appendChild`.

Create `src/js/experiments.js`, link it in your `index.html`, and try things from each tier. Keep at least 5 experiments in your final file. Comment each one.

> **Your selectors will differ.** The examples below use class names like `.recommendation-card` and IDs like `#recommendation-list`. Your agent may have chosen different names. Before running an experiment, open your `index.html` and `src/js/app.js` to find the actual class names and IDs your site uses, and adjust the selectors to match.

---

## Comfortable

These use one or two methods. You should see instant results on the page.

### Change text on the page

Find an element and change its text:

```js
const heading = document.querySelector('h1');
heading.textContent = 'Welcome to My Awesome Site';
```

Try it with different elements — your heading, a label, a paragraph. What happens when you change the text of a `<button>`?

### Toggle a class

Add or remove a CSS class to change how something looks:

```js
const form = document.querySelector('form');
form.classList.add('highlighted');
```

You will need a `.highlighted` class in your CSS for this to be visible. Try creating one with a border, background color, or shadow. Then try `classList.toggle()` — what does toggle do differently from add?

### Count elements

Use `querySelectorAll` to count things on your page:

```js
const allOptions = document.querySelectorAll('option');
console.log(`This page has ${allOptions.length} options`);
```

Try counting other things — how many `<p>` tags? How many elements with a specific class?

### Read and display an attribute

Read an attribute from an element and put it somewhere visible:

```js
const firstInput = document.querySelector('input');
const inputType = firstInput.getAttribute('type');

const info = document.createElement('p');
info.textContent = `The first input is type: ${inputType}`;
document.querySelector('main').appendChild(info);
```

---

## Stretching

These combine several methods or require you to think about structure.

### Add something that was not in the HTML

Build a footer from scratch and add it to the page:

```js
const footer = document.createElement('footer');
const footerText = document.createElement('p');
footerText.textContent = 'Built by me. Powered by learning.';
footer.appendChild(footerText);
document.body.appendChild(footer);
```

Try building other things — a banner, a subtitle, a small "about this site" section.

### Modify every card

If your site renders result cards, try changing all of them at once:

```js
const cards = document.querySelectorAll('.recommendation-card');
cards.forEach((card, index) => {
  card.classList.add('experiment-border');
  const badge = document.createElement('span');
  badge.textContent = `#${index + 1}`;
  badge.className = 'card-badge';
  card.prepend(badge);
});
```

This adds a numbered badge to every card. You will need to add some CSS to style `.experiment-border` and `.card-badge`.

### Hide and show

Make something disappear and reappear. You can do this with a class:

```css
/* In your CSS file */
.hidden { display: none; }
```

```js
const results = document.querySelector('#recommendation-list');
results.classList.add('hidden');    // disappears
results.classList.remove('hidden'); // comes back
```

Think about when hiding and showing would be useful in a real app. You will use this pattern a lot in coming weeks.

### Replace a child element

Find an element inside another and swap it for something new:

```js
const container = document.querySelector('main');
const oldHeading = container.querySelector('h2');

const newHeading = document.createElement('h2');
newHeading.textContent = 'Fresh Results Just For You';

container.replaceChild(newHeading, oldHeading);
```

---

## Adventurous

These are open-ended. There is no single right answer.

### Build a "page stats" section

Create a section at the bottom of your page that reports what the DOM contains. How many elements total? How many with a specific class? How many form fields? Build the section entirely with JavaScript — no new HTML.

### Restyle the page dynamically

Write code that finds all elements with a certain class and changes their appearance by toggling CSS classes. Try creating a "dark mode" toggle that adds a class to the `<body>` and lets your CSS handle the rest.

### Create something that was not in your BUILD-PROMPT

Think of a small addition to your page that your agent did not build. A subtitle, a decorative section, a "fun fact" about your topic, a site credit. Build it entirely with `createElement`, `textContent`, and `appendChild`.

---

## Tips

- If something does not work, open the Console tab in DevTools. The error message will usually tell you what went wrong.
- `querySelector` returns `null` if it cannot find a match. If you see "Cannot read properties of null," your selector did not match anything. Check your spelling and your dot/hash prefixes.
- Every experiment is a chance to practice. If you break something, `Ctrl+Z` in your editor or `git checkout -- filename` in the terminal brings it back.
- Log any errors you encounter in `docs/error-log.md` — that is what it is for.
