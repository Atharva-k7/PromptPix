// 🟢 Startup log
console.log('🟢 Starting server...');

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Check if API key is loaded
if (!process.env.UNSPLASH_KEY) {
  console.error('❌ UNSPLASH_KEY is missing from .env');
  process.exit(1); // Stop the server
}

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  console.log('📩 Prompt received:', prompt);

  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: { query: prompt },
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_KEY}` }
    });

    if (response.data.results.length === 0) {
      console.warn('⚠️ No images found for prompt:', prompt);
      return res.status(404).json({ error: 'No images found' });
    }

    const imageUrl = response.data.results[0].urls.full;
    console.log('🖼️ Image URL:', imageUrl);
    res.json({ imageUrl });
  } catch (error) {
    console.error('❌ Error calling Unsplash:', error.message);
    res.status(500).json({ error: 'Image generation failed' });
  }
});

app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});