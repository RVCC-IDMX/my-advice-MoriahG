/**
 * Netlify function handler that proxies a request to TheDogAPI to fetch
 * a single image for a given breed id.
 * Expects a query param `breedId` and returns the first image object or an empty object.
 * @param {Request} req - Incoming request object (platform request-like API)
 * @returns {Response} JSON response with image data or an error shape
 */
export default async function handler(req) {
  // Extract ?breedId=XXX from the request URL
  const url = new URL(req.url);
  const breedId = url.searchParams.get('breedId');

  if (!breedId) {
    return new Response(JSON.stringify({ error: 'Missing breedId' }), {
      status: 400,
    });
  }

  try {
    const response = await fetch(
      `https://api.thedogapi.com/v1/images/search?breed_id=${breedId}&limit=1`,
      {
        headers: { 'x-api-key': process.env.DOG_API_KEY },
      }
    );
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'API image request failed' }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data[0] || {}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
