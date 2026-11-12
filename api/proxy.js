export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const targetUrl = req.query.url;
    if (!targetUrl) {
      return res.status(400).json({ error: 'URL parameter is missing' });
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://einthusan.tv/',
      },
    });

    const contentType = response.headers.get('content-type') || '';
    const body = await response.arrayBuffer();

    res.setHeader('Content-Type', contentType);
    return res.status(response.status).send(Buffer.from(body));
  } catch (err) {
    return res.status(500).json({ error: 'Proxy failed', details: err.message });
  }
}
