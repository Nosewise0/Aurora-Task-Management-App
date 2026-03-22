const express = require('express');
const router = express.Router();
const openai = require('../config/openai');

router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are Aurora AI, a helpful task management assistant." },
                { role: "user", content: message }
            ],
            max_tokens: 500,
        });

        const aiMessage = response.choices[0].message.content;
        res.json({ reply: aiMessage });

    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ error: 'Failed to get AI response' });
    }
});

module.exports = router;
