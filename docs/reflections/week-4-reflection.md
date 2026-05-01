# Week 4 reflection

Answer each question thoughtfully. There are no wrong answers — the goal is to reflect on what you learned and how your understanding changed.

---

## 1. The enforcement ladder

What did the new linter (ESLint 9 + unicorn plugin) catch that your AGENTS.md rules alone didn't prevent? On the flip side, what kinds of things can AGENTS.md catch that a linter can't check for?

---

## 2. Hooks across contexts

You've now seen hooks in five places: browser events, Git pre-commit, npm lifecycle scripts, GitHub Actions, and serverless functions. What is the common pattern across all of them?

---

## 3. Which enforcement layer changed your habits

Advisory (AGENTS.md), linting (ESLint + unicorn), or blocking (pre-commit hook) — which one changed how you write code the most this week? Why?

---

## 4. The data swap

What surprised you about working with a real API compared to your static `data.js`? Think about things like response shape, timing, missing fields, or error cases.

---

## 5. The transform challenge

What was the hardest part of mapping the API response to the shape your views expect? How did you solve it?

---

## 6. New API fields

What new field(s) did you add from the API? How did they improve your app compared to the static version?

---

## 7. Error handling philosophy

You used try/catch in four different contexts this week: the serverless function, fetch in app.js, the localStorage wrapper, and the npm lint guard. What is the common pattern across all of them? What changes between contexts?
