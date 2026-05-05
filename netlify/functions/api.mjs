/**
 * Serverless API proxy
 */

/**
 * Parses a range string (e.g., "10 - 12 years") and returns an array of two numbers.
 * @param {string} rangeString - The range string to parse.
 * @returns {[number|null, number|null]} An array with the min and max values, or nulls if not found.
 */
function parseRange(rangeString) {
  // "10 - 12 years" → [10, 12]
  // "3 - 6" → [3, 6]
  if (!rangeString) return [null, null];
  const numbers = rangeString.match(/\d+(\.\d+)?/g);
  if (!numbers || numbers.length < 2) return [null, null];
  return [Number(numbers[0]), Number(numbers[1])];
}

/**
 * Determines the size category (small, medium, large) from a weight range string in kg.
 * @param {string} weightKg - The weight range string in kilograms (e.g., "3 - 6").
 * @returns {string} The size category: "small", "medium", "large", or "unknown".
 */
function sizeFromWeight(weightKg) {
  // weight in kg → size category
  const [min, max] = parseRange(weightKg);
  if (max === null) return 'unknown';
  const avg = (min + max) / 2;
  if (avg < 10) return 'small';
  if (avg < 25) return 'medium';
  return 'large';
}

/**
 * Transforms a breed object from the Dog API into the shape expected by the frontend.
 * @param {Object} breed - The breed object from the Dog API.
 * @returns {Object} The transformed breed object.
 */
function transformBreed(breed) {
  return {
    id: String(breed.id),
    name: breed.name,
    image: breed.image?.url || '',
    imageAlt: `Photo of ${breed.name}`,
    temperament: (breed.temperament || '').split(', ').filter(Boolean),
    lifeSpan: parseRange(breed.life_span),
    size: sizeFromWeight(breed.weight?.metric),
    breedGroup: breed.breed_group || 'Unknown',
    origin: breed.origin || 'Unknown',
  };
}

/**
 * Netlify serverless function handler for the Dog API proxy.
 * Fetches breed data from the Dog API, transforms it, and returns JSON.
 * @returns {Promise<Response>} The HTTP response with transformed breed data or error message.
 */
export default async function handler() {
  try {
    const response = await fetch('https://api.thedogapi.com/v1/breeds/', {
      headers: { 'x-api-key': process.env.DOG_API_KEY },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'API request failed' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const breeds = await response.json();
    const transformed = breeds.map(transformBreed);
    return new Response(JSON.stringify(transformed), {
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
