import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const apiService = await axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor to add the token to requests
apiService.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiService;
