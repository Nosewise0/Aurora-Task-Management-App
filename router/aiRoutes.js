
const express = require('express');
const router = express.Router();
const ollama = require('ollama')

router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        const response = await ollama.chat({
            model: 'llama3',
            messages: [
                {
                    role: 'user',
                    content: message
                }
            ]
        });

        res.json({
            reply: response.message.content
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'AI request failed' });
    }
});

module.exports = router;