// const socket = io('https://localhost:8000');
const socket = io("https://accessible-bubble-guavaberry.glitch.me/")

const form = document.getElementById('send-form');
const messageInput = document.getElementById('message-input');
const messageContainer = document.querySelector('.container');

// Retrieve the username from localStorage
const userName = localStorage.getItem('username');
if (userName) {
    socket.emit('new-user-joined', userName);
}

var audio = new Audio('send.mp3');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position === "left" || position === "center") {
        audio.play();
    }
};

// Listen for user joined
socket.on('user-joined', name => {
    append(`${name} has joined`, 'center');
});

// Listen for messages
socket.on('received-message', data => {
    append(`${data.name}: ${data.message}`, "left");
});

// Listen for users leaving
socket.on('left', name => {
    append(`${name} left the chat`, "center");
});

// Send message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, "right");
    socket.emit('send-message', message);
    messageInput.value = '';
});
