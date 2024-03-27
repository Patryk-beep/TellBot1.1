const { Configuration, OpenAIApi } = require('openai');

exports.handler = async (event) => {
    try {
        console.log("Received event:", event);
        if (!event.body) {
            throw new Error('No data received');
        }

        const body = JSON.parse(event.body);
        const openai = new OpenAIApi(new Configuration({
            apiKey: process.env.OPENAI_API_KEY
        }));

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant."
                },
                {
                    role: "user",
                    content: body.message
                }
            ]
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ reply: response.data.choices[0].message.content })
        };
    } catch (error) {
        return { statusCode: 400, body: JSON.stringify({ error: error.message }) };
    }
};
