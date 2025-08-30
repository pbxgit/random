// api/generateIntegers.js
export default async function handler(req, res) {
  try {
    const { min = 1, max = 6, n = 1 } = req.query;

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
          replacement: true
        },
        id: 42
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    return res.status(200).json({ numbers: data.result.random.data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
