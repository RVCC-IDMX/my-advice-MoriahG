# Final project — reflection

Write 2–3 sentences for each prompt. The reflection is where the learning gets named — give yourself room to think.

## 1. Pattern picked

**Which pattern did you pick — A, B, or A+B? Why? If you considered one and rejected it, name what made it not the right fit for _your_ project.**

I picked pattern A, because I already planned on changing my dropdown selection UI after transfering to TheDogAPI because there wasn't as much of a need for the more filters dropdown selection, and pattern A most cleanly maps onto my existing filtering logic. I considered doing A+B, but for the sake of time, decided it was not the right fit.

## 2. The hardest part

**What was the hardest part of integrating Groq into your Week 4 architecture? Was it the prompt design, the schema shape, the front-end refusal handling, the latency, the cost, the unfamiliar SDK, or something else?**

The hardest part of integrating Groq was handling the prompt design. When trying to write the prompt to refuse non dog related inputs, even down to very detailed specifics, Groq was very refusal trigger happy and would refuse requests despite them meeting the directions in the prompt. So, I wrote a more general prompt to get it to actually accept inputs.


## 3. The moderation floor

**How did the four-layer moderation floor (system prompt, JSON mode, delimited input, length cap) shape your design? Did any layer surprise you — either by how cheap it was to add, or by how much it changed the user-facing behavior?**

It shaped my design by adding an extra level of security between the user and Groq, changing my form's interactability. The system prompt surprised me the most on how significantly it can impact the users experience by its user-facing behavior. After all that, it felt like a crime to not make Groqs refusals more friendly and humorous, so I had to.

## 4. UX polish

**What UX rough edge did you smooth, and why that one? What did smoothing it teach you about the difference between "shipping a working app" and "shipping a finished one"?**

The UX rough edge I smoothed was the lack of properties in the detail view that could significantly impact a users decision on if that breed is right for them, because of removing them when changing data sources to TheDogAPI. Smoothing it taught me that shipping a working app is more focused on functionality, whereas shipping a finished one takes the quality of the users experience into account, eliminating as many user pain points as much as possible.

## 5. Groq's strengths and weaknesses

**What did Groq do well in your project? What did it not do well — wrong outputs, drift from the schema, latency, hallucinations, anything else? How would your design change if you had to use a slower or less capable model?**

It did well at transforming user input into their desired filter values, such as specific life span ranges/min/max. It did not do well at understanding what inputs should be refused based on the prompt, would apply the wrong data shapes to the output, and may not have generated the most accurate inferred values. If I had a less capable model, I would rely more on selectable filters and dropdowns than using the model as the sole form interaction.

## 6. What you would do differently

**If you had another week, what would you do differently? Not "what new feature would you add" — what would you change about your _approach_ if you could start over?**

I would most likely change my approach to include filtering from both dropdowns and Groq. This would cater to differing user preferences and provide a backup if Groq fails.

