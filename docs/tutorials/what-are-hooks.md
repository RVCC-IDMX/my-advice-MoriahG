# What are hooks?

In software engineering, a hook is a mechanism that allows you to "hook into" or intercept the execution of a program to change its behavior or react to specific events without modifying its core source code.

A system provides a hook as a designated point in its lifecycle where it will check for and run any custom code you have provided.

Three properties define every hook:

- **Interception** — hooks intercept standard function calls, system events, or messages
- **Extensibility** — they let you add features or modify behavior at runtime
- **Lifecycle timing** — most hooks are tied to a specific stage: "before an action starts" (pre-hook) or "after it finishes" (post-hook)

---

## Hooks you have already used

You have been using hooks since Week 1 of this course. Here is every hook you have encountered, organized by where it runs.

### Browser hooks (event listeners)

```js
form.addEventListener("submit", handleFormSubmit);
resultsContainer.addEventListener("click", handleCardClick);
```

- **What provides the hook:** The browser's DOM API
- **When it fires:** When the user interacts with the page (click, submit, keydown, scroll)
- **Your custom code:** The callback function you pass to `addEventListener`
- **Pre or post:** Neither — it fires _during_ the event
- **You learned this in:** Weeks 2-3 (DOM experiments, event delegation, view switching)

The browser does not know or care what your `handleCardClick` function does. It just calls it at the right moment. That is the hook pattern.

### Git hooks (pre-commit)

```bash
# .husky/pre-commit
npx lint-staged
```

- **What provides the hook:** Git (via Husky)
- **When it fires:** After you run `git commit` but _before_ the commit is saved
- **Your custom code:** The shell script in `.husky/pre-commit`
- **Pre or post:** Pre — it runs before the action completes, and can cancel it
- **You learned this in:** Week 1 (inherited from the starter template)

If `lint-staged` finds errors, the hook exits with a non-zero code and Git cancels the commit. Your code never reaches the repository. This is a **blocking** hook — it can stop the action from completing.

### npm lifecycle hooks (preinstall / postinstall)

```json
{
  "scripts": {
    "preinstall": "node -e \"...\"",
    "postinstall": "echo 'Dependencies updated.'"
  }
}
```

- **What provides the hook:** npm
- **When it fires:** Automatically before or after `npm install`
- **Your custom code:** The command in the `preinstall` or `postinstall` script
- **Pre or post:** Both available — `preinstall` runs before, `postinstall` runs after
- **You are learning this in:** Week 4 (this PR)

Look at the `preinstall` script in your `package.json`. It uses `node -e` to run a small JavaScript program:

```js
try {
  require.resolve("eslint-plugin-unicorn");
} catch {
  console.error("Run npm install first.");
  process.exit(1);
}
```

This is the same try/catch pattern you use for localStorage. Try to find something. If it is missing, handle the failure gracefully. The only difference: this runs in Node, not the browser. **JavaScript is the same language in both places.**

#### The security side of lifecycle hooks

npm lifecycle hooks are powerful — and that power is a security concern. When you run `npm install`, every package you install can have its own `postinstall` script. That script runs automatically, with your permissions, on your machine.

A malicious package could use `postinstall` to:

- Read files from your computer
- Send data to a remote server
- Install additional software

This is why:

- You should review what a package does before installing it
- `npm audit` exists to check for known vulnerabilities
- Some teams use `--ignore-scripts` for untrusted packages
- Dependencies are trust decisions (you learned this in hap-fetch)

Your project's lifecycle hooks are safe — you can read exactly what they do in `package.json`. But when you install someone else's package, their hooks run too.

### GitHub Actions (CI hooks)

```yaml
# .github/workflows/lint.yml
on: [push, pull_request]
```

- **What provides the hook:** GitHub
- **When it fires:** On push or pull request to the repository
- **Your custom code:** The workflow file in `.github/workflows/`
- **Pre or post:** Post — it runs after the push is received
- **You learned this in:** Week 1 (inherited from the starter template)

GitHub Actions are hooks at the repository level. They react to Git events (push, PR, tag) and run your code in the cloud.

### Serverless functions (HTTP hooks)

```js
/* netlify/functions/api.mjs */
export default async (request) => {
  /* your code here */
  return new Response(JSON.stringify(data));
};
```

- **What provides the hook:** Netlify (or any serverless platform)
- **When it fires:** When an HTTP request hits `/.netlify/functions/api`
- **Your custom code:** The exported function
- **Pre or post:** During — it runs in response to the request
- **You are learning this in:** Week 4 (Part 1)

A serverless function is a hook for HTTP events. The platform handles routing, scaling, and infrastructure. You provide the function that runs when a request arrives.

---

## The pattern

Every hook follows the same structure:

1. **A system defines a lifecycle point** — "something is about to happen" or "something just happened"
2. **You register your code** at that point — a callback, a script, a function, a workflow file
3. **The system calls your code** at the right moment — you do not call it yourself

You have written this pattern dozens of times:

```js
/* Browser */
button.addEventListener("click", handleClick);

/* Git (via Husky) */
/* .husky/pre-commit → npx lint-staged */

/* npm */
/* "postinstall": "echo 'Done'" */

/* Serverless */
export default async (request) => {
  /* ... */
};
```

Different systems, different syntax, same idea: **provide your code, and the system calls it when the time is right.**

---

## Pre vs post: when timing matters

Some hooks run before an action, some after. The timing determines what your hook can do:

| Timing     | Can cancel the action?           | Can modify the result?                    | Example                                            |
| ---------- | -------------------------------- | ----------------------------------------- | -------------------------------------------------- |
| **Pre**    | Yes — exit non-zero to stop it   | No — the action has not happened yet      | Git pre-commit, npm preinstall, `preventDefault()` |
| **Post**   | No — the action already happened | Yes — you can transform or log the result | npm postinstall, GitHub Actions on push            |
| **During** | Depends on the system            | Yes — you produce the response            | Event listeners, serverless functions              |

`preventDefault()` in the browser is a pre-hook behavior — it stops the default action (form submission, link navigation) before it happens. You used this in Week 3 on your form handler.

---

## Why this matters for your project

This week your project gains two new hook layers:

- **npm lifecycle hooks** in `package.json` that run during `npm install`
- **Serverless function hooks** that run when the browser fetches data

Combined with the hooks you already have (event listeners, Git pre-commit, GitHub Actions), your project now has hooks at every level of the stack:

| Layer   | Hook                         | What it does in your project                      |
| ------- | ---------------------------- | ------------------------------------------------- |
| Browser | `addEventListener`           | Handles form submit, card clicks, back button     |
| Git     | `.husky/pre-commit`          | Blocks commits that fail linting                  |
| npm     | `preinstall` / `postinstall` | Warns about upgrades, confirms dependency install |
| CI      | `.github/workflows/lint.yml` | Runs lint on every push                           |
| Server  | `netlify/functions/api.mjs`  | Fetches and transforms API data on request        |

Five different systems. Five different syntaxes. One pattern.
