
import express from "express";
import ollama from "ollama";

const router = express.Router();

router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        const response = await ollama.chat({
            model: 'tinyllama',
            stream: false,
            messages: [
                {
                    role: 'system',
                    content: 'You are Aurora AI, the intelligent and helpful assistant built specifically for the Aurora task management website. Your role is to help the user organize tasks, manage projects, boost team productivity, and navigate the Aurora app. Always keep your responses friendly, concise, and focused on helping them get work done.'
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            options: {
                num_predict: 256,
                temperature: 0.7,
                num_ctx: 2048,
            }
        });

        res.json({
            reply: response.message.content
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'AI request failed' });
    }
});

export default router