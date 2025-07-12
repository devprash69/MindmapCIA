require("dotenv").config()
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: 'Missing topic' });
  }
  const API_KEY = process.env.OPENROUTER_API_KEY;
  const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
  const MODEL = 'deepseek/deepseek-chat';

  const prompt = `Create a structured mind map on the topic: '${topic}' with 6 headings and 3 short subpoints each. Return only JSON: [ { heading: '', subpoints: ['', '', ''] }, ... ]`;

  try {
    const openrouterRes = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'X-Title': 'Mind Map Generator'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });
    const data = await openrouterRes.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch mind map' });
  }
} 
