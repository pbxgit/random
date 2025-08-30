export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.random.org/json-rpc/4/invoke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "generateIntegers",
        params: {
          apiKey: process.env.RANDOM_API_KEY, // from Vercel env vars
          n: 1, // how many numbers
          min: 0,
          max: 1, // change max for larger ranges
          replacement: true
        },
        id: 1
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const randomNumber = data.result.random.data[0];
    res.status(200).json({ number: randomNumber });

  } catch (err) {
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
}
