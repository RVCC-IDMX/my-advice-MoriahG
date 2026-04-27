# Event listeners 101

An event is something that happens in the browser — a click, a form submission, a key press. An event listener is JavaScript code that says: "When this event happens on this element, run this function."

This tutorial covers the patterns you need for Week 3. The [HAP Events lab](https://hap-events.netlify.app) goes deeper on each concept — station references are included so you can read more when you want to.

---

## The three-part pattern

Every event listener has three parts:

```js
element.addEventListener("click", handleClick);
//  1. target          2. event type   3. callback
```

1. **Target** — the element you are listening on (found with `querySelector`)
2. **Event type** — a string like `"click"`, `"submit"`, or `"input"`
3. **Callback** — the function that runs when the event fires

The browser does not run your callback immediately. It stores a reference and calls it later, when the event happens. See `docs/tutorials/callbacks-explained.md` for more on how this works.

> HAP Events lab: [Station 1 — Listening](https://hap-events.netlify.app/stations/station-1/)

---

## The event object

When your callback runs, the browser passes it an **event object** with details about what happened:

```js
function handleClick(event) {
  console.log(event.type); // "click"
  console.log(event.target); // the element that was clicked
}
```

The two properties you will use most:

- **`event.target`** — the actual element the user interacted with. If they clicked a `<span>` inside a card, `event.target` is the span.
- **`event.type`** — the name of the event (e.g., `"click"`, `"submit"`)

`event.target` is how you figure out _what_ was clicked when you have one listener on a parent element (delegation — see below).

> HAP Events lab: [Station 2 — What Just Happened?](https://hap-events.netlify.app/stations/station-2/)

---

## preventDefault

Some elements have default browser behavior. Forms reload the page when submitted. Links navigate to a new URL. If you want to handle the event with JavaScript instead, call `preventDefault()`:

```js
function handleFormSubmit(event) {
  event.preventDefault();
  // the page does NOT reload — you handle it here
  const mood = document.querySelector("#mood-select").value;
  // get results, show them
}

form.addEventListener("submit", handleFormSubmit);
```

Your app already has a form submit handler from Week 1. This is what `preventDefault` does there — it stops the browser from reloading the page so your JavaScript can display results instead.

**Common mistake:** Putting the listener on the button instead of the form. If a user presses Enter in a form field, the form fires a `submit` event but the button does not fire a `click`. Always listen for `submit` on the `<form>` element.

> HAP Events lab: [Station 3 — Swapping Views](https://hap-events.netlify.app/stations/station-3/)

---

## Event delegation

Imagine you have 8 advice cards and you want something to happen when any card is clicked. You could add a listener to each card:

```js
// This works, but does not scale
const cards = document.querySelectorAll(".advice-card");
cards.forEach((card) => {
  card.addEventListener("click", handleCardClick);
});
```

The problem: if you add new cards later (after a new search), the new cards do not have listeners. You would need to re-run this code every time.

**Delegation** solves this. Instead of listening on each card, listen on the parent container:

```js
const output = document.querySelector("#advice-output");
output.addEventListener("click", handleCardClick);
```

Every click inside the container bubbles up to it. Your callback receives the event, and you use `event.target` to figure out which card was clicked.

### The .closest() pattern

When the user clicks inside a card, `event.target` might be the `<p>` or `<span>` inside the card, not the card itself. Use `.closest()` to find the nearest ancestor that matches a selector:

```js
function handleCardClick(event) {
  const card = event.target.closest(".advice-card");
  if (!card) return; // click was not on a card

  // card is the .advice-card element — do something with it
}
```

`.closest()` walks up the DOM tree from `event.target` until it finds an element matching the selector. If nothing matches, it returns `null` — that is why you check for it.

This is the recommended pattern for Week 3: one listener on the results container, `.closest()` to identify the card.

> HAP Events lab: [Station 4 — Bubbling Up](https://hap-events.netlify.app/stations/station-4/)

---

## DOMContentLoaded

If your script tag is in the `<head>` (without `defer`), the script runs before the HTML is fully parsed. Any `querySelector` call will return `null` because the elements do not exist yet.

The fix is to wait for the DOM to be ready:

```js
document.addEventListener("DOMContentLoaded", () => {
  // safe to querySelector here — all elements exist
  const form = document.querySelector("#advice-form");
  form.addEventListener("submit", handleFormSubmit);
});
```

Your project uses `<script type="module">`, which is automatically deferred — so you may not need `DOMContentLoaded`. But if you ever move your script to the `<head>` or see `null` errors on page load, this is the fix.

> HAP Events lab: [Station 5 — Putting It Together](https://hap-events.netlify.app/stations/station-5/)

---

## Putting it together

Here is how these patterns combine for Week 3:

```js
// Find your elements first
const form = document.querySelector("#advice-form");
const output = document.querySelector("#advice-output");
const detailContainer = document.querySelector("#advice-detail");

// Named callback for form submission
function handleFormSubmit(event) {
  event.preventDefault();
  const mood = document.querySelector("#mood-select").value;
  const results = getAdviceByMood(mood);
  showResults(results, output);
}

// Named callback for card clicks (delegation)
function handleCardClick(event) {
  const card = event.target.closest(".advice-card");
  if (!card) return;
  // find the item data, then show detail view
  showDetail(item, detailContainer);
}

// Named callback for back button
function handleBackClick() {
  showResults(lastResults, output);
}

// Wire everything up
form.addEventListener("submit", handleFormSubmit);
output.addEventListener("click", handleCardClick);
detailContainer.addEventListener("click", handleBackClick);
```

Three listeners, three named callbacks, clear intent. This is the pattern the HAP Events lab builds toward in Station 5.

---

## Quick reference

| Concept                      | What it does                             | When to use                                            |
| ---------------------------- | ---------------------------------------- | ------------------------------------------------------ |
| `addEventListener(type, fn)` | Registers a callback for an event        | Always — this is how you listen                        |
| `event.target`               | The element the event happened on        | Identifying what was clicked                           |
| `event.preventDefault()`     | Stops default browser behavior           | Forms (prevent reload), links (prevent navigation)     |
| `.closest(selector)`         | Finds nearest ancestor matching selector | Delegation — finding the card when a child was clicked |
| `DOMContentLoaded`           | Fires when HTML is fully parsed          | Scripts in `<head>` without defer                      |
