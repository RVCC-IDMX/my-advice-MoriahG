# Arrow functions

You will see two ways to write functions in JavaScript. Both work. This tutorial explains the difference so you can read either form confidently.

---

## Traditional function declaration

This is what you have been writing:

```js
function renderAdvice(items) {
  // function body
}
```

A function declaration has a name, a parameter list, and a body. You can call it anywhere in the file — JavaScript hoists it to the top.

---

## Arrow function expression

An arrow function is shorter syntax that you assign to a variable:

```js
const renderAdvice = (items) => {
  // function body
};
```

Key differences:

- Uses `=>` instead of the `function` keyword
- Must be assigned to a variable (`const`, `let`)
- Cannot be called before the line where it is defined (no hoisting)

---

## When you will see each form

**Function declarations** are common for standalone, named functions:

```js
function showResults(items) {
  // build and display results
}

function showDetail(item) {
  // build and display one item
}
```

**Arrow functions** are common as callbacks — functions you pass into another function:

```js
form.addEventListener("submit", (event) => {
  event.preventDefault();
  // handle the form
});

items.forEach((item) => {
  // do something with each item
});
```

Your AI agent will use both forms freely. Neither is wrong — they serve different roles in practice.

---

## Implicit return

When an arrow function has a single expression, you can skip the curly braces and the `return` keyword:

```js
// Full form
const double = (n) => {
  return n * 2;
};

// Implicit return — same result
const double = (n) => n * 2;
```

You will see implicit returns in short callbacks like `.filter()` and `.map()`. For longer functions, use curly braces and an explicit `return`.

---

## One thing to know about `this`

Arrow functions do not have their own `this`. They inherit `this` from the surrounding code. You do not need to understand this deeply right now — just know that if you see advice about "arrow functions and `this`," it is referring to this behavior.

For event listeners and DOM work in this course, it rarely matters. Use whichever form reads clearly.

---

## Quick reference

| Feature         | Function declaration | Arrow function          |
| --------------- | -------------------- | ----------------------- |
| Syntax          | `function name() {}` | `const name = () => {}` |
| Hoisted         | Yes                  | No                      |
| Common use      | Standalone functions | Callbacks               |
| Has own `this`  | Yes                  | No                      |
| Implicit return | No                   | Yes (single expression) |
