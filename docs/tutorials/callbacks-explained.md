# Callbacks explained

A callback is a function you hand to another function. You are saying: "Here — run this when the time is right." The function that receives it decides when to call it.

You have already used callbacks without knowing it. This tutorial names the pattern and shows you how to use it intentionally.

---

## Passing vs. calling

This is the most common mistake with callbacks. Look at the difference:

```js
// Calling the function — runs immediately, returns a value
handleClick();

// Passing the function — hands it over, does NOT run it
handleClick;
```

When you pass a function to `addEventListener`, you pass it **without parentheses**:

```js
// Correct — passes the function, browser calls it later
button.addEventListener("click", handleClick);

// Wrong — calls handleClick NOW, passes whatever it returns
button.addEventListener("click", handleClick());
```

This is what the HAP Events lab calls "the parentheses trap" (Station 1). If your event listener fires immediately when the page loads instead of when you click, check for accidental parentheses.

---

## Named callbacks

A named callback is a function you define separately and then pass by name:

```js
function handleFormSubmit(event) {
  event.preventDefault();
  const mood = document.querySelector("#mood-select").value;
  // get and display results
}

form.addEventListener("submit", handleFormSubmit);
```

Compare this to an anonymous inline callback:

```js
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const mood = document.querySelector("#mood-select").value;
  // get and display results
});
```

Both work. But named callbacks have advantages:

- **Readable** — the addEventListener line reads like a table of contents: "on submit, handle form submit"
- **Reusable** — you can use the same function in multiple places
- **Debuggable** — the function name appears in error messages and stack traces

For this assignment, define your event handler functions separately and pass them by name.

---

## How addEventListener uses your callback

When you write:

```js
container.addEventListener("click", handleCardClick);
```

Three things happen:

1. The browser stores a reference to `handleCardClick`
2. The browser watches `container` for click events
3. When a click happens, the browser calls `handleCardClick(event)` — passing an event object with details about what was clicked

You do not call the function yourself. The browser does, when the event fires. That is why it is a callback — the browser "calls back" to your function.

---

## Callbacks beyond addEventListener

You have seen callbacks before, even if you did not use the word:

```js
// forEach takes a callback
items.forEach((item) => {
  console.log(item.text);
});

// filter takes a callback
const results = items.filter((item) => item.mood === "stressed");
```

In each case, you hand a function to another function. `forEach` calls your function once per item. `filter` calls it once per item and keeps the ones where it returns `true`.

The pattern is always the same: you write the function, something else decides when to run it.

---

## Quick reference

| Concept              | Example                                        | What happens              |
| -------------------- | ---------------------------------------------- | ------------------------- |
| Calling a function   | `handleClick()`                                | Runs immediately          |
| Passing a function   | `handleClick`                                  | Hands it over, runs later |
| Named callback       | `btn.addEventListener("click", handleClick)`   | Readable, reusable        |
| Anonymous callback   | `btn.addEventListener("click", () => { ... })` | Inline, harder to reuse   |
| The parentheses trap | `btn.addEventListener("click", handleClick())` | Bug — runs immediately    |
