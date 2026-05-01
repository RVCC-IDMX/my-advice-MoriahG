# AI harness engineering: what you have been building all semester

## What is harness engineering?

AI harness engineering is the discipline of building the software infrastructure, constraints, and feedback loops that surround an AI model to make it reliable, safe, and productive.

The term was popularized in early 2026 by figures like Mitchell Hashimoto (co-founder of HashiCorp) and quickly adopted by companies like OpenAI and Anthropic.

### Why the industry needs this

If 2025 was the year AI agents proved they could write code, 2026 is the year teams learned that **the agent is not the hard part — the harness is.** Software teams have been frustrated: AI coding tools generate code fast, but that code hallucinate file paths, invents APIs that do not exist, ignores architectural patterns, and drifts from project standards the longer the conversation runs. A 2026 Harness report found that 69% of teams using AI coding tools frequently experience deployment problems with AI-generated code.

The gap between an agent that demos well and one that runs reliably in production is almost entirely a harness engineering problem. Teams tried prompting their way out — writing better instructions, more detailed context files, longer AGENTS.md rules. It helped, but it was not enough. Prompts are probabilistic. The AI reads them, but it can forget, reason its way around a rule, or lose track of instructions as the conversation grows.

The core philosophy: **fix the system, not the prompt.**

Every time your AI coding partner generates code that breaks a rule, you have two choices:

- **Prompting:** Ask the agent to please follow the rule next time (fragile — it might forget)
- **Harnessing:** Build a system that physically prevents the rule from being broken (reliable — it runs every time)

You have been doing both in this project. Your AGENTS.md is prompting. Your linter and pre-commit hooks are harnessing. Before this course started, you worked on other assignments that used some of these tools — but the my-advice project is where you started deliberately building and strengthening these layers week by week.

---

## The three disciplines

The industry describes a hierarchy of how we shape AI behavior:

| Discipline              | What you optimize                          | Your course example                                                                    |
| ----------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------- |
| **Prompt engineering**  | A single instruction to the AI             | Asking Copilot to "use querySelector instead of getElementById"                        |
| **Context engineering** | Everything the AI sees when it works       | Your AGENTS.md file — the rules, the project context, the "about this student" section |
| **Harness engineering** | The entire environment the AI works inside | ESLint + unicorn, pre-commit hooks, GitHub Actions, serverless function boundaries     |

Prompt engineering is the command "turn right." Context engineering is the map. Harness engineering is the road, the signs, and the guardrails.

When your AI ignores a prompt, a harness engineer does not blame the model's intelligence — they fix the system's governor.

---

## Your harness, mapped

You have been building a harness around your AI coding partner across the my-advice project. Here is every layer, in the order you added it:

### Week 1 — Inherited harness (you did not build these yet)

| Component                    | What it does                                        | Harness type        |
| ---------------------------- | --------------------------------------------------- | ------------------- |
| `.eslintrc.cjs`              | 4 rules (no-eval, no-var, prefer-const, no-console) | Verification loop   |
| `.husky/pre-commit`          | Runs lint-staged before every commit                | Deterministic hook  |
| `lint-staged` config         | Runs ESLint + Prettier on staged files only         | Scoped enforcement  |
| `.github/workflows/lint.yml` | Runs lint on every push and PR                      | Remote verification |
| `AGENTS.md`                  | Initial project context for your AI                 | Managed context     |

You inherited all of this from the starter template. The AI agent that built your app in Week 1 worked inside this harness — it just was not strict enough to catch everything.

### Week 2 — You started shaping context

| Component            | What it does                                                | Harness type    |
| -------------------- | ----------------------------------------------------------- | --------------- |
| Updated AGENTS.md    | Added DOM rules (querySelector, createElement, textContent) | Managed context |
| `docs/rules/` folder | 15 curated modern JS rules your AI should follow            | Managed context |

You moved from inheriting a harness to actively shaping the context your AI receives. But these are still advisory — the AI reads them, but nothing forces compliance.

### Week 3 — You understood the inherited hooks

| Component         | What it does                                                   | Harness type           |
| ----------------- | -------------------------------------------------------------- | ---------------------- |
| Updated AGENTS.md | Added event and SPA pattern rules                              | Managed context        |
| Code map          | Documented your own project so instructions could reference it | Managed context        |
| Named callbacks   | A pattern that makes code readable to both humans and AI       | Convention enforcement |

You did not add new enforcement in Week 3, but you understood the hooks you inherited (pre-commit, lint-staged) and documented your project's structure so that future instructions could reference your actual code.

### Week 4 — You upgraded enforcement

| Component                          | What it does                                               | Harness type                 |
| ---------------------------------- | ---------------------------------------------------------- | ---------------------------- |
| `eslint.config.js`                 | Flat config with 23 unicorn rules (replaces .eslintrc.cjs) | Verification loop (stronger) |
| `eslint-plugin-unicorn`            | Mechanical enforcement of modern JS patterns               | Deterministic rules          |
| `preinstall` / `postinstall` hooks | npm lifecycle scripts that guide setup                     | Deterministic hooks          |
| Lint guard in package.json         | try/catch that catches missing dependencies                | Guardrail                    |
| Serverless function                | Trust boundary between browser and external API            | Architectural guardrail      |
| localStorage wrapper               | try/catch that validates data at the storage boundary      | Data guardrail               |
| Updated AGENTS.md                  | Added async/fetch/cache rules + enforcement layer notes    | Managed context              |

This is the week your harness got real teeth. The linter now catches patterns that AGENTS.md could only request. The pre-commit hook blocks violations before they reach the repository. The serverless function enforces a trust boundary between your app and external data.

---

## The enforcement ladder

Your harness has three layers, from softest to hardest:

