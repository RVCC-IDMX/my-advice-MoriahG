# Use kebab-case for filenames

## The rule

Name all files using kebab-case (lowercase words separated by hyphens).

## Why

macOS is case-insensitive (`MyFile.js` and `myfile.js` are the same file), but Linux is case-sensitive (they are different files). This causes bugs that only appear in deployment. kebab-case avoids the problem entirely and matches URL conventions.

## Before and after

```text
// inconsistent — will cause problems
myComponent.js
UserCard.js
dataHelpers.js

// kebab-case — safe everywhere
my-component.js
user-card.js
data-helpers.js
```

## In your project

Your project files already follow this convention: `app.js`, `matching.js`, `data.js`, `views.js`, `style.css`. If you create new files, keep the pattern. If your agent suggests a filename like `cardBuilder.js` or `ViewHelpers.js`, rename it to `card-builder.js` or `view-helpers.js`.

## AGENTS.md rule

```
Use kebab-case for all filenames
```
