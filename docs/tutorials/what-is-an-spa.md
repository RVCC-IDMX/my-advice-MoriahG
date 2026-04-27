# What is an SPA?

SPA stands for **single-page application**. It means your entire site lives in one HTML file. Instead of navigating to different pages, JavaScript shows and hides different sections of the page.

Your My Advice site is already an SPA — one `index.html`, one form, one results area. This week you will make it feel like it has multiple pages by adding view functions that swap what the user sees.

---

## The room analogy

Think of your page as a room with furniture covered by sheets. Everything is already there — the form, the results, the detail view. When the user does something (submits the form, clicks a card), you pull a sheet off one piece of furniture and cover another.

You are not building new rooms. You are rearranging the one room you have.

This is the analogy from the HAP Events lab (Station 3): "You're not navigating to a new page. You're rearranging the room."

---

## Why not multiple HTML files?

You might think: "Why not make a `detail.html` for the detail view?" Three reasons:

1. **State is lost.** When the browser loads a new HTML file, all your JavaScript variables disappear. The advice results, the selected mood, the scroll position — gone. You would need to pass everything through the URL or localStorage.

2. **Slower.** Loading a new page means another network request, another parse, another render. Swapping a section with JavaScript is instant.

3. **Simpler.** One file means one set of styles, one set of scripts, one deployment. No routing, no URL management, no syncing state between pages.

For a small app like My Advice, a single HTML file with view swapping is the right architecture.

---

## The .hidden class pattern

The simplest way to swap views is with a CSS class:

```css
.hidden {
  display: none;
}
```

To hide a section:

```js
resultsSection.classList.add("hidden");
```

To show it:

```js
resultsSection.classList.remove("hidden");
```

This keeps your JavaScript focused on _what_ changes and your CSS focused on _how_ it looks — the same principle from the HAP DOM lab (Station 5, classList).

---

## View functions

A view function is a JavaScript function that sets up one "screen" of your app. It shows the right content and hides everything else.

Here is the pattern:

```js
function showResults(items, container) {
  // Show this view
  container.classList.remove("hidden");

  // Build the content
  container.textContent = "";
  for (const item of items) {
    // create card elements, append to container
  }
}

function showDetail(item, container) {
  // Show this view
  container.classList.remove("hidden");

  // Build the content
  container.textContent = "";
  // create detail elements, append to container
}
```

Notice that each function receives its container as an argument. This means the view functions do not need to know the specific IDs in your HTML — `app.js` passes the right container when it calls them.

Each view function follows three steps:

1. **Hide** everything that should not be visible
2. **Show** the section for this view
3. **Build** the content inside it

---

## How views.js fits into your project

Right now, your `app.js` does everything — it finds elements, builds cards, and handles events. This week you will extract the rendering into a separate file:

```text
src/js/
├── app.js          ← orchestrates: imports views, wires events
├── views.js        ← NEW: exports showResults(), showNoResults(), showDetail()
├── matching.js     ← pure logic: filters data by mood
└── data.js         ← the dataset
```

`views.js` exports view functions. `app.js` imports them and calls them in response to events. This separation makes both files easier to read and change.

---

## What you will build this week

By the end of Week 3, your app will have three views:

- **Results view** — the list of advice cards for a mood (what you have now)
- **No-results view** — a message when no advice matches
- **Detail view** — an expanded view of one advice item (NEW)

The user flow:

1. User selects a mood and submits the form → **results view** appears
2. User clicks a card → **detail view** appears with full information
3. User clicks a back button → **results view** reappears

All of this happens in the same `index.html`. No page reloads. No new HTML files.
