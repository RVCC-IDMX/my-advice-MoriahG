# ESLint unicorn rules guide

Your project uses `eslint-plugin-unicorn` to enforce modern JavaScript patterns. This guide covers every unicorn rule in your config.

- **Tier 1 (error)** — blocks commits. You must fix these before your code can be merged.
- **Tier 2 (warn)** — nudges you toward better patterns. Fix these when you can.

Most rules auto-fix with `npx eslint --fix`. The entries below tell you which ones do.

---

## Tier 1 — error (blocks commits)

### unicorn/prefer-query-selector

Use `querySelector` / `querySelectorAll` instead of `getElementById` or `getElementsByClassName`. Auto-fixes: yes.

```js
/* old — flagged */
document.getElementById("app");

/* modern */
document.querySelector("#app");
```

### unicorn/prefer-dom-node-append

Use `.append()` instead of `.appendChild()`. The modern method accepts multiple nodes and strings. Auto-fixes: yes.

```js
/* old — flagged */
parent.appendChild(child);

/* modern */
parent.append(child);
```

### unicorn/prefer-dom-node-remove

Use `.remove()` instead of `parentNode.removeChild()`. Auto-fixes: yes.

```js
/* old — flagged */
element.parentNode.removeChild(element);

/* modern */
element.remove();
```

### unicorn/prefer-dom-node-text-content

Use `.textContent` instead of `.innerText`. `textContent` is faster and does not trigger a reflow. Auto-fixes: yes.

```js
/* old — flagged */
element.innerText = "hello";

/* modern */
element.textContent = "hello";
```

### unicorn/prefer-add-event-listener

Use `addEventListener` instead of assigning to `onclick` or other `on*` properties. Auto-fixes: no.

```js
/* old — flagged */
button.onclick = handleClick;

/* modern */
button.addEventListener("click", handleClick);
```

### unicorn/prefer-modern-dom-apis

Use `.before()`, `.after()`, `.replaceWith()` instead of `insertBefore` or `replaceChild`. Auto-fixes: yes.

```js
/* old — flagged */
parent.insertBefore(newNode, referenceNode);

/* modern */
referenceNode.before(newNode);
```

### unicorn/prefer-template

Use template literals instead of string concatenation. Auto-fixes: yes.

```js
/* old — flagged */
const msg = "Hello, " + name + "!";

/* modern */
const msg = `Hello, ${name}!`;
```

### unicorn/prefer-includes

Use `.includes()` instead of `.indexOf() !== -1`. Auto-fixes: yes.

```js
/* old — flagged */
if (arr.indexOf(item) !== -1) {
}

/* modern */
if (arr.includes(item)) {
}
```

### unicorn/no-array-for-each

Use `for...of` instead of `.forEach()`. Auto-fixes: yes (in most cases).

```js
/* old — flagged */
items.forEach((item) => console.log(item));

/* modern */
for (const item of items) {
  console.log(item);
}
```

### unicorn/prefer-keyboard-event-key

Use `event.key` instead of `event.keyCode` or `event.which`. The `.key` property returns a readable string like `'Enter'`. Auto-fixes: yes.

```js
/* old — flagged */
if (event.keyCode === 13) {
}

/* modern */
if (event.key === "Enter") {
}
```

### unicorn/no-for-loop

Use `for...of` instead of C-style `for (let i = 0; ...)` loops when you are iterating over an array. Auto-fixes: yes.

```js
/* old — flagged */
for (let i = 0; i < items.length; i++) {
  console.log(items[i]);
}

/* modern */
for (const item of items) {
  console.log(item);
}
```

### unicorn/no-nested-ternary

Do not nest ternary (`? :`) expressions. They are hard to read. Use `if`/`else` instead. Auto-fixes: no.

```js
/* old — flagged */
const label = a ? (b ? "x" : "y") : "z";

/* modern */
let label;
if (a && b) {
  label = "x";
} else if (a) {
  label = "y";
} else {
  label = "z";
}
```

### unicorn/filename-case

All filenames must use kebab-case (lowercase words separated by hyphens). Auto-fixes: no (you must rename the file yourself).

```text
/* old — flagged */
myComponent.js
MyComponent.js

/* modern */
my-component.js
```

---

## Tier 2 — warn (nudges)

### unicorn/prefer-classlist-toggle

Use `classList.toggle()` instead of manually adding and removing classes with an `if`/`else`. Auto-fixes: no.

```js
/* old — flagged */
if (isOpen) {
  el.classList.add("open");
} else {
  el.classList.remove("open");
}

/* modern */
el.classList.toggle("open", isOpen);
```

### unicorn/prefer-dom-node-dataset

Use `.dataset` to read and write `data-*` attributes instead of `getAttribute` / `setAttribute`. Auto-fixes: yes.

```js
/* old — flagged */
el.getAttribute("data-id");

/* modern */
el.dataset.id;
```

### unicorn/prefer-string-slice

Use `.slice()` instead of `.substring()` or `.substr()`. `.slice()` has consistent behavior with negative indices. Auto-fixes: yes.

```js
/* old — flagged */
name.substring(0, 3);

/* modern */
name.slice(0, 3);
```

### unicorn/prefer-string-starts-ends-with

Use `.startsWith()` / `.endsWith()` instead of regex or index checks. Auto-fixes: yes.

```js
/* old — flagged */
if (filename.indexOf(".js") === filename.length - 3) {
}

/* modern */
if (filename.endsWith(".js")) {
}
```

### unicorn/prefer-number-properties

Use `Number.isNaN()` and `Number.isFinite()` instead of the global `isNaN()` and `isFinite()`. The `Number` versions do not coerce their argument. Auto-fixes: yes.

```js
/* old — flagged */
if (isNaN(value)) {
}

/* modern */
if (Number.isNaN(value)) {
}
```

### unicorn/prefer-array-find

Use `.find()` instead of `.filter()[0]`. `.find()` stops as soon as it finds a match. Auto-fixes: yes.

```js
/* old — flagged */
const first = items.filter((x) => x.active)[0];

/* modern */
const first = items.find((x) => x.active);
```

### unicorn/catch-error-name

Name your `catch` parameter `error`, not `e`, `err`, or anything else. Consistent naming makes code easier to search. Auto-fixes: yes.

```js
/* old — flagged */
catch (e) { console.error(e); }

/* modern */
catch (error) { console.error(error); }
```

### unicorn/no-console-spaces

Do not put leading or trailing spaces inside `console.log()` arguments. Use commas to separate values instead. Auto-fixes: yes.

```js
/* old — flagged */
console.log("result: ", value);

/* modern */
console.log("result:", value);
```

### unicorn/throw-new-error

Always use `throw new Error()`, not `throw Error()`. The `new` keyword makes it clear you are creating an error object. Auto-fixes: yes.

```js
/* old — flagged */
throw Error("something broke");

/* modern */
throw new Error("something broke");
```

### unicorn/error-message

Always pass a message string to `new Error()`. An error without a message is hard to debug. Auto-fixes: no.

```js
/* old — flagged */
throw new Error();

/* modern */
throw new Error("Failed to load advice from API");
```
