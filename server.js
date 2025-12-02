// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Node 18+ includes global fetch. If you're on older Node, install node-fetch and import it.

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend
app.use(express.static('public'));

const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY;
// Default voice: "Rachel" (reliable). Change later if you like.
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

// POST /speak -> returns MP3 audio of the provided text
app.post('/speak', async (req, res) => {
  try {
    const { text, voice_id } = req.body || {};
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Missing required field: text' });
    }
    const vid = voice_id || DEFAULT_VOICE_ID;

    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${vid}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVEN_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text,
        // Model can be changed; this is a solid default
        model_id: 'eleven_multilingual_v2'
      })
    });

    if (!r.ok) {
      const errTxt = await r.text();
      return res.status(r.status).send(errTxt);
    }

    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(buf);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Text-to-speech failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server ready → http://localhost:${PORT}`);
});
