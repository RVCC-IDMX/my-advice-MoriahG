# Modern JavaScript rules

These rules teach modern JavaScript patterns. The older versions still work, but the modern versions are shorter, more consistent, easier to read, and potentially safer.

Each rule links to a page with a full explanation, before/after code, and a connection to your project.

---

## How these rules work in your project

Right now, these rules are meant to live in your AGENTS.md as guidance for your AI agent. When you add a rule, your agent should follow it — but it might slip. That is normal. Your job is to know the rules well enough to catch it.

Think of it as **trust but verify**. You trust your agent to write good code, but you verify it against the rules you set.

Later in the course, you will have the option to add a linter plugin that enforces these rules automatically. At that point, the rules move from suggestions to hard requirements — code that breaks them cannot be committed. That progression — from knowing the rules yourself to building a system that catches mistakes for you — is what context engineering is about.

---

## Rules by category

### DOM — Week 2+

- [Use querySelector over getElementById](query-selector.md)
- [Use .append() over .appendChild()](append.md)
- [Use .remove() over parentNode.removeChild()](remove.md)
- [Use textContent over innerText](text-content.md)
- [Use addEventListener over onclick](add-event-listener.md)
- [Use .before()/.after()/.replaceWith() over legacy methods](modern-dom-methods.md)
- [Use classList.toggle() for switching classes](class-list-toggle.md)
- [Use .dataset for data attributes](dataset.md)

### Arrays and loops — Week 3+

- [Use for...of over .forEach() and C-style loops](for-of.md)
- [Use .includes() over .indexOf()](includes.md)
- [Use .find() over .filter()[0]](find.md)

### Strings — Week 3+

- [Use template literals over concatenation](template-literals.md)

### Numbers — Week 3+

- [Use Number.isNaN() over isNaN()](number-is-nan.md)

### Style — Week 3+

- [No nested ternary expressions](no-nested-ternary.md)
- [Use kebab-case for filenames](kebab-case-filenames.md)

---

## Coming in later weeks

These rules will be added when you learn the concepts they apply to. You do not need to add them to AGENTS.md yet.

### Keyboard events

- Use `.key` over `.keyCode` — readable strings instead of mystery numbers

### Strings (advanced)

- Use `.slice()` over `.substring()` or `.substr()` — consistent behavior, matches array .slice()
- Use `.startsWith()`/`.endsWith()` over regex or index checks — reads like English

### Error handling

- Name catch parameters `error`, not `e` or `err` — clarity matters in debugging
- Always include a message in `new Error('...')` — errors without messages are useless
- Use `new Error()`, not `throw Error()` without `new` — consistency with all constructors
