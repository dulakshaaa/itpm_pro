// authService.js

import axios from 'axios';

const authService = {
    login: async (email, password) => {
        try {
            const response = await axios.post('http://localhost:3001/user_api/user_login', { email, password });
            const { token } = response.data;
            localStorage.setItem('token', token);

            // Add authorization header to check the token
            const config = {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            };

            // Make a request to verify the token
            await axios.post('http://localhost:3001/user_api/verify_token', { token }, config);
            window.location.href = "/Client/";
            // If verification is successful, return the token
            return token;
        } catch (error) {
            throw error;
        }
    },
    logout: () => {
        localStorage.removeItem('token');
        window.location.href = "/Client/";
    },
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

export default authService;
