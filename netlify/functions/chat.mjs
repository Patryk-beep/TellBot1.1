const OpenAI = require('openai');

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const message = body.message;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.ChatCompletion.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }]
    });

    // Extracting the reply from OpenAI's response
    const reply = response.data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: reply })
    };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'An error occurred while processing your request.' }) };
  }
};
