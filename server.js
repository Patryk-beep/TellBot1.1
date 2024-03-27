const express = require('express');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const openai = new OpenAI(process.env.OPENAI_API_KEY);

app.use(express.static('public'));
app.use(express.json());

app.post('/api/send-message', async (req, res) => {
    try {
        const userMessage = req.body.message;
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Replace with your model of choice
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: userMessage }
            ],
        });

        const reply = completion.choices[0].message.content;
        res.json({ reply });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching data from OpenAI.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
