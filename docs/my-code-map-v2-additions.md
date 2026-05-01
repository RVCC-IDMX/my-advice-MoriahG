# My code map — v2 additions

These sections were added in Week 4. Your Week 3 entries above are still valid.

---

## Serverless function

- File path: `___________` (hint: `netlify/functions/___________`)
- What does this function do? `___________`
- What external API does it call? `___________`
- What HTTP method does your function use to call the API? `___________`

- What shape does the response have? (list the top-level properties)
  -
  -
  -

---

## Environment variables

- Do you have a `.env` file in your project root? `___________`
- What variable(s) are defined in it?
  -

- Are these same variables set in the Netlify UI (Site settings > Environment variables)? `___________`
- Is `.env` listed in your `.gitignore`? `___________`

---

## Data flow

How does your app get its data now compared to Week 3?

- Before (Week 3): `import { ___________ } from './data.js'`
- Now (Week 4): `fetch('___________')`
- Did you keep `data.js` as a fallback if the fetch fails? `___________`
- Where does the fetch happen? (file and function name): `___________`

---

## New fields from API

In Part 3A you added field(s) from the live API that your static data did not have.

- What new field(s) did you add?
  -

- Where do they appear in your card? (what element shows them?): `___________`
- Did you add any CSS for the new field(s)? `___________`

---

## localStorage cache

- What key do you pass to `localStorage.setItem()`? `'___________'`
- What shape is the cached data? (array of objects, single object, etc.): `___________`
- Where is your `loadCache` function? (file and function name): `___________`
- Where is your `saveCache` function? (file and function name): `___________`
- When does your app use the cache instead of fetching? `___________`
