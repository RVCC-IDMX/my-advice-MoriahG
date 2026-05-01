# Groq API chatbot guide

**Best for:** Adding an AI chatbot / conversational assistant to a student project
**Base URL:** `https://api.groq.com/openai/v1`
**Auth:** API key in `Authorization: Bearer` header (free signup, no credit card)
**CORS:** No — requires a server-side proxy for browser apps
**Rate limit (free tier):** ~30 requests/min, ~500,000 tokens/day
**Key advantage:** Extremely fast inference (Groq runs on custom LPU hardware)

---

## Getting your API key

1. Go to [console.groq.com](https://console.groq.com)
2. Create an account (email or Google sign-in) — no credit card required
3. Navigate to **API Keys** at [console.groq.com/keys](https://console.groq.com/keys)
4. Click "Create API Key", give it a name
5. Copy the key immediately — it is only shown once
6. Store in a `.env` file, never commit to git

---

## The big caveat: no CORS

The Groq API does **not** allow direct browser `fetch()` calls. You cannot call it from client-side JavaScript like the other APIs in this course.

**Students need a server-side proxy.** The simplest options:

1. **Netlify Functions** (recommended for this course — students already deploy on Netlify)
2. Express.js server
3. Any serverless function (Vercel, Cloudflare Workers)

The guide below covers both the raw API and a Netlify Functions proxy pattern.

---

## Available models (all free)

| Model                                       | Speed   | Quality | Best for                             |
| ------------------------------------------- | ------- | ------- | ------------------------------------ |
| `llama-3.3-70b-versatile`                   | Fast    | Highest | Best quality responses, general chat |
| `llama-3.1-8b-instant`                      | Fastest | Good    | High-volume, simpler tasks           |
| `meta-llama/llama-4-scout-17b-16e-instruct` | Fast    | High    | Preview — newer Llama 4 model        |
| `qwen/qwen-3-32b`                           | Fast    | High    | Preview — good multilingual support  |

All models are available on the free tier. The difference between free and paid is rate limits, not model access.

---

## Free tier rate limits

| Dimension           | Approximate limit                      |
| ------------------- | -------------------------------------- |
| Requests per minute | ~30                                    |
| Requests per day    | ~14,400                                |
| Tokens per minute   | ~6,000 (70B model), ~30,000 (8B model) |
| Tokens per day      | ~500,000                               |

Check your current limits at [console.groq.com/settings/limits](https://console.groq.com/settings/limits). Limits change periodically.

For a student chatbot demo, this is plenty — 30 req/min is about one message every 2 seconds.

---

## API request and response

### Endpoint

```
POST https://api.groq.com/openai/v1/chat/completions
```

### Request headers

```
Authorization: Bearer YOUR_GROQ_API_KEY
Content-Type: application/json
```

### Request body

```json
{
  "model": "llama-3.3-70b-versatile",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful movie recommendation assistant. Keep responses under 3 sentences."
    },
    {
      "role": "user",
      "content": "I want something scary but not too gory."
    }
  ],
  "temperature": 0.7,
  "max_completion_tokens": 256
}
```

### Request fields

| Field                   | Type            | Required | Default           | Description                                     |
| ----------------------- | --------------- | -------- | ----------------- | ----------------------------------------------- |
| `model`                 | string          | Yes      | —                 | Model ID                                        |
| `messages`              | array           | Yes      | —                 | Conversation history                            |
| `messages[].role`       | string          | Yes      | —                 | `system`, `user`, or `assistant`                |
| `messages[].content`    | string          | Yes      | —                 | Message text                                    |
| `temperature`           | number          | No       | ~1.0              | Randomness (0 = deterministic, 2 = very random) |
| `top_p`                 | number          | No       | 1.0               | Nucleus sampling threshold                      |
| `max_completion_tokens` | integer         | No       | model max         | Max tokens to generate                          |
| `stop`                  | string or array | No       | null              | Stop sequence(s)                                |
| `stream`                | boolean         | No       | false             | Enable streaming (SSE)                          |
| `response_format`       | object          | No       | `{"type":"text"}` | Set to `{"type":"json_object"}` for JSON output |
| `n`                     | integer         | No       | 1                 | Number of completions                           |
| `seed`                  | integer         | No       | null              | For reproducible outputs                        |

### Response body

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1709000000,
  "model": "llama-3.3-70b-versatile",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Try 'The Others' with Nicole Kidman — it's a slow-burn haunted house film that relies on atmosphere and twists rather than gore."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 38,
    "completion_tokens": 32,
    "total_tokens": 70
  }
}
```

### Response fields

| Field                        | Type    | Description                                       |
| ---------------------------- | ------- | ------------------------------------------------- |
| `id`                         | string  | Unique completion ID                              |
| `object`                     | string  | Always `"chat.completion"`                        |
| `created`                    | integer | Unix timestamp                                    |
| `model`                      | string  | Model used                                        |
| `choices[0].message.content` | string  | **The AI's response text**                        |
| `choices[0].finish_reason`   | string  | `"stop"` (complete), `"length"` (hit token limit) |
| `usage.prompt_tokens`        | integer | Tokens in the prompt                              |
| `usage.completion_tokens`    | integer | Tokens generated                                  |
| `usage.total_tokens`         | integer | Total tokens used                                 |

---

## How messages work (conversation history)

The `messages` array is the conversation history. To make a chatbot that remembers context, you send the entire conversation each time:

```javascript
const messages = [
  { role: "system", content: "You are a helpful workout advisor." },
  { role: "user", content: "I want to build arm strength." },
  { role: "assistant", content: "Try bicep curls and tricep dips..." },
  { role: "user", content: "What about without equipment?" },
];
```

Each new user message gets appended, and the full array is sent. The AI sees the whole conversation and responds in context.

### Message roles

| Role        | Purpose                                                      |
| ----------- | ------------------------------------------------------------ |
| `system`    | Sets the AI's personality and rules (sent once at the start) |
| `user`      | The human's messages                                         |
| `assistant` | The AI's previous responses (included for context)           |

---

## Architecture for a browser chatbot

Since CORS blocks direct browser calls, use this two-part architecture:

```
Browser (index.html + app.js)
    ↓ fetch('/api/chat', { body: messages })
Netlify Function (netlify/functions/chat.js)
    ↓ fetch('https://api.groq.com/openai/v1/chat/completions', { headers: auth })
Groq API
    ↓ response
Netlify Function
    ↓ JSON response
Browser
    ↓ display message
```

---

## Netlify Functions proxy (recommended approach)

### 1. Set up the environment variable

In Netlify dashboard: **Site settings > Environment variables > Add variable**

- Key: `GROQ_API_KEY`
- Value: your Groq API key

### 2. Create the serverless function

Create `netlify/functions/chat.js` in the project root:

```javascript
export default async function handler(request) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { messages } = await request.json();

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.7,
      max_completion_tokens: 512,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return new Response(JSON.stringify({ error: data.error?.message || "Groq API error" }), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      content: data.choices[0].message.content,
      usage: data.usage,
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}
```

### 3. Call the function from the browser

```javascript
async function sendMessage(conversationHistory) {
  const response = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: conversationHistory }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to get response");
  }

  return data.content;
}
```

---

## Complete browser chatbot example

### HTML (chat section to add to existing page)

```html
<section class="chat-section">
  <h2>Ask the advisor</h2>
  <div id="chat-messages" class="chat-messages" aria-live="polite"></div>
  <form id="chat-form" class="chat-form">
    <label for="chat-input" class="sr-only">Your message</label>
    <input
      type="text"
      id="chat-input"
      placeholder="Ask me anything..."
      autocomplete="off"
      required
    />
    <button type="submit">Send</button>
  </form>
