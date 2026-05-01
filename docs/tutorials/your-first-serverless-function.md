# Your first serverless function

## What is a serverless function?

A serverless function is code that runs on a server, but you do not manage the server. You write a single function, deploy it, and the platform (Netlify) handles everything else: starting the server, scaling it, shutting it down when nobody is using it.

You already have one in this project: `netlify/functions/api.mjs`.

## Where the file lives

```text
your-project/
  netlify/
    functions/
      api.mjs       <-- your serverless function
```

Netlify looks in `netlify/functions/` automatically. Any `.mjs` file there becomes a function you can call from the browser.

## The export pattern

Open `netlify/functions/api.mjs`. The structure looks like this:

```js
export default async (request) => {
  return new Response(JSON.stringify({ message: "hello from the server" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
```

Key points:

- `export default async` makes the function available to Netlify
- `request` is the incoming HTTP request from the browser
- You must return a `new Response()` with a body and options

## Running the dev server

Your normal `npm run dev` starts Vite — it serves your HTML, CSS, and JavaScript but knows nothing about serverless functions. To test functions locally, you need the Netlify CLI running alongside Vite.

This project has a script that handles it:

```bash
npm run dev:api
```

This runs `npx netlify dev` behind the scenes. Here is what to expect:

- **First time only:** npx will ask to install `netlify-cli`. Say yes. This is a one-time download — it will not ask again.
- **First time only:** If the CLI does not recognize your Netlify account, it will ask you to log in. Run `npx netlify login` — it opens a browser window where you authorize with your Netlify account. You only do this once. After that, `npm run dev:api` and `netlify deploy --prod` both work without re-authenticating.
- The terminal will show Vite starting, then "Loaded function api" — that means your serverless function is ready.
- Your site is at `http://localhost:8888` (not the usual 5173). Netlify's dev server wraps Vite so it can route function requests.

If you completed [HAP's "Living in the Terminal" Station 3](https://hap-and-terminal.netlify.app/stations/station3/), you already installed the Netlify CLI globally with `npm install -g netlify-cli`. In that case npx will use your existing install and skip the download. Either way, the command works the same.

> **Why `npm run dev:api` instead of `npm run dev`?** Use `dev:api` whenever you need your serverless function (Parts 1-4). Use `dev` when you are only working on HTML/CSS/JS and do not need the function running.

## How to test it

1. Run `npm run dev:api` in your terminal
2. Open your browser to `http://localhost:8888/.netlify/functions/api`
3. You should see JSON in the browser

That URL path (`/.netlify/functions/api`) maps directly to the file `netlify/functions/api.mjs`. The filename minus the extension becomes the route.

## The proxy pattern

Your function sits between the browser and an external API:

```text
Browser  -->  your function  -->  external API
         <--                 <--
```

If you completed hap-fetch Station 4, this is the same pattern. The browser calls your function, your function calls the external API, and your function sends the response back.

Why not call the external API directly from the browser?

- **CORS** — many APIs block requests from browsers
- **API keys** — you cannot hide secrets in browser code; anyone can view source
- **Trust boundaries** — the server is a controlled environment you own; the browser is not

Your serverless function acts as a trusted middleman.

## Returning JSON with `new Response()`

`new Response()` takes two arguments: the body and an options object.

```js
return new Response(JSON.stringify({ advice: "drink water" }), {
  status: 200,
  headers: { "Content-Type": "application/json" },
});
```

- `JSON.stringify()` converts your object to a string (Response bodies must be strings)
- `status: 200` means success
- `"Content-Type": "application/json"` tells the browser to parse the response as JSON

## Error handling

When your function calls an external API, that API might be down. Wrap the call in try/catch and return a `502` (bad gateway) if something goes wrong:

```js
export default async (request) => {
  try {
    const response = await fetch("https://some-api.example.com/data");
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to reach upstream API" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
};
```

A `502` tells the browser "the server tried to do its job but the upstream service failed." This is more useful than a generic `500` because it points to where the problem is.

## The connection to hooks

A serverless function is a hook for HTTP events. You did not write code to start a web server or listen on a port. You wrote a function and exported it. The platform calls your function when a request arrives at the matching URL.

This is the same idea as `addEventListener("click", handler)` in the browser. You do not trigger the event yourself. You register a function, and the environment calls it when the event happens. The difference is that the event is an HTTP request instead of a mouse click, and the environment is Netlify instead of the browser.

## Next steps

The `api.mjs` file in this PR returns hardcoded data. Your job is to modify it so it calls a real external API and returns that data instead. Use the try/catch pattern above to handle errors.
