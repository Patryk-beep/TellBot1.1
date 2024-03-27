document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');
    });
});

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

    fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ message })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        const generatedText = data.reply;
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

document.getElementById('send-btn').addEventListener('click', sendInputMessage);
document.getElementById('message-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendInputMessage();
    }
});

function sendInputMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    if (message !== '') {
        sendMessage(message);
        messageInput.value = '';
        stopSpeechRecognition();
    }
}

// Speech-to-text functionality
let recognition;
let recognizing = false;
let final_transcript = '';
const startButton = document.getElementById('startButton');

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function() {
        recognizing = true;
        updateStartButton(true);
    };

    recognition.onerror = function(event) {
        console.error("Speech Recognition Error:", event.error);
    };

    recognition.onend = function() {
        recognizing = false;
        updateStartButton(false);
        document.getElementById('message-input').value = final_transcript;
    };

    recognition.onresult = function(event) {
        let interim_transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        document.getElementById('message-input').value = final_transcript + interim_transcript;
    };
}

function updateStartButton(isRecording) {
    if (isRecording) {
        startButton.textContent = 'Stop Voice Recording';
        startButton.classList.add('recording');
    } else {
        startButton.textContent = 'Start Voice Input';
        startButton.classList.remove('recording');
    }
}

function stopSpeechRecognition() {
    if (recognizing) {
        recognition.stop();
    }
}

startButton.addEventListener('click', function() {
    if (recognizing) {
        recognition.stop();
    } else {
        final_transcript = '';
        recognition.start();
    }
});
