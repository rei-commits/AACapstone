// API Configuration
const API_BASE_URL = 'http://localhost:8081/api';

// User API calls
export const userApi = {
    login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        return await response.json();
    },

    register: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        return await response.json();
    },

    getUser: async (id) => {
        const response = await fetch(`${API_BASE_URL}/users/${id}`);
        return await response.json();
    },

    searchUsers: async (query) => {
        const response = await fetch(`${API_BASE_URL}/users/search?query=${encodeURIComponent(query)}`);
        return await response.json();
    },

    getUserByEmail: async (email) => {
        const response = await fetch(`${API_BASE_URL}/users/email/${encodeURIComponent(email)}`);
        if (!response.ok) {
            throw new Error('User not found');
        }
        return response.json();
    },
};

// Group API calls
export const groupApi = {
    createGroup: async (groupData) => {
        const response = await fetch(`${API_BASE_URL}/groups`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(groupData),
        });
        return await response.json();
    },

    getGroup: async (id) => {
        const response = await fetch(`${API_BASE_URL}/groups/${id}`);
        return await response.json();
    },

    getUserGroups: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/groups`);
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    },

    addMember: async (groupId, userId) => {
        const response = await fetch(`${API_BASE_URL}/groups/${groupId}/members/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    },

    removeMember: async (groupId, userId) => {
        const response = await fetch(`${API_BASE_URL}/groups/${groupId}/members/${userId}`, {
            method: 'DELETE',
        });
        return await response.json();
    },
};

// Bill API calls
export const billApi = {
    createBill: async (billData) => {
        const response = await fetch(`${API_BASE_URL}/bills`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(billData),
        });
        return await response.json();
    },

    getBill: async (id) => {
        const response = await fetch(`${API_BASE_URL}/bills/${id}`);
        return await response.json();
    },

    getUserBills: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/bills`);
        return await response.json();
    },

    getGroupBills: async (groupId) => {
        const response = await fetch(`${API_BASE_URL}/groups/${groupId}/bills`);
        return await response.json();
    },
};

// Transaction API calls
export const transactionApi = {
    createTransaction: async (transactionData) => {
        const response = await fetch(`${API_BASE_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transactionData),
        });
        return await response.json();
    },

    getTransaction: async (id) => {
        const response = await fetch(`${API_BASE_URL}/transactions/${id}`);
        return await response.json();
    },

    getUserTransactions: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/transactions`);
        return await response.json();
    },

    getBillTransactions: async (billId) => {
        const response = await fetch(`${API_BASE_URL}/bills/${billId}/transactions`);
        return await response.json();
    },
}; 