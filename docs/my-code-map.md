# My code map

Fill out each section below by reading your actual code. Do not guess — open each file and look. This map is your reference for the rest of the assignment. When instructions say "your results container" or "your card class," they mean what you write here.

---

## Files and their purposes

For each file, write one sentence about what it does.

| File                    | What it does |
| ----------------------- | ------------ |
| `src/js/app.js`         | finds and creates elements to handle user interactions and filters |
| `src/js/filters.js`    | filters pets based on given filters |
| `src/js/breeds.js`        | defines breed dataset for pets |
| `src/js/species.js`        | defines species dataset for pets |
| `src/js/classes.js`        | defines classes dataset for pets |
| `src/css/style.css`     | styles the entire page |
| `index.html`            | contains base HTML for the page not including filter options, selected filters, and pet cards |

---

## Form

Look at your `index.html` and find the form element.

- Form ID: `#filterForm`
- Select element ID: `#classSelect`
- Select element ID: `#speciesSelect`
- Select element ID: `#breedSelect`

- What moods/options are in the select?

  - Any
  - Each select populates the rest of their options in app.js based on their respective dataset

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

| Where in the code | Event type | What it does |
| ----------------- | ---------- | ------------ |
| checkbox input in `populateMoreFilters` — line 331 | change | Updates the filter group summary text when drawer checkboxes are selected/deselected |
| `moreFiltersBtn` — line 360 | click | Toggles the more filters drawer open/closed and updates aria state |
| `classSelect` — line 367 | change | Filters species options by the selected class and resets breed selection |
| `speciesSelect` — line 373 | change | Filters breed options by the selected species |
| `gridViewBtn` — line 388 | click | Switches results to grid view, saves view mode, and rerenders results |
| `listViewBtn` — line 395 | click | Switches results to list view, saves view mode, and rerenders results |
| remove button on filter pills — line 493 | click | Removes the filter pill from UI and updates the results |
| `filterForm` — line 721 | change | Updates pills, highlights, and results when filters change in the form |
| `moreFiltersDrawer` — line 722 | change | Updates pills, highlights, and results when filters change in the drawer |

If you do not see any `addEventListener` calls, write "none found" — and then look again, because the form handler uses one.

---

## Data shape

Open `src/js/data.js` and look at one item in your dataset.

`src/js/classes.js`
- How many items total? `5`

- Properties on each item

  - id
  - name
  - size

`src/js/species.js`
- How many items total? `7`

- Properties on each item

  - id
  - name
  - classId
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

`src/js/breeds.js`
- How many items total? `5`

- Properties on each item

  - same as species but speciesId replaces classId

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
