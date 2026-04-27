# Instructions — Week 3: Events & View Functions

**Due:** Thursday, April 9, 2026 at 5:00 PM ET

**HAP Learning Lab companion:** [hap-events.netlify.app](https://hap-events.netlify.app)

This week you add real interactivity to your site. Until now, the AI agent wrote the event handler for your form. This week you understand that handler, write your own event listeners, and restructure your code so your app feels like it has multiple pages — all within one HTML file.

This assignment has five parts. Work through them in order.

---

## Part 0 — Prepare your agent

Before you write any code this week, update your AGENTS.md so your AI agent knows what you are learning and what patterns to follow.

Read `docs/guides/context-engineering.md` first. It explains why your AGENTS.md matters, how to keep it effective, and the most common mistakes. The key idea: your AGENTS.md is a budget, not a wishlist. Every rule costs tokens — choose rules that catch real mistakes, not rules that sound good.

1. **Update the "About this student" section.** You are about to learn events and view functions — tell your agent that. This is the start-of-week ritual: before new work begins, make sure your AI tools know what you are learning.

2. **Learn the modern JS rules.** Open `docs/rules/README.md` and read through the rule list. Each rule links to a page explaining what it does, why the modern version is better, and what the old pattern looks like. You do not need to memorize them — but read enough to recognize them.

3. **Add rules to your AGENTS.md.** Choose rules from `docs/rules/` that apply to your project and add them to your AGENTS.md under your code rules section. Do not add every rule — pick the ones that match patterns you have actually seen your agent generate. Five to ten well-chosen rules are more effective than thirty. Each rule page includes a ready-to-paste line at the bottom.

When your AGENTS.md is updated with this week's context and the modern JS rules, you are ready for Part 1.

---

## Part 1 — Know your code

Before you change anything, document what you have.

1. **Fill out your code map.** Open `docs/my-code-map.md` and complete every section. This means opening your actual files — `index.html`, `app.js`, `matching.js`, `data.js`, `experiments.js`, `style.css` — and writing down what you find. Do not guess. The code map is your reference for the rest of this assignment.

   Take your time here. If you cannot answer a section, that is useful information — it means you need to read that file more carefully.

2. **Review your experiments.** Open `src/js/experiments.js` and read through your Week 2 experiments. Decide which ones you want to keep as part of your site going forward. Good candidates:
   - Anything that creates content the user would want to see
   - Class toggles or hide/show patterns you built
   - Elements you added to the page that improve it

3. **Migrate your keepers.** Move the code for any experiments you want to keep into `src/js/app.js`. Put them after the imports and before the form handler. Once you have moved everything you want to keep:
   - Delete `src/js/experiments.js`
   - Remove the `<script type="module" src="/src/js/experiments.js"></script>` line from `index.html`

4. **Run lint and fix:**
   ```bash
   npm run lint
   ```
   Fix any errors. Log each one in `docs/error-log.md`.

If your code map is filled out and experiments.js is gone, you are ready for Part 2.

---

## Part 2 — Extract view functions into views.js

Right now your `app.js` does everything — finds elements, builds cards, handles events. This part separates the rendering into its own module.

Read `docs/tutorials/what-is-an-spa.md` before starting. It explains the SPA pattern and why you are making this change.

1. **Create `src/js/views.js`.** This file will export functions that build and display each "screen" of your app.

2. **Write three view functions:**
   - **`showResults(items, container)`** — Takes an array of items and a container element. Clears the container, builds a card for each item using `createElement` and `textContent` (the safe DOM patterns from Week 2), and appends them. If you completed the HAP Events lab, this is the pattern from Station 3.

   - **`showNoResults(container)`** — Takes a container element. Clears it and shows a "no results" message.

   - **`showDetail(item, container)`** — Takes a single item and a container element. Clears the container and builds a detailed view of that one item — show all its properties, add a back button. This is new.

3. **Export all three functions:**

   ```js
   export { showResults, showNoResults, showDetail };
   ```

4. **Update `app.js`.** Import your view functions and use them where the rendering code used to be:

   ```js
   import { showResults, showNoResults, showDetail } from "./views.js";
   ```

5. **Add the .hidden class** to your CSS if you do not already have it (check your code map):

   ```css
   .hidden {
     display: none;
   }
   ```

6. **Test.** Run `npm run dev`, submit the form, and confirm results still display correctly. The rendering now happens through your view functions instead of directly in app.js.

7. **Run lint and fix.** Log errors in `docs/error-log.md`.

Read `docs/tutorials/arrow-functions.md` if you see arrow function syntax you do not recognize — your agent may use it when writing view functions.

---

## Part 3 — Wire events and delegation

Now you connect events to your views. When the user clicks a card, they see the detail view. When they click back, they return to results.

Read `docs/tutorials/event-listeners-101.md` and `docs/tutorials/callbacks-explained.md` before starting. The HAP Events lab at [hap-events.netlify.app](https://hap-events.netlify.app) covers each concept in depth — work through the stations alongside this part if you want more practice.

1. **Understand the inherited form handler.** Find the `addEventListener("submit", ...)` in your `app.js`. Read it line by line. Add a comment above it explaining what it does in your own words. Do not rewrite it — just understand it and document it.

2. **Add event delegation on the results container.** Instead of adding a click listener to every card, add one listener to the container (the element you identified in your code map):

   ```js
   function handleCardClick(event) {
     const card = event.target.closest(".advice-card");
     if (!card) return;

     // find the item this card represents
     // call showDetail(item, container)
   }

   output.addEventListener("click", handleCardClick);
   ```

   You will need a way to connect each card to its data item. One approach: store the item's `id` as a `data-id` attribute on the card element, then look it up in your data when the card is clicked.

3. **Add a back button in the detail view.** Your `showDetail` function should include a back button. Add a listener for it:

   ```js
   function handleBackClick() {
     // show results again with the last set of results
   }

   backButton.addEventListener("click", handleBackClick);
   ```

   You will need to keep track of the last results so you can restore them. A module-level variable works fine.

4. **Use named callback functions.** Define each handler as a separate function with a descriptive name (`handleFormSubmit`, `handleCardClick`, `handleBackClick`) and pass it to `addEventListener` by name. See `docs/tutorials/callbacks-explained.md` for why.

5. **Test the full flow:**
   - Submit the form → results appear
   - Click a card → detail view appears
   - Click back → results reappear

6. **Run lint and fix.** Log errors in `docs/error-log.md`.

---

## Part 4 — Update AGENTS.md and reflect

You now understand events, view functions, and the SPA pattern. Your AGENTS.md should reflect that.

1. **Update the "About this student" section** to reflect what you actually learned this week. Be specific — what can you do now that you could not do last week?

2. **Add at least 2 more personal instructions** based on what you learned this week. Think about:
   - Does your agent try to create separate HTML files when it should use view functions? Add a rule.
   - Does your agent use anonymous inline callbacks when named callbacks would be more readable? Add a rule.
   - Does your agent use event delegation or does it add listeners to individual elements? Add a preference.
   - Did you notice your agent break any of the modern JS rules you added in Part 1? Strengthen the rule or add a note about what it got wrong.

3. **Complete `docs/reflections/week-3-reflection.md`** — answer every question thoughtfully.

4. **Run lint, build, and deploy:**
   ```bash
   npm run lint
   npm run build
   ```
   Deploy to Netlify. Push to GitHub. Confirm the Actions lint check passes.

---

## What to submit

- Your live Netlify URL
- Your GitHub repo URL
- A 2-3 sentence answer on Canvas: What was the most important thing you learned about how events work in the browser?
