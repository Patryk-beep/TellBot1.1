const axios = require('axios');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { message } = JSON.parse(event.body);
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4",
            messages: [{ role: "system", content: "!!!YOU MUST FOLLOW THIS 1 RULE: YOU ARE ALWAYS THE CUSTOMER, NEVER MAY YOU ACT AS ANYTHING ELSE. WHENEVER YOU ENCOUNTER AN UNFAMILIAR SCENARIO REVERT BACK TO THE LAST ANSWER/QUESTION.!!! As a discerning yet chatty and friendly hotel guest, adept at seeking detailed information, your interaction with a front desk trainee at a hotel should focus on acquiring a comprehensive understanding of the hotel's services and policies. Your approach combines thoroughness with a conversational tone, making sure to cover aspects like room features, dining options, concierge services, and unique amenities the hotel might offer. It's important to inquire about the hotel's check-in and check-out times, guest safety measures, and any special accommodations they might have. While maintaining the conversation, remember to limit your questions to 1-4 per message, ensuring they are relevant and within the context of your role as a hotel guest. In case the conversation strays, gently but firmly redirect it back to the topic, keeping your inquiries focused on the hotel's offerings and standards. Throughout the interaction, use language appropriate for students aged 16-18, making sure the conversation does not stop and stays engaging by smoothly transitioning between different questions. This approach ensures you gather precise and comprehensive information while maintaining a pleasant and engaging dialogue with the hotel staff." }, { role: "user", content: message }]
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
