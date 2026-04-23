# Instructions — Week 2: DOM Fundamentals

**Due:** Thursday, April 2, 2026 at 5:00 PM ET

**HAP Learning Lab companion:** [hap-dom.netlify.app](https://hap-dom.netlify.app)

This week you take ownership of the code. In Week 1, an AI agent built your site. This week you read it, understand it, and improve it — by hand.

This assignment has four parts. Work through them in order.

---

## Part 1 — Read your code

Before you change anything, understand what you have.

1. **Update AGENTS.md first.** Open `AGENTS.md` and update the "About this student" section. You are about to learn DOM manipulation — tell your agent that. This is the start-of-week ritual: before you begin new work, make sure your AI tools know what you are learning. You will update it again at the end of the week with what you actually learned.

2. **Start the dev server:**
   ```bash
   npm run dev
   ```
   Confirm your site loads and the form works.

3. **Open `src/js/app.js`** and read it top to bottom. Do not skim — read every line. For each function, answer these questions in your head:
   - What does this function receive?
   - What does it do with the DOM?
   - What does it return?

4. **Open `src/js/matching.js`** and do the same. Notice that this file has no DOM code — it works entirely with data. That separation is intentional.

5. **Open `src/js/data.js`** and look at the shape of your data. How many items do you have? What properties does each item have?

6. **Open your browser's DevTools** (F12 or right-click → Inspect). Go to the Console tab. Try these:
   ```js
   document.querySelector('form')
   document.querySelector('h1')
   document.querySelectorAll('option')
   ```
   You should see your form, your heading, and a list of your select options. This is how JavaScript finds things in the DOM — and it is how you will work with the DOM from now on.

If you can explain what each function in `app.js` does to someone else, you are ready for Part 2.

---

## Part 2 — Modernize your code

Your agent likely used some patterns that are outdated or unsafe. You are going to fix them.

### Replace `getElementById` with `querySelector`

If your `app.js` uses `document.getElementById('something')`, replace every instance with `document.querySelector('#something')`. Notice the `#` — that is a CSS selector for an ID element. The same syntax you already know from your stylesheets.

`querySelector` is the modern standard. It uses CSS selectors, which means you can find elements by class (`.card`), by tag (`form`), by attribute (`[data-id]`), or by ID (`#results`). `getElementById` can only find by ID.

Read `docs/reference/queryselector-guide.md` for the full picture. If you have done the HAP DOM lab, this connects to Station 2 — the scene where HAP pushed back on `getElementById`.

After replacing, run your site and confirm everything still works.

### Replace `innerHTML` with safe DOM methods

Look for any place your code uses `innerHTML` to build HTML from data. This is common in card-building functions — the agent may have written something like:

```js
card.innerHTML = `
  <h3>${item.title}</h3>
  <p>${item.category}</p>
`;
```

This works, but it is a security risk when the data could come from user input or an external source. In Security Safari, you saw how `innerHTML` can execute injected scripts.

Replace it with programmatic DOM construction:

```js
const heading = document.createElement('h3');
heading.textContent = item.title;

const category = document.createElement('p');
category.textContent = item.category;

card.appendChild(heading);
card.appendChild(category);
```

This is more lines of code, but it is safe by default — `textContent` never executes HTML.

Read `docs/reference/safe-dom-manipulation.md` for a deeper explanation. If you have done the HAP DOM lab, this connects to Stations 3 and 4 — Grace's warning about `innerHTML` and the safe code path.

Replace every `innerHTML` that builds from data. If you have `innerHTML` that creates a static template with no variables, that is acceptable — but add a comment explaining why it is safe.

### Run lint and fix

After your changes:
```bash
npm run lint
```

Fix any errors. Log each error and fix in `docs/error-log.md`.

---

## Part 3 — DOM experiments

Now that you know how to find and change things in the DOM, it is time to play.

1. **Create a new file: `src/js/experiments.js`**

2. **Link it in your `index.html`** with a script tag:
   ```html
   <script type="module" src="/src/js/experiments.js"></script>
   ```

3. **Work through the experiments in `docs/tutorials/dom-experiments.md`.** The tutorial has a menu of things to try — from simple (change text on the page) to adventurous (build something from scratch that was not in the original HTML).

   Every experiment uses the DOM methods you just learned: `querySelector`, `textContent`, `classList`, `createElement`, `appendChild`. The goal is to get comfortable with them by doing things that are visible and immediate.

4. **Keep at least 5 experiments in your final `experiments.js`.** Comment each one so you remember what it does and why you tried it.

5. **Run lint and fix:**
   ```bash
   npm run lint
   ```
   Update `docs/error-log.md` with any errors.

The experiments file is yours. It is a sandbox for learning. Next week you will use these same skills to build real features — but this week, the point is to try things and see what happens.

---

## Part 4 — Update AGENTS.md and reflect

You now know things about the DOM that you did not know last week. Your AGENTS.md should reflect that.

1. **Update the "About this student" section** again. At the start of the week you told your agent you were about to learn DOM manipulation. Now update it to reflect what you actually learned — be specific about what you can do.

2. **Add at least 2 new personal instructions** to the bottom section based on what you learned this week. Think about:
   - Did the agent generate `getElementById` when you now know `querySelector` is better? Add a rule.
   - Did the agent use `innerHTML` in ways that concern you after reading about XSS? Add a rule.
   - What DOM patterns do you want the agent to follow going forward?

3. **Complete `docs/reflections/week-2-reflection.md`** — answer every question thoughtfully. This file arrives in your repo via the week 2 PR in a new `docs/reflections/` folder.

4. **Run lint, build, and deploy:**
   ```bash
   npm run lint
   npm run build
   ```
   Deploy to Netlify. Push to GitHub. Confirm the Actions lint check passes.

## What to submit

- Your live Netlify URL
- Your GitHub repo URL
- A 2–3 sentence answer on Canvas: What was the most surprising thing you discovered when reading the code the agent wrote for you?
