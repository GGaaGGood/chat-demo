// auth.js
// Handles user authentication: login, logout, and token management

import { apiBaseUrl } from './config.js';

/**
 * Attempt to log in with the provided credentials.
 * On success, stores token and username in localStorage and returns the user object.
 * On failure, throws an Error with the message from the server or a default message.
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ token: string, username: string }>} user session info
 */
export async function login(username, password) {
  const response = await fetch(`${apiBaseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || 'Login failed';
    throw new Error(message);
  }

  const { token, username: user } = await response.json();
  localStorage.setItem('token', token);
  localStorage.setItem('username', user);
  return { token, username: user };
}

/**
 * Clears the stored authentication information and redirects to login page.
 */
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.href = 'login.html';
}

/**
 * Get the stored auth token, or null if not logged in.
 * @returns {string | null}
 */
export function getToken() {
  return localStorage.getItem('token');
}

/**
 * Get the stored username, or null if not logged in.
 * @returns {string | null}
 */
export function getUsername() {
  return localStorage.getItem('username');
}

/**
 * Checks if user is logged in; if not, redirects to login page.
 */
export function ensureAuthenticated() {
  const token = getToken();
  if (!token) {
    window.location.href = 'login.html';
  }
}
