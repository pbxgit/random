// api/generateIntegers.js
export default async function handler(req, res) {
  try {
    // CHANGE 1: Read the 'replacement' parameter from the request query.
    // It defaults to 'true' if not provided.
    const { min = 1, max = 6, n = 1, replacement = 'true' } = req.query;

    // Use your RANDOM.ORG API key stored in environment variables
    const apiKey = process.env.RANDOM_ORG_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing RANDOM_ORG_API_KEY in Vercel environment." });
    }

    const response = await fetch("https://api.random.org/json-rpc/4/invoke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "generateIntegers",
        params: {
          apiKey: apiKey,
          n: parseInt(n),
          min: parseInt(min),
          max: parseInt(max),
          // CHANGE 2: Convert the string 'true' or 'false' from the query into a real boolean.
          replacement: replacement === 'true'
        },
        id: 42
      })
    });

    const data = await response.json();

    if (data.error) {
      // Provide a more specific error message from the API if available
      const errorMessage = data.error.message || "An error occurred with the RANDOM.ORG API.";
      return res.status(500).json({ error: errorMessage });
    }

    return res.status(200).json({ numbers: data.result.random.data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
