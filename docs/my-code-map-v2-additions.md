# My code map — v2 additions

These sections were added in Week 4. Your Week 3 entries above are still valid.

---

## Serverless functions

### api.mjs
- File path: `netlify/functions/api.mjs`
- What does this function do? `Handles fetching breed data from API and transforming it to match the shape expected by views and filters.`
- What external API does it call? `TheDogAPI`
- What HTTP method does your function use to call the API? `GET`

- What shape does the response have? (list the top-level properties)
    - id: string
    - name: string
    - image: string
    - imageAlt: string
    - temperament: string[]
    - lifeSpan: [number, number] or [null, null]
    - size: string
    - breedGroup: string
    - origin: string
    - description: string

### image.mjs
- File path: `netlify/functions/image.mjs`
- What does this function do? `Handles fetching image by breedId.`
- What external API does it call? `TheDogAPI`
- What HTTP method does your function use to call the API? `GET`

- What shape does the response have? (list the top-level properties)
    - id: string
    - url: string
    - width: number
    - height: number
    - breeds: []
    - categories: []
---

## Environment variables

- Do you have a `.env` file in your project root? `Yes`
- What variable(s) are defined in it?
  -DOG_API_KEY

- Are these same variables set in the Netlify UI (Site settings > Environment variables)? `Yes`
- Is `.env` listed in your `.gitignore`? `Yes`

---

## Data flow

How does your app get its data now compared to Week 3?

- Before (Week 3): `import { breeds } from './breeds.js'`
- Now (Week 4): `fetch('/.netlify/functions/api')` `fetch('/.netlify/functions/image?breedId=${item.id}')`
- Did you keep `breeds.js` as a fallback if the fetch fails? `No, since they're not all dogs, but kept the dataset for future backup use`
- Where does the fetch happen? (file and function name): `app.js fetchBreeds(), fetchImg()` fetchBreeds is called in `app.js loadBreedsFromCacheOrFetch()` and fetchImg is called in `views.js showResults()`

---

## New fields from API

In Part 3A you added field(s) from the live API that your static data did not have.

- What new field(s) did you add?
  - breedGroup
  - origin
  - description

- Where do they appear in your card? (what element shows them?): `showDetail(), detailList`
- Did you add any CSS for the new field(s)? `No`

---

## localStorage cache

- What key do you pass to `localStorage.setItem()`? `key 'dogBreedsCache' or 'breedImage_${item.id}' depending on the data being cached`
- What shape is the cached data? (array of objects, single object, etc.): `data shape depends on what type of data is being cached, breeds: array of objects, image: single image URL, noPhotoBreeds: array of breed IDs`
- Where is your `loadCache` function? (file and function name): `app.js loadCache()`
- Where is your `saveCache` function? (file and function name): `app.js saveCache()`
- When does your app use the cache instead of fetching? `Rendering results with breed data and images that have already been fetched and cached`
