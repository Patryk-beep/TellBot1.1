function createMessageElement(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    const messageContentDiv = document.createElement('div');
    messageContentDiv.classList.add('message-content');
    messageContentDiv.textContent = message;
    messageDiv.appendChild(messageContentDiv);
    return messageDiv;
}

function sendMessage(message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = createMessageElement(message, 'current-user');
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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' // Replace with your actual OpenAI API Key
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }]
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        const generatedText = data.choices[0].message.content;
        const replyElement = createMessageElement(generatedText, 'other-user');
        chatMessages.appendChild(replyElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    })
    .catch(error => {
        console.error("Error:", error);
        const errorMessageElement = createMessageElement('An error occurred while fetching data.', 'other-user');
        chatMessages.appendChild(errorMessageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

document.getElementById('send-btn').addEventListener('click', () => {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    if (message !== '') {
        sendMessage(message);
        messageInput.value = '';
    }
});

document.getElementById('message-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();
        if (message !== '') {
            sendMessage(message);
            messageInput.value = '';
        }
    }
});
