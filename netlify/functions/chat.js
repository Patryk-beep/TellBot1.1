const { Configuration, OpenAIApi } = require("openai");

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const message = body.message;

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
          content: message
        }
      ]
    });

    // Log a more detailed message for easier debugging.
    console.log("OpenAI response: ", response.data);

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: response.data.choices[0].message.content })
    };
  } catch (error) {
    const errorMessage = error.message;
    console.error(`Error in serverless function: ${errorMessage}`);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage })
    };
  }
};