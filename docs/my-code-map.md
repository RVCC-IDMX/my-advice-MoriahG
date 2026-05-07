# My code map

Fill out each section below by reading your actual code. Do not guess — open each file and look. This map is your reference for the rest of the assignment. When instructions say "your results container" or "your card class," they mean what you write here.

---

## Files and their purposes

For each file, write one sentence about what it does.

| File                    | What it does |
| ----------------------- | ------------ |
| `netlify/functions/api.mjs` | serverless function that handles fetching breed data and data transformation |
| `netlify/functions/image.mjs` | serverless function that handles fetching image by breedId |
| `src/js/app.js`         | imports views, wires events, fetches and caches API data |
| `src/js/views.js`       | builds and renders page with view functions |
| `src/js/filters.js`     | filters pets based on given filters and formats the results |
| `src/js/breeds.js`      | defines breed dataset for pets |
| `src/css/style.css`     | styles the entire page |
| `index.html`            | contains base HTML for the page not including filter options, selected filters, and pet cards |

---

## Form

Look at your `index.html` and find the form element.

- Form ID: `#filterForm`
- Select element ID: `#breedSelect`

- What moods/options are in the select?

  - Any
  - Breed select populates with breeds API data

---

## Results container

Where do results appear on the page?

- Container ID or class: `#resultsSection`
- What element type is it? (`div`, `section`, etc.): `section`

---

## Card structure

Look at how your app.js builds each result card. What elements make up one card?

- Card element type: `article`
- Card class name: `pet-card`

- What is inside each card? (list the child elements and what data they show)
  - img: pet image
  - info: pet info
    - titleRow: pet name and species subtitle
      - name: pet name
      - subtitle: pet species name if pet name is a breed
    - details: pet details
      - row: pet detail label and value
      - labelSpan: pet detail label (e.g. "Lifespan")
      - valueSpan: pet detail value (e.g. "10-12 years")

---

## Existing event listeners

Look through your app.js for any `addEventListener` calls. List each one.

| Line # | Element | Event type | What it's handler does |
| ---- | ------- | ---------- | ----------------------- |
| 103 | `document` | `DOMContentLoaded` | Waits for the DOM to finish loading before querying elements and wiring all handlers |
| 208 | `#moreFiltersBtn` | `click` | Toggles the More Filters drawer open and closed |
| 218 | `#gridViewBtn` | `click` | Switches results to grid view, updates the toggle, and rerenders results |
| 228 | `#listViewBtn` | `click` | Switches results to list view, updates the toggle, and rerenders results |
| 281 | `#filterForm` | `submit` | Renders the filtered results |
| 302 | `#filterForm` | `change` | Updates drawer summaries, active filters, and highlights when filters change |
| 303 | `#moreFiltersDrawer` | `change` | Updates drawer summaries, active filters, and highlights when drawer filters change |
| 315 | `#activeFilters` | `click` | Removes an active filter when a filter pill button is clicked |
| 350 | `#resultsSection` | `click` | Handles load-more, back-button, and pet-card clicks inside the results area |

If you do not see any `addEventListener` calls, write "none found" — and then look again, because the form handler uses one.

---

## Data shape

Backup hardcoded breed dataset
`src/js/breeds.js`
- How many items total? `5`

- Properties on each item

  - id
  - name
  - speciesId
  - lifeSpan
  - size
  - cost
  - habitat: {
      housing
      space
      climate
    },
  - care: {
      social
      grooming
      exercise
      training
    },
  - temperament
  - goodWithChildren
  - goodWithOtherPets
  - image
  - imageAlt


---

## CSS classes for show/hide

Do you have a `.hidden` class or similar in your CSS? If so, what does it do?
  
1.
  - Class name: `.hidden`
  - What CSS rule does it apply? `display: none;` for experiment 
2.
  - Class + attribute name: `.drawer[aria-hidden='false']`
  - What CSS rule does it apply? `formats the more filters drawer when it is open`

If you do not have one, you will create one this week.
