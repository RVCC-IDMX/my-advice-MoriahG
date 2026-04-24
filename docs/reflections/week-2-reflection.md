# Week 2 reflection — DOM Fundamentals

## Reading the agent's code

### What was the hardest part of your code to understand? What made it click?

The hardest part of my code to understand was the populateMoreFilters() function due to its largesize having so many types of filters and filter values, along with some being checkbox selections while others single selections. What really made it click was visualizing what each element was in relation to the actual result on the webpage's more filters dropdown.

### Did you find anything in the agent's code that surprised you — something you would not have written yourself?

There wasn't much, but I did find some code leftover from previous code the agent wrote that I did not like and that I tried removing previously.

## Modernizing

### How many `getElementById` calls did you replace? Was the switch to `querySelector` straightforward?

I had to replace 10 `getElementById` calls. The switch to `querySelector` was straightforward because it functions similarly enough, with `querySelector` being able to select IDs plus more.

### Did you find any `innerHTML` that was risky? How did you decide what to replace?

I didn't have any unsafe `innerHTML` in my code, only `innerHTML` emptying a container into an empty string.

## DOM experiments

### Which experiment was your favorite? Why?

My favorite experiment was the Hide and Show, because it was way easier to think of practical uses for it than the others, and the .classList method is easy to understand.

### Which experiment was the hardest? What tripped you up?

The hardest experiment was the Count Elements experiment, because at first I didn't realize that the counter I wanted to make needed to be updated every time the user interacted with it, or else the counter would only run once when the page loaded and never update again, so I got a bit lost trying to find a selector I could use.

### Did any experiment give you an idea for a feature you want to add to your site later?

The experiments didn't necessarily give me any new ideas for features, but gave me ideas on how I could possibly implement previous ideas for new features I had, such as adding a count to the more filters button to show how many selected filters there are when the more filters dropdown menu is closed and my plan to add another way to close the more filters dropdown menu by either an "X" button or clicking space outside the dropdown menu.

## AGENTS.md

### What new rules or instructions did you add to AGENTS.md this week?

1. Do not create multiple reference variables to the same element in the DOM. Instead, create one reference and reuse it.

2. Always use `textContent` when adding data to the DOM, and only use `innerHTML` for hardcoded templates with no external data. If `innerHTML` is used, add a comment explaining why it is safe.

### Compare your "About this student" section from the start of the week to the end. What changed?

I kept my "About this student" section including that I am currently learning DOM manipulation the same until the end of the assignment when I fully understood the DOM and its methods. So at the end, I replaced my previous DOM learning status with adding DOM manipulation and some of the methods to the Knows section, not going into too much detail to avoid clogging agent's memory.

## Reflection

### What is one thing you understand about the DOM now that you did not understand before this week?

Before this week, I did not understand the difference between getElementById and querySelector. I did not know about querySelectors much larger range of capabilities with using any CSS selector.

### What would you do differently if you were starting this week's work over?

I would have spent less time side tracked in event listeners.
