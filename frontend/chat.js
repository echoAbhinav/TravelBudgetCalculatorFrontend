document.addEventListener('DOMContentLoaded', () => {
    const chatToggle = document.getElementById('chat-toggle');
    const chatContainer = document.getElementById('chat-container');
    const minimizeBtn = document.getElementById('minimize-btn');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    const notificationBadge = document.querySelector('.notification-badge');
    const voiceBtn = document.getElementById('voice-btn');
    const botStatus = document.querySelector('.status');

    let recognition;
    let isRecording = false;

    // Initialize speech recognition
    function initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                isRecording = true;
                voiceBtn.classList.add('recording');
                userInput.placeholder = 'Listening...';
            };

            recognition.onend = () => {
                isRecording = false;
                voiceBtn.classList.remove('recording');
                userInput.placeholder = 'Type your message...';
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                userInput.value = transcript;
                if (transcript.trim()) {
                    sendMessage();
                }
            };

            recognition.onerror = (event) => {
                isRecording = false;
                voiceBtn.classList.remove('recording');
                userInput.placeholder = 'Type your message...';

                let errorMessage = '';
                switch(event.error) {
                    case 'no-speech':
                        errorMessage = 'No speech was detected. Please try again.';
                        break;
                    case 'audio-capture':
                        errorMessage = 'No microphone was found. Ensure it is plugged in and enabled.';
                        break;
                    case 'not-allowed':
                        errorMessage = 'Microphone permission was denied. Please enable it in your browser settings.';
                        break;
                    default:
                        errorMessage = 'An error occurred with the speech recognition.';
                }
                addMessage(errorMessage, false);
            };

            return true;
        }
        return false;
    }

    // Add message to chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Send message to backend
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessage(message, true);
        userInput.value = '';

        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingIndicator.appendChild(dot);
        }
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch('http://127.0.0.1:3000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Remove typing indicator
            chatMessages.removeChild(typingIndicator);

            // Add bot response
            addMessage(data.message, false);
        } catch (error) {
            // Remove typing indicator
            chatMessages.removeChild(typingIndicator);

            // Show error message
            addMessage('Sorry, I encountered an error. Please try again later.', false);
            console.error('Error:', error);
        }
    }

    // Voice button click handler
    voiceBtn.addEventListener('click', () => {
        if (isRecording) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });

    // Send button click handler
    sendButton.addEventListener('click', sendMessage);

    // Input keypress handler
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Quick action buttons
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            userInput.value = btn.dataset.message;
            sendMessage();
        });
    });

    // Initialize chat as active
    chatContainer.classList.add('active');

    // Toggle chat visibility with animation
    function toggleChat() {
        chatContainer.classList.toggle('active');
        if (chatContainer.classList.contains('active')) {
            notificationBadge.style.display = 'none';
            setTimeout(() => userInput.focus(), 300);
        }
    }

    chatToggle.addEventListener('click', () => {
        toggleChat();
        if (chatContainer.classList.contains('active')) {
            userInput.focus();
        }
    });

    minimizeBtn.addEventListener('click', toggleChat);

    // Welcome message
    addMessage("Hi! I'm your AI assistant. How can I help you today?", false);

    if (!initSpeechRecognition()) {
        voiceBtn.style.display = 'none';
        addMessage('Speech recognition is not supported in your browser. Please use Chrome for voice input.', false);
    }
});