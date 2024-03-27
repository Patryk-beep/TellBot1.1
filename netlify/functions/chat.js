const { OpenAIApi, Configuration } = require('openai');

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: body.message }]
    });

    const reply = response.data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'An error occurred while processing your request.' }) };
  }
};
