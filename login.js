// chat-frontend/login.js
// Redirect to chat if already logged in
if (localStorage.getItem('token')) {
  window.location.href = 'chat.html';
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  try {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.token) {
      // Store token and username in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', username);
      window.location.href = 'chat.html';
    } else {
      alert(data.error || 'Login failed');
    }
  } catch (err) {
    alert('Unable to connect to server.');
  }
});
