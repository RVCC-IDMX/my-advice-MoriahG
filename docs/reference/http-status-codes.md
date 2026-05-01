# HTTP status codes quick reference

Every HTTP response includes a three-digit status code. The first digit tells you the category.

## Status code categories

- **1xx Informational** — request received, processing continues (rare in browser fetch)
- **2xx Success** — request succeeded
- **3xx Redirection** — further action needed (browsers follow these automatically)
- **4xx Client error** — something wrong with your request
- **5xx Server error** — the server failed to fulfill a valid request

## Common codes you will see

### Success (2xx)

- **200 OK** — standard successful response
- **201 Created** — a new resource was created (common after POST requests)

### Redirection (3xx)

- **301 Moved Permanently** — resource has a new URL forever
- **302 Found** — resource temporarily at a different URL

### Client errors (4xx)

- **400 Bad Request** — malformed request (bad query params, invalid JSON body)
- **401 Unauthorized** — missing or invalid authentication (API key, token)
- **403 Forbidden** — you authenticated but lack permission
- **404 Not Found** — the resource does not exist (typo in URL, deleted endpoint)
- **429 Too Many Requests** — you hit the API's rate limit; check the `Retry-After` header for how long to wait

### Server errors (5xx)

- **500 Internal Server Error** — generic server-side failure
- **502 Bad Gateway** — a proxy or serverless function got a bad response from the upstream API
- **503 Service Unavailable** — server is overloaded or down for maintenance

## The key insight about fetch

`fetch()` only rejects its promise on **network failures** — DNS errors, going offline, or CORS blocks. A 404 or 500 response is still a successful HTTP round-trip, so fetch resolves normally. You **must** check `response.ok` yourself.

```js
async function fetchData(url) {
  const response = await fetch(url);

  if (!response.ok) {
    /* response.ok is false for any status outside 200-299 */
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
```
