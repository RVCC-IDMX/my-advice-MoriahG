# Build Prompt: "What Pet Should I Get?" Recommendation Site

## 1. Project Goal

Build a single-page, interactive web application that helps users find pet recommendations based on a wide range of detailed preferences. The site will be visually playful, modern, and highly responsive, providing a seamless user experience from filtering to results.

---

## 2. Core Feature: Dynamic Filtering

The application will feature a dynamic filtering system that allows users to search for pets based on a variety of criteria. The results should update instantly on the page without requiring a page reload.

- **UI:** Single-page application.
- **Layout:** A horizontal filter bar at the top of the page.
  - The bar will contain the primary filters: `Class`, `Species`, and `Breed`.
  - A "More Filters" button will reveal a drawer containing all other detailed filter options.
- **Results Display:**
  - The results will be displayed in a section below the filter bar.
  - Users must be able to toggle between a **Card Grid View** (default) and a **Detailed List View**.
  - The user's view preference should be remembered during their session.

---

## 3. Data Architecture: Relational Model

The application will use a relational data model with three separate data sources (which can be implemented as JavaScript arrays of objects).

### 3.1. `classes.js`

A simple array listing the major biological classes.

- **Example:**

  ```javascript
  const classes = [
    { id: 'c1', name: 'Mammal' },
    { id: 'c2', name: 'Bird' },
    { id: 'c3', name: 'Reptile' },
    // ...etc
  ];
  ```

### 3.2. `species.js`

An array of animal species, linked to a class by `classId`. This level also contains "average" or "general" properties for that species to enable a broader search.

- **Structure:** Each object must have the full data structure defined in section 4.
- **Example:**

  ```javascript
  const species = [
    {
      id: 's1',
      name: 'Dog',
      classId: 'c1',
      lifeSpan: [8, 15], // General range for the species
      // ... all other properties from section 4 with general/average values
    }
  ];
  ```

### 3.3. `breeds.js`

The most detailed level, containing specific breeds linked to a species by `speciesId`.

- **Structure:** Each object must have the full data structure defined in section 4.
- **Example:**

  ```javascript
  const breeds = [
    {
      id: 'b1',
      name: 'Golden Retriever',
      speciesId: 's1',
      lifeSpan: [10, 12], // Specific range for the breed
      // ... all other properties from section 4 with specific values
    }
  ];
  ```

---

## 4. Detailed Data Point Structure

The following structure must be used for every object in both the `species` and `breeds` arrays to ensure consistency for the search algorithm.

```javascript
{
  // --- Core Identifiers ---
  id: 'unique-id', // e.g., 'b1', 's1'
  name: 'String',
  speciesId: 'String', // (for breeds)
  classId: 'String',   // (for species)

  // --- Lifespan ---
  lifeSpan: [min_years, max_years], // e.g., [10, 12]

  // --- Costs ---
  cost: {
    initial: [min_cost, max_cost], // e.g., [500, 2000]
    monthly: [min_cost, max_cost]  // e.g., [80, 150]
  },

  // --- Habitat & Environment ---
  habitat: {
    housing: ['apartment', 'houseWithYard', 'farm/rural'], // Array of suitable options
    space: 'small' | 'medium' | 'large',
    climate: ['cold', 'temperate', 'warm', 'hot'] // Array of tolerable climates
  },

  // --- Care & Needs ---
  care: {
    social: 'solitary' | 'independent' | 'social' | 'highlySocial',
    grooming: 'none' | 'low' | 'moderate' | 'high',
    exercise: 'low' | 'moderate' | 'high' | 'veryHigh',
    training: 'easy' | 'moderate' | 'difficult'
  },

  // --- Temperament & Social ---
  temperament: ['friendly', 'calm', 'vocal'], // Array of personality traits
  goodWithChildren: true | false,
  goodWithOtherPets: true | false
}
```

---

## 5. Search & Filtering Logic

Implement a **two-pass search algorithm**:

1. **Pass 1 (Breed Search):** Filter the `breeds` array based on the user's exact criteria.
    - If one or more breeds match, display these results.
2. **Pass 2 (Species Search):** This pass **only runs if Pass 1 returns zero results**.
    - Filter the `species` array using the same user criteria.
    - When filtering, treat any property with the value `"varied"` as a wildcard that always matches that criterion.
    - If one or more species match, display these as "General Suggestions".
    - If no results are found in either pass, display a "No matches found" message.

---

## 6. Visual Style Guide: "Playful & Whimsical"

### Typography (from Google Fonts)

- **Headings:** `Nunito`, bold weight (700).
- **Body/Paragraphs:** `Lato`.

### Color Palette

- **Primary:** Soft Lime (`#a9e64c`). Must be used with Dark Charcoal text for accessibility.
- **Secondary:** Light Blue (`#E0F2FE`).
- **Accent:** Sunny Yellow (`#FACC15`).
- **Background:** Off-White (`#F8F9FA`).
- **Text:** Dark Charcoal (`#343A40`).

### UI Elements

- **Border Radius:** Apply a generous border-radius (e.g., `8px` to `12px`) to all buttons, inputs, and cards for a soft, rounded look.
- **Icons:** Use the [Feather Icons](https://feathericons.com/) library for UI icons.
- **Imagery:** Use high-quality, bright photos for pet results.
