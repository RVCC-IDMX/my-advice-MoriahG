# npm lifecycle scripts: preinstall, postinstall, and the security tradeoff

npm has hooks built into its workflow. They run automatically at specific moments — before or after `npm install`, before `npm publish`, when you run `npm test`. You do not call them yourself. npm calls them for you.

This is the same event-driven pattern you learned in Week 3: something happens, a callback fires.

---

## The lifecycle hooks in your project

Open your `package.json` and look at the `scripts` section. You will see two new entries this week:

```json
{
  "scripts": {
    "preinstall": "node -e \"...\"",
    "postinstall": "echo '\\n  Dependencies updated. Run npm run lint to see your new linting rules.\\n'"
  }
}
```

### preinstall — runs before npm install

Your `preinstall` script checks whether the old ESLint config file (`.eslintrc.cjs`) still exists. If it does, it prints a message explaining that the linter is upgrading. Once the migration is complete and `.eslintrc.cjs` is gone, the message stops appearing.

This is a self-expiring message. It runs every time, but it only has something to say during the transition.

### postinstall — runs after npm install

Your `postinstall` script confirms that dependencies were installed and points you to the docs. It fires after every `npm install`, which means it also fires when a teammate clones your repo and runs `npm install` for the first time.

### prepare — you already had this one

```json
"prepare": "husky"
```

The `prepare` script runs after `npm install` (alongside `postinstall`) and also before `npm publish`. Your project uses it to set up Husky so the pre-commit hook works on every machine that installs the project.

---

## When lifecycle scripts fire

| Script        | When it runs                               | Your project uses it for            |
| ------------- | ------------------------------------------ | ----------------------------------- |
| `preinstall`  | Before `npm install` starts                | Warning about linter upgrade        |
| `postinstall` | After `npm install` finishes               | Confirmation message + docs pointer |
| `prepare`     | After `npm install` + before `npm publish` | Husky setup                         |
| `pretest`     | Before `npm test`                          | (not used yet)                      |
| `posttest`    | After `npm test`                           | (not used yet)                      |

There are many more (`prepublishOnly`, `prepack`, `postpack`), but these are the ones that matter for your project right now.

---

## The JavaScript-everywhere moment

Look at the `preinstall` script again:

```json
"preinstall": "node -e \"try { require.resolve('eslint-plugin-unicorn') } catch { console.log('ESLint is upgrading...') }\""
```

That `node -e` runs a JavaScript program right inside your `package.json`. The program uses:

- **`try/catch`** — the same pattern as your localStorage wrapper
- **`require.resolve()`** — checks if a package exists in node_modules
- **`console.log()`** — prints to the terminal

This is not browser JavaScript. This is Node.js — JavaScript running on your computer instead of in the browser. But the language is the same. The try/catch pattern is the same. The error handling philosophy is the same: try to find something, handle the failure gracefully.

---

## The security side

npm lifecycle scripts are powerful. They also run automatically, with your permissions, on your machine.

When you run `npm install`, every package you install can have its own `postinstall` script. A malicious package could use that script to:

- Read files from your computer
- Send data to a remote server
- Install additional software you did not ask for

This has actually happened. In 2021, the `ua-parser-js` package (with millions of weekly downloads) was compromised — its `postinstall` script was modified to download and run a cryptocurrency miner on every machine that installed it.

This is why:

- **Review what a package does** before installing it (check its GitHub, its download count, its last publish date)
- **`npm audit`** exists to check for known vulnerabilities
- **`--ignore-scripts`** is available for untrusted packages (skips all lifecycle scripts)
- **Dependencies are trust decisions** — you learned this in hap-fetch

Your project's lifecycle hooks are safe — you can read exactly what they do in your own `package.json`. But when you install someone else's package, their hooks run too. That is the tradeoff: power and convenience vs. a wider attack surface.

---

## The pattern repeats

| System  | Hook name                              | When it fires        | You learned it in  |
| ------- | -------------------------------------- | -------------------- | ------------------ |
| Browser | `addEventListener("click", ...)`       | User clicks          | Week 2             |
| Git     | `.husky/pre-commit`                    | Before commit        | Week 1 (inherited) |
| npm     | `postinstall`                          | After `npm install`  | Week 4             |
| Netlify | `export default async (request) => {}` | HTTP request arrives | Week 4             |

Different systems. Same idea: register your code at a lifecycle point, and the system calls it when the time is right.

See `docs/tutorials/what-are-hooks.md` for the full picture of hooks across your project.
