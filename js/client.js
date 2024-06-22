const socket = io("https://accessible-bubble-guavaberry.glitch.me/");

const form = document.getElementById('send-form');
const messageInput = document.getElementById('message-input');
const messageContainer = document.querySelector('.container');

// Retrieve the username from localStorage
const userName = localStorage.getItem('username');
if (userName) {
    socket.emit('new-user-joined', userName);
}

var audio = new Audio('recive.mp3');
var audio2 = new Audio('log.mp4');
var audio3 = new Audio('send.mp3')
 
const append = (name, message, position) => {
    const messageWrapper = document.createElement('div');
    const messageElement = document.createElement('div');
    const messageContent = document.createElement('p');
    const messageName = document.createElement('span');

    messageName.innerText = name;
    messageName.classList.add('message-name');

    messageContent.innerText = message;
    messageContent.classList.add('message-content');

    messageElement.classList.add('message', position);
    messageElement.append(messageName);
    messageElement.append(messageContent);

    messageWrapper.classList.add('message-wrapper', position);
    if (position === "left") {
        const profilepic = document.createElement('img');
        profilepic.src = "./profilepic.jpg";
        profilepic.classList.add("profilepic");
        messageWrapper.append(profilepic);
    }
    messageWrapper.append(messageElement);

    messageContainer.append(messageWrapper);

    // Scroll to the latest message
    messageWrapper.scrollIntoView({ behavior: 'smooth' });

    if (position === "left" ) {
        audio.play();
    }
    if(position=="center"){
        audio2.play();
    }
    if(position=="right"){
        audio3.play();
    }
};

// Listen for user joined
socket.on('user-joined', name => {
    append(`${name}`, ` has joined`, 'center');
});

// Listen for messages
socket.on('received-message', data => {
    append(`~${data.name}`, data.message, "left");
});

// Listen for users leaving
socket.on('left', name => {
    append(`${name}`, ` left the chat`, 'center');
});

// Send message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append('~You', message, "right");
    socket.emit('send-message', message);
    messageInput.value = '';
});
