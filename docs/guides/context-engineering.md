# Context engineering — why less is more

In Week 1 you learned how to modify your AGENTS.md — what the sections are, where to add personal instructions, and how to write rules that are specific enough to change the agent's behavior. If you have not read that guide yet, start with `docs/guides/modifying-context.md`.

This guide goes deeper. Now that you are adding more rules (modern JS patterns, event conventions, SPA rules), you need to understand what happens when your AGENTS.md grows.

---

## The budget metaphor

Your AI agent has a fixed amount of working memory called the context window. Everything it reads — your AGENTS.md, your code files, the conversation, and its own response — shares that space.

Every rule you add to AGENTS.md costs tokens. Those tokens are subtracted from what the agent can use for reading your code, understanding your question, and writing its answer. A long AGENTS.md means less room for everything else.

Think of it as a budget. You would not spend your entire paycheck on groceries and have nothing left for rent. Do not spend your entire context window on instructions and leave nothing for the actual work.

---

## When more instructions make things worse

Research across thousands of repositories has found that **poorly maintained context files can perform worse than no context file at all**. Here is what goes wrong:

- **Buried signal.** When everything is a rule, nothing stands out. The agent treats a 50-rule AGENTS.md like a wall of text and may miss the rules that actually matter for the current task.

- **The middle gets lost.** AI models pay the most attention to information at the beginning and end of their context. Information in the middle gets less attention. If your most important rule is buried on line 40, it may be the one the agent overlooks.

- **Contradictions.** More rules mean more chances for rules to conflict. If one rule says "use template literals" and another inherited from a tutorial says "avoid backtick strings," the agent has to guess which you mean.

- **Stale rules.** A rule that described your project accurately in Week 1 may be misleading in Week 3. Outdated instructions do not just waste space — they actively mislead.

---

## The iterative approach

The best AGENTS.md files grow through experience, not upfront planning:

1. Start with 5-10 rules that matter most for this week's work
2. Use the agent for real tasks
3. Notice where it makes mistakes
4. Add a targeted rule for that specific mistake
5. Remove rules that are not catching anything

This builds a lean file where every rule has been tested against a real failure. A rule that has never caught a mistake is a rule that is wasting your budget.

---

## How many rules?

There is no hard limit, but community guidelines suggest:

- **5-10 well-chosen rules** per section is a good target
- Under **150 lines total** keeps the file effective
- If a section is getting long, ask: is every line earning its place?

For this week, when you add modern JS rules from `docs/rules/`, pick the ones that match patterns you have actually seen your agent generate. Do not add every rule because it sounds good — add rules because they solve a real problem.

---

## The progression you are building

Right now, your AGENTS.md is the only layer of defense. You write rules, your agent reads them, and you verify the output. This is **trust but verify**.

Production code development will often require extensive code quality checks. In cases like these, a development team has the option to add automated enforcement such as:

1. **ESLint with plugins** — catches what the agent missed (detection)
2. **Husky pre-commit hooks** — blocks bad code from being committed (enforcement)

You are building layer 1 right now. It only works if it is lean, specific, and maintained. When you add the other layers, your AGENTS.md can focus on the soft guidance (structure, patterns, preferences) while the linter handles the hard rules (what is not allowed).
