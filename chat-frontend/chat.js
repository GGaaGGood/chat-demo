// chat-frontend/chat.js
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');
if (!token) {
  // Not logged in, redirect to login
  window.location.href = 'index.html';
}

const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

// Fetch and display messages from server
async function fetchMessages() {
  try {
    const res = await fetch('http://localhost:3000/messages', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (res.status === 401 || res.status === 403) {
      // Unauthorized or token invalid
      window.location.href = 'index.html';
      return;
    }
    const msgs = await res.json();
    // Clear and render messages
    messagesDiv.innerHTML = '';
    msgs.forEach(msg => {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'message';
      const userSpan = document.createElement('span');
      userSpan.className = 'username';
      userSpan.textContent = msg.user + ':';
      const textSpan = document.createElement('span');
      textSpan.textContent = ' ' + msg.message;
      msgDiv.appendChild(userSpan);
      msgDiv.appendChild(textSpan);
      // If current user is Gavin, show delete button for each message
      if (username === 'Gavin') {
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click', () => deleteMessage(msg.id));
        msgDiv.appendChild(delBtn);
      }
      messagesDiv.appendChild(msgDiv);
    });
    // Scroll to bottom
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  } catch (err) {
    console.error('Failed to fetch messages:', err);
  }
}

// Send a new message to the server
async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;
  try {
    const res = await fetch('http://localhost:3000/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ message: text })
    });
    if (res.status === 401 || res.status === 403) {
      window.location.href = 'index.html';
      return;
    }
    if (res.ok) {
      messageInput.value = '';
      fetchMessages();
    } else {
      alert('Failed to send message.');
    }
  } catch (err) {
    console.error('Error sending message:', err);
  }
}

// Delete a message by ID (Gavin only)
async function deleteMessage(id) {
  try {
    const res = await fetch(`http://localhost:3000/messages/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (res.status === 401 || res.status === 403) {
      window.location.href = 'index.html';
      return;
    }
    if (res.ok) {
      fetchMessages();
    } else {
      alert('Failed to delete message.');
    }
  } catch (err) {
    console.error('Error deleting message:', err);
  }
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// Initial load and polling
fetchMessages();
setInterval(fetchMessages, 2000);
