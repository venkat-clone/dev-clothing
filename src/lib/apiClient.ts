import axios from 'axios';

// Create an Axios instance with default configuration
const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api', // Base URL for your API
    timeout: 10000, // Request timeout in milliseconds
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor to add Authorization header if needed
// apiClient.interceptors.request.use(
//     (config) => {
//         // Add your auth token if required
//         const token = localStorage.getItem('token'); // Assuming you store your token in local storage
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// // Response Interceptor for handling responses and errors
// apiClient.interceptors.response.use(
//     (response) => {
//         return response.data; // Return the data directly
//     },
//     (error) => {
//         // Handle errors globally
//         if (error.response) {
//             console.error('API Error:', error.response.data);
//             // You can implement a global error handling strategy here
//         }
//         return Promise.reject(error);
//     }
// );

export default apiClient;
