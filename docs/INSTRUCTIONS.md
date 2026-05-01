# Instructions — Week 4: Fetch, serverless, and live data

**Due:** Thursday, April 16, 2026 at 5:00 PM ET

**HAP Learning Lab companion:** [hap-fetcher.netlify.app](https://hap-fetcher.netlify.app)

This week you replace your static data with live API data. Your views, events, and DOM code from Weeks 2-3 stay the same. The data source changes. You will write a serverless function that talks to your API, fetch that data from the browser, cache it in localStorage, and deploy the result.

This assignment has six parts. Work through them in order.

---

## Part 0 — Merge, install, and meet your new linter

The Week 4 PR delivers upgraded tooling (ESLint 9 + eslint-plugin-unicorn) and a working serverless function. Before you write any code, get the new tooling running.

1. **Read the PR description** on GitHub. It explains what is changing and why.

2. **Merge the PR.**

3. **Run `npm install`.** Notice the preinstall and postinstall messages in your terminal. These are npm lifecycle hooks — read `docs/tutorials/npm-lifecycle-scripts.md` to understand what just happened.

4. **Delete `.eslintrc.cjs`.** The new `eslint.config.js` replaces it. Having both files is confusing — remove the old one now. This is the upgrade the preinstall hook just warned you about.

5. **Run `npm run lint`.** See what the new unicorn rules flag in your existing code. These are violations that Week 3's four-rule config did not catch.

6. **Read the hook and enforcement docs:**
   - `docs/tutorials/what-are-hooks.md` — understand the hook pattern across the whole stack (browser events, Git, npm lifecycle, serverless)
   - `docs/tutorials/harness-engineering.md` — understand the enforcement ladder: advisory (AGENTS.md) → linting (ESLint + unicorn) → blocking (pre-commit hook). This is called **harness engineering** — the discipline of building systems that make AI-generated code reliable. You have been doing it all semester.
   - `docs/reference/safe-dom-manipulation.md` — updated for Week 4. Your linter now blocks `innerHTML` everywhere, not just for data. Read the "security thread" section to understand why.

7. **Fix lint violations.** Some auto-fix:

   ```bash
   npm run lint -- --fix
   ```

   Others need manual changes. Read `docs/reference/unicorn-rules-guide.md` to understand what each rule catches and why the fix matters.

8. **Log each fix in `docs/error-log.md`.**

9. **Update AGENTS.md.** Add async/fetch rules for the week ahead and note the new enforcement layer. Your agent needs to know about `async/await`, `try/catch`, and `response.ok` before you start writing fetch code.

10. **Test the starter function.** Run `npm run dev:api` and visit `http://localhost:8888/.netlify/functions/api` in your browser. You should see Dog API data that the serverless function returns. This function works right now — you will replace its data source in Part 1.

    > First time running this? See the "Running the dev server" section in `docs/tutorials/your-first-serverless-function.md` — it explains the npx prompt, the one-time `npx netlify login` step, what to expect in the terminal, and why you use `dev:api` instead of `dev`.
    >
    > If you completed [HAP's "Living in the Terminal" Station 3](https://hap-and-terminal.netlify.app/stations/station3/), you already have the Netlify CLI. The [Developer CLI Tools cheat sheet](https://hap-and-terminal.netlify.app/cheat-sheets/dev-tools/) has a quick reference for all the CLI tools in this project.

When `npm run lint` passes and the starter function returns data, you are ready for Part 1.

---

## Part 1 — Serverless proxy

Replace the hardcoded Dog API data in `netlify/functions/api.mjs` with a real fetch to your project's API.

1. **Read the docs:**
   - `docs/tutorials/your-first-serverless-function.md` — how Netlify Functions work, ESM exports, `new Response()`
   - Your API guide in `docs/api-guides/` — find the one matching your API for endpoints, response shape, and how to query it
   - `docs/tutorials/async-await-101.md` — if async/await is new to you

2. **Replace the hardcoded data.** In `netlify/functions/api.mjs`, remove the `sampleData` object and replace it with a fetch to your API.

3. **Transform the response.** The serverless function is where the translation happens. Map the API's fields into the shape your views already expect. Your `views.js` should not need to change yet.

4. **Add error handling:**
   - Wrap the API call in `try/catch`
   - Check `response.ok` on the upstream fetch before parsing
   - Return a 502 status with a JSON error message on failure

5. **If your API requires a key:** Create a `.env` file in your project root with the key. Access it in the function via `process.env.YOUR_KEY_NAME`. Do not commit `.env` to Git.

6. **Test.** Run `npm run dev:api` and visit `http://localhost:8888/.netlify/functions/api` in your browser. You should see your API's data in the shape your views expect.

7. **Run lint and fix.** Log errors in `docs/error-log.md`.

---

## Part 2 — Fetch and render

Replace `import { data } from './data.js'` with a fetch call to your serverless function.

1. **Read the docs:**
   - `docs/reference/fetch-cheatsheet.md` — `fetch()`, `response.ok`, `response.json()`, error patterns
   - `docs/reference/http-status-codes.md` — why fetch does not throw on 404

2. **Write an async function** that fetches from `/.netlify/functions/api`.

3. **Wire the fetched data** into your existing view functions. The rendering code does not change — only where the data comes from.

4. **Add a loading state** so the user sees something while data loads. A simple "Loading..." message in the output container works.

5. **Add error handling:**
   - Wrap the fetch in `try/catch`
   - Check `response.ok` before calling `response.json()`
   - Show an error message in the DOM if the fetch fails — not just `console.log`

6. **Test.** Run `npm run dev:api`, submit the form. Cards should render from live API data. Same look as before, different source.

7. **Run lint and fix.** Log errors in `docs/error-log.md`.

---

## Part 3A — Enrich your views with new API data

Your static `data.js` was a placeholder. The real API gives you data you could not have before.

1. **Check your API guide in `docs/api-guides/`** for enrichment candidates — fields the API provides that `data.js` did not have. Look for images, scores, previews, descriptions, or any field that would make your cards more interesting.

2. **Choose 1-2 new fields** to add to your app.

3. **Update your serverless function** to include the new field(s) in the transformed response.

4. **Update `views.js`** to display the new data. Add a new element in the card or detail view.

5. **Add defensive rendering.** Not every item may have every field. Check before creating the DOM element:

   ```js
   if (item.imageUrl) {
     const img = document.createElement("img");
     img.src = item.imageUrl;
     img.alt = item.title;
     card.append(img);
   }
   ```

6. **Test.** You should see something new in your cards or detail view that was impossible with static data.

7. **Run lint and fix.** Log errors in `docs/error-log.md`.

---

## Part 3B — Cache with localStorage

Cache API responses so your app works offline and loads faster on repeat visits.

1. **Read `docs/tutorials/localstorage-safe-patterns.md`.** This is the same try/catch wrapper pattern from hap-fetch Station 3, applied to your own project.

2. **Write `loadCache` and `saveCache` functions** using the safe try/catch wrapper pattern. Never let a `localStorage` failure crash your app.

3. **After a successful fetch, save the response** to localStorage.

4. **On page load, check cache first.** Only fetch if the cache is empty or invalid.

5. **Add shape validation.** Check that cached data is the shape you expect — is it an array? Does it have the right properties? Do not trust what comes out of localStorage.

6. **Self-heal on bad data.** If the cache is corrupt or the wrong shape, delete the bad entry and fall back to fetching:

   ```js
   function loadCache(key) {
     try {
       const raw = localStorage.getItem(key);
       if (!raw) return null;
       const parsed = JSON.parse(raw);
       if (!Array.isArray(parsed)) {
         localStorage.removeItem(key);
         return null;
       }
       return parsed;
     } catch {
       localStorage.removeItem(key);
       return null;
     }
   }
   ```

7. **Test in DevTools:**
   - First load fetches (Network tab shows the request)
   - Refresh loads from cache (no network request)
   - Clear localStorage in DevTools, refresh — fetches again
   - Toggle offline mode in DevTools — app still works with cached data

8. **Run lint and fix.** Log errors in `docs/error-log.md`.

---

## Part 4 — Deploy and reflect

1. **Set environment variables** (if your API requires a key). In the Netlify UI: Site settings → Environment variables. Add the same key you used in `.env`.

2. **Deploy:**

   ```bash
   netlify deploy --prod
   ```

3. **Test the deployed site.** Verify data renders, error states work, and cache works. Test with a bad endpoint or offline mode to confirm error messages display.

4. **Fill out `docs/my-code-map-v2-additions.md`.** Document your new files (serverless function, `.env`) and the changed data flow.

5. **Complete `docs/reflections/week-4-reflection.md`.**

6. **Run final lint and build:**

   ```bash
   npm run lint
   npm run build
   ```

7. **Push to GitHub.** Confirm the Actions lint check passes.

---

## What to submit

- Your live Netlify URL
- Your GitHub repo URL
- A 2-3 sentence answer on Canvas: What is the enforcement ladder, and which layer changed your coding habits the most this week?
