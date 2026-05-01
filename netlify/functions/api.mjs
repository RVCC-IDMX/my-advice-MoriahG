/**
 * Serverless API proxy — starter function
 *
 * This function works right now. Run `netlify dev` and visit:
 *   http://localhost:8888/.netlify/functions/api
 *
 * You will see JSON data in the browser — three dog breeds from the
 * Dog API (the same API you used in hap-fetch). The data is hardcoded
 * so you can see the full serverless function lifecycle without needing
 * an external API yet.
 *
 * Your job in Part 1: Replace the hardcoded data below with a real
 * fetch call to your project's API. See docs/tutorials/your-first-serverless-function.md
 * for a walkthrough.
 */

export default async () => {
  try {
    /**
     * TODO: Replace this hardcoded data with a fetch to your API.
     *
     * Example:
     *   const response = await fetch("https://your-api-url.com/endpoint");
     *   if (!response.ok) {
     *     return new Response(JSON.stringify({ error: "API request failed" }), {
     *       status: 502,
     *       headers: { "Content-Type": "application/json" },
     *     });
     *   }
     *   const json = await response.json();
     *
     * Then transform `json` into the shape your views expect
     * and return it below instead of `sampleData`.
     */

    const sampleData = {
      data: [
        {
          id: "036feed0-da8a-42c9-ab9a-57449b530b13",
          type: "breed",
          attributes: {
            name: "Affenpinscher",
            description:
              "The Affenpinscher is a small and playful breed of dog that was originally bred in Germany for hunting small game. They are intelligent, energetic, and affectionate, and make excellent companion dogs.",
            life: {
              max: 16,
              min: 14,
            },
            male_weight: {
              max: 5,
              min: 3,
            },
            female_weight: {
              max: 5,
              min: 3,
            },
            hypoallergenic: true,
          },
          relationships: {
            group: {
              data: {
                id: "f56dc4b1-ba1a-4454-8ce2-bd5d41404a0c",
                type: "group",
              },
            },
          },
        },
        {
          id: "dd9362cc-52e0-462d-b856-fccdcf24b140",
          type: "breed",
          attributes: {
            name: "Afghan Hound",
            description:
              "The Afghan Hound is a large and elegant breed of dog that was originally bred in Afghanistan for hunting small game. They are intelligent, independent, and athletic, and make excellent companion dogs.",
            life: {
              max: 14,
              min: 12,
            },
            male_weight: {
              max: 27,
              min: 23,
            },
            female_weight: {
              max: 25,
              min: 20,
            },
            hypoallergenic: false,
          },
          relationships: {
            group: {
              data: {
                id: "be0147df-7755-4228-b132-2518c0c6d10d",
                type: "group",
              },
            },
          },
        },
        {
          id: "1460844f-841c-4de8-b788-271aa4d63224",
          type: "breed",
          attributes: {
            name: "Airedale Terrier",
            description:
              "The Airedale Terrier is a large and powerful breed of dog that was originally bred in England for hunting small game. They are intelligent, energetic, and determined, and make excellent hunting dogs.",
            life: {
              max: 14,
              min: 12,
            },
            male_weight: {
              max: 23,
              min: 20,
            },
            female_weight: {
              max: 20,
              min: 18,
            },
            hypoallergenic: false,
          },
          relationships: {
            group: {
              data: {
                id: "1bbf373b-1937-4e73-9863-45385daa4979",
                type: "group",
              },
            },
          },
        },
      ],
      meta: {
        pagination: {
          current: 1,
          next: 2,
          last: 95,
          records: 283,
        },
      },
      links: {
        self: "https://dogapi.dog/api/v2/breeds?page[number]=1&page[size]=3",
        current:
          "https://dogapi.dog/api/v2/breeds?page[number]=1&page[size]=3",
        next: "https://dogapi.dog/api/v2/breeds?page[number]=2&page[size]=3",
        last: "https://dogapi.dog/api/v2/breeds?page[number]=95&page[size]=3",
      },
    };

    return new Response(JSON.stringify(sampleData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
};
