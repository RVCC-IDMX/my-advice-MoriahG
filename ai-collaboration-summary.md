# AI collaboration summary

## Planning conversation

### Did the agent read your files before responding? How could you tell? 

The agent did read my files before responding, which became apparent because it described my files and what they do and followed the step by step instructions in the guide.

### What was the agent's first specific observation about your original repo?

The agent's first specific observation was the properties each pet has, listing them out, to ask me if I would like to keep them, change them, or add new ones.

### Did you have to push back on anything the agent suggested? What happened?

For the most part, I didn't have to push back on anything the agent suggested. During our converstation, I mostly found pitfalls and changes I wanted to make with the existing logic of the original code. The one thing I did push back on was the agent's suggested color pallet, as the colors were unappealing.

## Build conversation

### What did the agent generate that you kept as-is?

I kept the app.js and filter.js functions it generated as-is, although I did have to work around the agent's improper organization of the files and functions because it kept mismatching the files and where the functions were supposed to go.

### What did you change or ask the agent to redo? Why?

The agent had horrid CSS generation and editing, especially with proper responsitivity, colors, and keeping the proper color accessibility ratio. I had to completely redo the CSS file and organization from what it originally generated and the majority of agents suggestions and attempted improvements to the code. I also had to find new images for each pet because the ones it selected were either inaccurate or didn't work. On top of that, I had to update and create new pet datasets because the agent's suggested datasets had false information and often was an animal that wasn't a species but was a breed and vice versa.

### Did you run into any linting or formatting errors? How did you resolve them?

Yes, the agent's generated code had lint errors, mostly after making a change to the code and not removing/fixing old code causing issues with the new code. The errors were pretty straight forward and simple, so the fixes were obvious from the error report itself.

## AGENTS.md modifications

### What personal instructions did you add to the bottom of AGENTS.md?

1. When implimenting code fixes or making new changes, ensure there is no repeated and redundant code. If there is, suggest a way to refactor the code or remove the unneeded code before making changes and adding code.

2. Ensure each visual element of the code displays properly in various view port sizes and is responsively compatible with the media queries.

3. For every new function, add JSDoc comments to explain the purpose, parameters, and return value. If the function is lengthly and complex, add a few brief comments when necessary to clarify the logic and/or syntax.

### Why did you choose those specific instructions?

Each instruction reflects a problem I ran into when using the agent, even among different models. When the agent would add new code to fix a problem, it would duplicate code and not remove it, even after reviewing the code multiple times after. It would also repeat code that was unnecessary. The AI would often not focus on the responsivity of new elements and old elements, and would very rarely write comments within the code to help with visual organization and understanding.

### Did the agent's behavior change after you added them? How?

Yes, the agent's behavior did change once I added them. I had the agent fix a bug in a visual element regarding some pet filters by adding a new function, and when it did so it followed my instructions by explaining why the bug exists, suggesting the fix first, changing incompatible old code, and adding comments with the new function.

## Reflection

### What surprised you about working with an AI agent in a real tooling environment?

How significantly different AI models within the same tier follow AGENTS.md instructions and how much the tools help act as a fail safe for when an AI model easily doesn't follow instructions or makes errors.

### What would you do differently next time?

Next time, I would switch between different AI models more often for my needs, even within the same tier.

### What is one thing you learned about your own workflow or preferences?

I prefer to use AI for planning than for learning new topics.
