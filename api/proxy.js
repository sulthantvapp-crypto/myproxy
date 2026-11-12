export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const targetUrl = req.query.url;
    if (!targetUrl) {
      return res.status(400).json({ error: 'URL parameter is missing' });
    }

    // എല്ലാ വെബ്‌സൈറ്റുകളിലേക്കും ഒരു ഒറിജിനൽ ബ്രൗസർ പോലെ റിക്വസ്റ്റ് അയക്കാൻ
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      redirect: 'follow',
    });

    const contentType = response.headers.get('content-type') || '';
    const body = await response.arrayBuffer();

    res.setHeader('Content-Type', contentType);
    
    // എല്ലാ സുപ്രധാന ഹെഡേഴ്സും ഫോർവേഡ് ചെയ്യാൻ
    response.headers.forEach((value, key) => {
      if (!['content-encoding', 'transfer-encoding'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    return res.status(response.status).send(Buffer.from(body));
  } catch (err) {
    return res.status(500).json({ error: 'Universal Proxy failed', details: err.message });
  }
}
