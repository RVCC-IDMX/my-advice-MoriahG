# Common events reference

A quick reference for the event types you will encounter. Events marked with **used this week** are the ones you need for the Week 3 assignment.

---

## Mouse events

### click — **used this week**

Fires when the user clicks an element.

```js
card.addEventListener("click", handleCardClick);
```

Use for: card navigation, buttons, any clickable element.

### dblclick

Fires on a double-click. Rarely needed — most interactions use single click.

---

## Form events

### submit — **used this week**

Fires when a form is submitted (button click or Enter key). Always listen on the `<form>` element, not the button.

```js
form.addEventListener("submit", handleFormSubmit);
```

Almost always paired with `event.preventDefault()` to stop the page from reloading.

### input

Fires every time the value of an `<input>`, `<textarea>`, or `<select>` changes. Fires on every keystroke or selection change — not just when the user is done.

```js
searchInput.addEventListener("input", handleSearch);
```

Use for: live search, character counters, real-time validation.

### change

Fires when an `<input>`, `<textarea>`, or `<select>` value changes **and the element loses focus**. For checkboxes and radio buttons, fires immediately on change.

```js
selectElement.addEventListener("change", handleSelection);
```

Use for: dropdown selections, checkbox toggles. Less immediate than `input`.

---

## Keyboard events

### keydown

Fires when a key is pressed down. Fires repeatedly if the key is held.

```js
document.addEventListener("keydown", handleKeyPress);
```

Use for: keyboard shortcuts, Escape to close a modal. Check `event.key` for which key was pressed (e.g., `"Escape"`, `"Enter"`, `"ArrowDown"`).

---

## Focus events

### focus

Fires when an element receives focus (user clicks or tabs into it).

### blur

Fires when an element loses focus (user clicks or tabs away).

```js
input.addEventListener("focus", handleFocus);
input.addEventListener("blur", handleBlur);
```

Use for: showing help text when a field is selected, validation when a field is left.

---

## Document events

### DOMContentLoaded

Fires once when the HTML is fully parsed and the DOM tree is ready. Does not wait for images or stylesheets.

```js
document.addEventListener("DOMContentLoaded", initApp);
```

Use for: running setup code when the page loads. Not needed if your script tag has `type="module"` or `defer` — those scripts already wait for the DOM.

---

## Quick reference

| Event              | Fires when                            | Common target                   | This week? |
| ------------------ | ------------------------------------- | ------------------------------- | ---------- |
| `click`            | User clicks                           | Any element                     | Yes        |
| `dblclick`         | User double-clicks                    | Any element                     | No         |
| `submit`           | Form is submitted                     | `<form>`                        | Yes        |
| `input`            | Value changes (every keystroke)       | `<input>`, `<select>`           | No         |
| `change`           | Value changes and element loses focus | `<input>`, `<select>`           | No         |
| `keydown`          | Key is pressed                        | `document` or focusable element | No         |
| `focus`            | Element receives focus                | Focusable elements              | No         |
| `blur`             | Element loses focus                   | Focusable elements              | No         |
| `DOMContentLoaded` | DOM is ready                          | `document`                      | Maybe      |
