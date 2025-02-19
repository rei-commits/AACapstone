import { auth } from '../config/firebase';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',  // Remove /api since it's included in the URL
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add request interceptor to handle errors
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default api;

class ApiService {
  constructor() {
    this.baseUrl = 'http://localhost:8080/api';  // Change to 8080 to match your backend
  }

  async getAuthHeader() {
    const token = await auth.currentUser?.getIdToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  async healthCheck() {
    const response = await fetch(`${this.baseUrl}/bills/health`);
    if (!response.ok) {
      throw new Error('Server is not responding');
    }
    return response.text();
  }

  async uploadReceipt(formData) {
    const url = `${this.baseUrl}/bills/scan`;
    console.log('Uploading to:', url);
    
    try {
        const headers = await this.getAuthHeader();
        delete headers['Content-Type']; // Let browser set correct content type for FormData
        
        console.log('Headers:', headers);
        
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: formData
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Server error: ${error}`);
        }

        return response.json();
    } catch (error) {
        console.error('Upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
    }
  }

  async createBill(billData) {
    try {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error('No user logged in');

        // Transform the data to match backend expectations
        const transformedData = {
            name: billData.name || "Dinner Split",
            tax: parseFloat(billData.tax),
            tip: parseFloat(billData.tip),
            items: billData.items.map(item => ({
                name: item.name,
                price: parseFloat(item.price),
                quantity: 1,
                assignedUserUids: [uid] // For now, assign to current user
            })),
            participants: [{
                userUid: uid,
                amount: parseFloat(billData.total),
                paid: false
            }]
        };

        console.log('Sending bill data:', transformedData); // Debug log

        const response = await axios.post(
            `${this.baseUrl}/bills?uid=${uid}`,
            transformedData,
            {
                headers: await this.getAuthHeader()
            }
        );

        return response.data;
    } catch (error) {
        console.error('Create bill error:', error.response?.data || error);
        throw error;
    }
  }

  async getUserBills() {
    const response = await fetch(`${this.baseUrl}/bills`, {
      headers: await this.getAuthHeader(),
    });

    if (!response.ok) throw new Error('Failed to fetch bills');
    return response.json();
  }

  async getFriends() {
    const response = await fetch(`${this.baseUrl}/users/me/friends`, {
      headers: await this.getAuthHeader(),
    });

    if (!response.ok) throw new Error('Failed to fetch friends');
    return response.json();
  }

  async addFriend(friendUid) {
    const response = await fetch(`${this.baseUrl}/users/me/friends`, {
      method: 'POST',
      headers: await this.getAuthHeader(),
      body: JSON.stringify({ friendUid }),
    });

    if (!response.ok) throw new Error('Failed to add friend');
    return response.json();
  }

  async deactivateAccount() {
    const response = await fetch(`${this.baseUrl}/users/me`, {
      method: 'DELETE',
      headers: await this.getAuthHeader(),
    });

    if (!response.ok) throw new Error('Failed to deactivate account');
    return response.json();
  }

  async createGroup(name, memberIds) {
    console.log('Creating group:', { name, memberIds });
    const headers = await this.getAuthHeader();
    const response = await fetch(`${this.baseUrl}/groups`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, memberIds })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Group creation failed:', error);
      throw new Error(error);
    }

    return response.json();
  }

  async deleteBill(billId) {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('No user logged in');

    try {
        await api.delete(`/api/bills/${billId}?uid=${uid}`);
    } catch (error) {
        console.error('Error deleting bill:', error);
        throw error;
    }
  }
}

export const apiService = new ApiService(); 