</section>
```

### JavaScript (client-side chat logic)

```javascript
const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");

// Conversation history — system message sets the AI's role
const conversationHistory = [
  {
    role: "system",
    content:
      "You are a friendly movie recommendation assistant. Give short, enthusiastic recommendations based on what the user describes. Keep responses under 3 sentences.",
  },
];

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const userMessage = chatInput.value.trim();
  if (!userMessage) return;

  // Show user message
  appendMessage("user", userMessage);
  chatInput.value = "";
  chatInput.disabled = true;

  // Add to history
  conversationHistory.push({ role: "user", content: userMessage });

  // Show typing indicator
  const typingEl = appendMessage("assistant", "Thinking...");
  typingEl.classList.add("typing");

  try {
    const reply = await sendMessage(conversationHistory);

    // Update typing indicator with actual response
    typingEl.textContent = reply;
    typingEl.classList.remove("typing");

    // Add assistant response to history
    conversationHistory.push({ role: "assistant", content: reply });
  } catch (error) {
    typingEl.textContent = "Sorry, something went wrong. Try again.";
    typingEl.classList.remove("typing");
    typingEl.classList.add("error");
    // Remove the failed user message from history
    conversationHistory.pop();
  }

  chatInput.disabled = false;
  chatInput.focus();
});

function appendMessage(role, text) {
  const messageEl = document.createElement("div");
  messageEl.classList.add("chat-message", role);
  messageEl.textContent = text;
  chatMessages.append(messageEl);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return messageEl;
}

async function sendMessage(messages) {
  const response = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to get response");
  }

  return data.content;
}
```

### CSS (basic chat styling)

```css
.chat-section {
  max-width: 600px;
  margin: 2rem auto;
}

