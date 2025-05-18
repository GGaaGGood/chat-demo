// chat.js
// Handles loading, posting, and deleting chat messages

import { apiBaseUrl } from './config.js';
import { getToken, getUsername, ensureAuthenticated, logout } from './auth.js';

// Ensure the user is authenticated before doing anything
ensureAuthenticated();

const token = getToken();
const username = getUsername();

const messagesDiv = document.getElementById('messages');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const logoutBtn = document.getElementById('logoutBtn');

// Attach logout handler if logout button exists
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    logout();
  });
}

/**
 * Fetch and render all messages
 */
export async function loadMessages() {
  try {
    const res = await fetch(`${apiBaseUrl}/messages?token=${token}`);
    if (!res.ok) throw new Error('Failed to load messages');
    const msgs = await res.json();

    // Clear existing messages
    messagesDiv.innerHTML = '';

    // Append each message
    msgs.forEach(m => {
      const msgEl = document.createElement('div');
      msgEl.className = 'message';
      msgEl.innerHTML = `<strong>${m.user}:</strong> <span class="text">${m.text}</span>`;

      // If current user is Gavin, add delete button
      if (username === 'Gavin') {
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.textContent = 'Delete';
        delBtn.onclick = () => deleteMessage(m.id);
        msgEl.appendChild(delBtn);
      }

      messagesDiv.appendChild(msgEl);
    });

    // Scroll to bottom
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Post a new message to the server
 * @param {string} text
 */
export async function postMessage(text) {
  if (!text) return;
  try {
    const res = await fetch(`${apiBaseUrl}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, text })
    });
    if (!res.ok) throw new Error('Failed to send message');
    messageInput.value = '';
    loadMessages();
  } catch (err) {
    console.error(err);
  }
}

/**
 * Delete a message by its ID (Gavin only)
 * @param {number|string} id
 */
export async function deleteMessage(id) {
  try {
    const res = await fetch(`${apiBaseUrl}/messages/${id}?token=${token}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Delete failed');
    loadMessages();
  } catch (err) {
    console.error(err);
  }
}

// Event listener for the chat form submission
chatForm.addEventListener('submit', e => {
  e.preventDefault();
  postMessage(messageInput.value.trim());
});

// Initial load and polling every 3 seconds
loadMessages();
setInterval(loadMessages, 3000);
