# Week 4 reflection

Answer each question thoughtfully. There are no wrong answers — the goal is to reflect on what you learned and how your understanding changed.

---

## 1. The enforcement ladder

**What did the new linter (ESLint 9 + unicorn plugin) catch that your AGENTS.md rules alone didn't prevent? On the flip side, what kinds of things can AGENTS.md catch that a linter can't check for?**

All of the lint errors that caught things that AGENTS.md rules didn't prevent were part of the older linter. AGENTS.md can catch issues beyond syntax and style causes caught by linters, such as the poor API fetching structures, inefficient caching patterns, and in general logic errors.

---

## 2. Hooks across contexts

**You've now seen hooks in five places: browser events, Git pre-commit, npm lifecycle scripts, GitHub Actions, and serverless functions. What is the common pattern across all of them?**

Each hook first has a system define a lifecycle point, then has code provided at that point, and the system calls the code provided at the right moment. 


---

## 3. Which enforcement layer changed your habits

**Advisory (AGENTS.md), linting (ESLint + unicorn), or blocking (pre-commit hook) — which one changed how you write code the most this week? Why?**

The advisory layer changed how I write code the most this week because my GitHub Copilot has seemingly become worse at following AGENTS.md, and with Copilots stricter rate limits, I had to use higher multiplier models and agent significantly less.

---

## 4. The data swap

**What surprised you about working with a real API compared to your static `data.js`? Think about things like response shape, timing, missing fields, or error cases.**

What suprised me was how much each API varies in how you have to fetch them and structure the data. I knew that it would vary, but was unaware of how complicated it could get.

---

## 5. The transform challenge

**What was the hardest part of mapping the API response to the shape your views expect? How did you solve it?**

TheDogAPI updated their API response shape and data without fully updating their documentation. So within the update, some data properties were completely removed, some added, some broken, and some unchanged. The /breeds endpoint dataset has 627 dog breeds, every dog's bred_for and reference_image_id property was empty, and no longer returns an image property. So, I didn't add the broken empty properties to the shape transform and had to use the /image/search endpoint to fetch a image by breed_id for each breed that was to be rendered. I added to pagination the dog breed card rendering to avoid overloading the browser and limit the number of image API calls.

---

## 6. New API fields

**What new field(s) did you add from the API? How did they improve your app compared to the static version?**

I added breedGroup, origin, and description. They improved the app by providing more information about each breed when viewing the dog's detailed card view without having to manually set values, especially beneficial for the descriptions.

---

## 7. Error handling philosophy

**You used try/catch in four different contexts this week: the serverless function, fetch in app.js, the localStorage wrapper, and the npm lint guard. What is the common pattern across all of them? What changes between contexts?**

The common pattern is that they all use try/catch to handle potential errors and prevent them from crashing the app. Between contexts, how the errors are handled within the catch changes because of the different enviroments and errors possible. In the serverless function, it returns a 502 response. In the fetch, it shows an error message in the DOM. In the localStorage wrapper, it self-heals or catches the error silently. In the npm lint guard, it logs a message to the terminal.