.chat-messages {
  border: 1px solid hsl(0 0% 80%);
  border-radius: 8px;
  padding: 1rem;
  height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chat-message {
  padding: 0.75rem 1rem;
  border-radius: 12px;
  max-width: 80%;
  line-height: 1.4;
}

.chat-message.user {
  background: hsl(220 70% 50%);
  color: hsl(0 0% 100%);
  align-self: flex-end;
  border-bottom-right-radius: 4px;
}

.chat-message.assistant {
  background: hsl(0 0% 93%);
  color: hsl(0 0% 15%);
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}

.chat-message.typing {
  opacity: 0.6;
  font-style: italic;
}

.chat-message.error {
  color: hsl(0 70% 45%);
}

.chat-form {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.chat-form input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid hsl(0 0% 80%);
  border-radius: 8px;
}

.chat-form button {
  padding: 0.75rem 1.5rem;
  background: hsl(220 70% 50%);
  color: hsl(0 0% 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
```

---

## Customizing the system prompt

The system message is the most powerful lever for shaping the chatbot's behavior. Tailor it to the student's project topic:

### Movie advisor

```javascript
{
  role: 'system',
  content: 'You are a movie expert. Recommend films based on the user\'s mood, genre preferences, and available time. Always suggest 2-3 options with a one-line reason for each. Keep it casual and enthusiastic.'
}
```

### Anime advisor

```javascript
{
  role: 'system',
  content: 'You are an anime recommendation expert. Suggest anime based on the user\'s preferred genres, mood, and whether they want sub or dub. Mention episode count and where to watch when possible. Keep responses concise.'
}
```

### Workout coach

```javascript
{
  role: 'system',
  content: 'You are a friendly fitness coach. Suggest exercises and workout routines based on the user\'s goals, available equipment, and fitness level. Include sets and reps. Remind users to warm up. Keep advice safe and encouraging.'
}
```

### Recipe helper

```javascript
{
  role: 'system',
  content: 'You are a helpful cooking assistant. Suggest recipes based on available ingredients, dietary restrictions, and time. Include approximate cook times. Keep suggestions practical and beginner-friendly.'
}
```

---

## Streaming (advanced, optional)

For a more responsive chatbot, use streaming to display the AI's response word-by-word:

### Netlify function with streaming

```javascript
export default async function handler(request) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { messages } = await request.json();

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.7,
      max_completion_tokens: 512,
      stream: true,
    }),
  });

  // Forward the SSE stream to the browser
  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
```

### Browser-side stream reader

```javascript
async function sendMessageStreaming(messages, onChunk) {
  const response = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullContent = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6);
      if (data === "[DONE]") break;

      const parsed = JSON.parse(data);
      const content = parsed.choices[0]?.delta?.content || "";
      fullContent += content;
      onChunk(fullContent);
    }
  }

  return fullContent;
}
```

---

## Integrating with existing filter results

A powerful pattern: combine the data API results with a Groq chatbot. The user filters (e.g., picks a genre and mood), the app fetches matching items from the data API, then passes those results to Groq for a personalized recommendation:

```javascript
async function getAIRecommendation(movies, userPreferences) {
  const movieList = movies
    .slice(0, 5)
    .map((m) => `- ${m.title} (${m.vote_average}/10): ${m.overview.slice(0, 100)}`)
    .join("\n");

  conversationHistory.push({
    role: "user",
    content: `Based on these movies that match my filters:\n${movieList}\n\nWhich one should I watch ${userPreferences}?`,
  });

  return sendMessage(conversationHistory);
}
```

---

## Local development

To test the Netlify function locally, use the Netlify CLI:

```bash
bun add -D netlify-cli
```

Create a `.env` file (add to `.gitignore`):

```
GROQ_API_KEY=gsk_your_key_here
```

Run the dev server:

```bash
bunx netlify dev
```

This serves the site at `localhost:8888` with functions available at `/.netlify/functions/chat`.

---

## Gotchas and tips

- **No CORS:** This is the single biggest difference from the other APIs. Students must use a server-side proxy. They cannot call Groq directly from `app.js`.
- **API key security:** The key must live in an environment variable on Netlify, never in client-side code or committed to git.
- **Conversation grows:** Every message adds tokens. For long conversations, trim older messages or set a max history length to stay under token limits.
- **Free tier is generous but limited:** 30 req/min is fine for one user, but if multiple students demo simultaneously from the same key, they will hit limits. Each student should use their own key.
- **System prompt is powerful:** Spend time crafting it. A good system prompt makes the chatbot feel purpose-built for the project topic.
- **`max_completion_tokens` controls cost and speed:** Keep it low (256-512) for chat responses. Higher values allow longer answers but use more of the daily token budget.
- **Error handling matters:** The API can return 429 (rate limited), 401 (bad key), or 500 (server error). Always handle errors gracefully in the UI.
- **OpenAI-compatible:** The API follows the OpenAI chat completions format exactly. Any OpenAI tutorial or example works with Groq by changing the base URL.
- **Groq is fast:** Responses come back in under a second for the 8B model, making it feel much more responsive than other LLM APIs. This is Groq's main selling point.
