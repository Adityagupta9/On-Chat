const socket = io("https://accessible-bubble-guavaberry.glitch.me/");
const form = document.getElementById('send-form');
const messageInput = document.getElementById('message-input');
const imageInput = document.getElementById('image-input');
const videoInput = document.getElementById('video-input');
const messageContainer = document.querySelector('.container');
const userCountDisplay = document.getElementById('user-count-number');

// Retrieve the username from localStorage
const userName = localStorage.getItem('username');
if (userName) {
    socket.emit('new-user-joined', userName);
}

    var audioSend = new Audio('send.mp3');
    var audioReceive = new Audio('receive.mp3');
    var audioLog = new Audio('log.mp4');    

const append = (name, message, position, isImage = false, isVideo = false) => {
    const messageWrapper = document.createElement('div');
    const messageElement = document.createElement('div');
    const messageContent = document.createElement('p');
    const messageName = document.createElement('span');

    messageName.innerText = name;
    messageName.classList.add('message-name');

    if (isImage) {
        const imageElement = document.createElement('img');
        imageElement.src = message;
        imageElement.classList.add('message-image');
        messageContent.appendChild(imageElement);
    } else if (isVideo) {
        const videoElement = document.createElement('video');
        videoElement.src = message;
        videoElement.setAttribute('controls', true);
        videoElement.classList.add('message-video');
        messageContent.appendChild(videoElement);
    } else {
        messageContent.innerText = message;
    }
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
    messageContainer.scrollTop = messageContainer.scrollHeight;

    if (position === "left") {
        audioReceive.play();
    } else if (position === 'right') {
        audioSend.play();
    } else if (position === 'center') {
        audioLog.play();
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

// Listen for image messages
socket.on('received-image', data => {
    append(`~${data.name}`, data.image, "left", true);
});

// Listen for video messages
socket.on('received-video', data => {
    append(`~${data.name}`, data.video, "left", false, true);
});

// Listen for users leaving
socket.on('left', name => {
    append(`${name}`,` left the chat`, 'center');
});

// Send message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append('~You', message, "right");
    socket.emit('send-message', message);
    messageInput.value = '';
});

// Handle image selection
imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            append('~You', base64String, "right", true);
            socket.emit('send-image', { image: base64String });
        };
        reader.readAsDataURL(file);
    }
});

// Handle video selection
videoInput.addEventListener('change', () => {
    const file = videoInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            append('~You', base64String, "right", false, true);
            socket.emit('send-video', { video: base64String });
        };
        reader.readAsDataURL(file);
    }
});

const updateUserCount = (count) => {
    // Update the user count displayed
    document.getElementById('user-count-number').innerText =`Online ${count}` ;
};


// Listen for user count updates
socket.on('user-count', count => {
    updateUserCount(count);
});