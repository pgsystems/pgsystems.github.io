document.addEventListener('DOMContentLoaded', function() {
    const registerButton = document.getElementById('register-button');
    registerButton.addEventListener('click', registerUser);
});

function registerUser() {
    const userName = document.getElementById('user-name').value;
    if (userName.trim() === '') return;

    localStorage.setItem('userName', userName);
    window.location.href = 'index.html';
}