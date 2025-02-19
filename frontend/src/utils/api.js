import { auth } from '../config/firebase';

async function getAuthHeader() {
  const token = await auth.currentUser?.getIdToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function apiRequest(endpoint, options = {}) {
  const headers = await getAuthHeader();
  
  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return response.json();
} 