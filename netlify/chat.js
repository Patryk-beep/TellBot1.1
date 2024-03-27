const { Configuration, OpenAIApi } = require("openai");

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

    const completion = await openai.chat.completions.create({
      messages: body.messages,
      model: "gpt-3.5-turbo",
    });

    return {
      statusCode: 200,
      body: JSON.stringify(completion)
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.toString() }) };
  }
};