### Layer 1: Advisory (AGENTS.md)

```
"Use querySelector instead of getElementById"
```

Your AI reads this and tries to follow it. But it is a prompt — the AI can forget, reason its way around it, or lose track of it as the conversation grows. This is context engineering.

**What it catches:** Patterns the AI generates on first pass. Good for intent and style.

**What it misses:** Anything the AI decides "does not apply this time." Also powerless against copy-pasted code or code the AI wrote before the rule existed.

### Layer 2: Linting (ESLint + unicorn)

```
"unicorn/prefer-query-selector": "error"
```

A mechanical check that runs against your actual code. It does not reason. It does not decide a rule "does not apply this time." It checks every file, every time.

**What it catches:** Everything in its rule set, deterministically. If the code has `getElementById`, the linter flags it — no exceptions.

**What it misses:** Intent, architecture, security decisions that cannot be expressed as AST patterns. A linter cannot check "is this the right API for this student's project?"

### Layer 3: Blocking (pre-commit hook + CI)

```bash
# .husky/pre-commit
npx lint-staged
```

The last line of defense. Even if the AI generated bad code and you did not notice, the pre-commit hook runs the linter on your staged files and blocks the commit if anything fails.

**What it catches:** Everything the linter catches, at the moment it matters most — right before code enters the repository.

**What it misses:** Nothing that the linter checks for. But it only runs on commit — if you never commit, it never runs.

Each layer catches what the previous layer missed:

- AGENTS.md shapes first-pass code (most violations never happen)
- ESLint catches what slipped through (violations in existing code)
- Pre-commit hook blocks what you missed (violations at the gate)

---

## AI tools are building their own harnesses

The tools you use are adopting this same pattern.

### GitHub Copilot agent hooks (Preview)

Copilot now supports hooks configured as JSON files in `.github/hooks/*.json`:

| Hook event     | When it fires                                         | What it can do                                         |
| -------------- | ----------------------------------------------------- | ------------------------------------------------------ |
| `PreToolUse`   | Before the agent runs a tool (edit file, run command) | Approve or deny the action                             |
| `PostToolUse`  | After the agent runs a tool                           | Scan the result, feed errors back for the agent to fix |
| `SessionStart` | When an agent session begins                          | Set up context, check prerequisites                    |
| `Stop`         | When the agent tries to finish                        | Block completion if tests still fail                   |

A `PreToolUse` hook can block dangerous commands before they execute — the same pattern as your Git pre-commit hook. A `PostToolUse` hook can run ESLint on new code and feed violations back to the agent — creating a self-healing loop where the agent fixes its own mistakes.

### Claude Code hooks

Claude Code uses a similar system configured in `settings.json`:

| Hook event     | When it fires                        |
| -------------- | ------------------------------------ |
| `PreToolUse`   | Before Claude runs a tool            |
| `PostToolUse`  | After Claude runs a tool             |
| `Notification` | When Claude wants to notify the user |

The pattern is identical: intercept the AI's actions at defined lifecycle points, run your custom code, and enforce rules the AI might otherwise ignore.

### The self-healing loop

When a hook detects noncompliance, it does not just stop the agent — it creates a feedback loop:

1. **Violation:** The agent writes code that breaks a rule
2. **Detection:** A PostToolUse hook scans the change and fails
3. **Feedback:** The hook sends failure details back to the agent
4. **Remediation:** The agent sees the error and fixes its work

This is the same loop you experience when you run `npm run lint`, see violations, and fix them. The difference: with agent hooks, the loop is automated — the agent fixes itself without you intervening.

---

## The course arc as harness engineering

Looking back at the full semester:

| Week | What you built                                  | Harness engineering concept                                                        |
| ---- | ----------------------------------------------- | ---------------------------------------------------------------------------------- |
| 1    | AGENTS.md + inherited tooling                   | Managed context + inherited guardrails                                             |
| 2    | DOM rules, modernized code                      | Strengthened context, started shaping AI behavior                                  |
| 3    | Events, view functions, code map                | Understood inherited hooks, documented the system                                  |
| 4    | Serverless proxy, ESLint upgrade, unicorn rules | Trust boundaries, upgraded enforcement, the full ladder                            |
| 5    | System prompt for chatbot                       | Context engineering for a production AI (not your coding partner — your users' AI) |

Week 5 is where it comes full circle. You have been writing rules for your AI coding partner all semester. In Week 5, you write a system prompt for an AI that talks to your users. The skill is the same — context engineering — but the stakes are different. Your AGENTS.md shapes how code gets written. Your system prompt shapes how a chatbot talks to real people.

---

## Key takeaway

When your AI does something wrong, the question is not "how do I prompt it better?" The question is: **"where in my harness did this slip through, and how do I add a gate?"**

- If the AI generates bad patterns → strengthen AGENTS.md (advisory)
- If bad code makes it into files → add or tighten ESLint rules (linting)
- If bad code makes it into commits → check your pre-commit hook (blocking)
- If bad code makes it into production → check your CI pipeline (remote verification)

Every layer you add makes the next failure less likely. That is harness engineering.

---

## Further reading

- [Martin Fowler: Harness Engineering](https://martinfowler.com/articles/harness-engineering.html) — comprehensive overview from a software architecture perspective
- [Anthropic: Harness Design for Long-Running Apps](https://www.anthropic.com/engineering/harness-design-long-running-apps) — how Anthropic thinks about building systems around Claude
- [Agent hooks in VS Code (Preview)](https://code.visualstudio.com/docs/copilot/customization/hooks) — Copilot's hook system documentation
- [Firecrawl: What is an Agent Harness?](https://www.firecrawl.dev/blog/what-is-an-agent-harness) — accessible introduction to the concept
