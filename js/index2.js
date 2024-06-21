document.getElementById('user-name-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const userName = document.getElementById('username-input').value;
    if (userName) {
        localStorage.setItem('username', userName);
        window.location.href = 'main.html'; // Navigate to chat page
    } else {
        alert('Please enter your name.');
    }
});
