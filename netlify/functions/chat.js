const axios = require('axios');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { message } = JSON.parse(event.body);
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: "Assume the role of a discerning hotel guest, adept at seeking detailed information. You're interacting with a front desk trainee at a hotel. Your queries should be specifically about the hotel's services, such as room features, dining options, concierge services, and any unique amenities. Also, inquire about the hotel's policies regarding check-in and check-out times, guest safety, and special accommodations. If the conversation veers off these topics, gently but firmly redirect it back, maintaining a focus on extracting precise and comprehensive information about the hotel's offerings and standards." }, { role: "user", content: message }]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ reply: response.data.choices[0].message.content })
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.toString() }) };
    }
};
