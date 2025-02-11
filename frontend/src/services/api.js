const API_BASE_URL = 'http://localhost:8080/api';

export const userApi = {
  login: async (email, password) => {
    // Implement your login logic here
    return Promise.resolve({ email });
  },
  
  register: async (userData) => {
    // Implement your registration logic here
    return Promise.resolve(userData);
  }
}; 