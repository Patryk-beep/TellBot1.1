const { Configuration, OpenAIApi } = require('openai');

exports.handler = async (event) => {
  try {
    // Check if event.body is present
    if (!event.body) {
      throw new Error('No data received');
    }

    // Safely parsing JSON
    const body = JSON.parse(event.body);

    // Initialize OpenAI
    const openai = new OpenAIApi(new Configuration({
      apiKey: process.env.OPENAI_API_KEY
    }));

    // OpenAI Chat Completion call
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // Or your preferred model
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
    // Error handling for JSON parsing and other issues
    return { statusCode: 400, body: JSON.stringify({ error: error.message }) };
  }
};
