# Week 3 reflection

Take a few minutes to think about what happened this week — not just what you built, but how the process went.

---

## Your code

What changed about how you think about your project's structure after creating views.js and wiring events?

> After separating the rendering into view.js from the events and DOM wiring in app.js, my projects structure felt more organized and easier to understand, but also significantly more massive. It also made redundancies and inefficiencies easier to spot. 

---

## Your agent

Did preparing your AGENTS.md with modern JS rules before coding change the quality of what your agent produced? What did you notice?

> It didn't change the quality too significantly because the code already followed most of the rules, but it did help improve some of the codes capabilities by using for...of loops and shorten the amout of lines with append instead of appendChild.

---

## The rules

Which modern JS rule from `docs/rules/` stuck with you most? What clicked about it?

> classList.toggle() stuck with me the most because of how much more efficient it is for switching classes. It made me reflexively question every classList.add() and classList.remove() I saw after reading the rule.

---

## Biggest win or biggest loss

What was the moment this week that affected you most — something that finally worked, or something that really frustrated you?

> The biggest moment for me was figuring out how I wanted the code in showDetail to format each property's raw data of the item, with all the varying data types. So instead of using the old way my main card rendering function did it, I decided to make a separate function to format the data so I could reuse it for showResults and showDetail.
