import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
    headers : {
        'Content-type' : 'application/json',
        'Accept': 'application/json'
    },
});


// List of all the endpoints.
export const sendOtp = (data) => api.post('/api/send-otp', data);
export const verifyOtp = (data) => api.post('/api/verify-otp',data);
export const activate = (data) => api.post('/api/activate', data);
export const logout = () => api.post('/api/logout');
export const createRoom = (data) => api.post('/api/rooms', data);
export const getAllRooms = () => api.get('/api/rooms');


api.interceptors.response.use(
    (response) => {
        return response;
    }, 
    async (error) => {
        const orgReq = error.config;

        // Handle 401 errors and avoid infinite retries
        if (error.response && error.response.status === 401 && !orgReq._isRetry) {
            orgReq._isRetry = true;

            try {
                // Attempt to refresh the token
                await axios.get(`${process.env.REACT_APP_API_URL}/api/refresh`, {
                    withCredentials: true,
                });

                // Retry the original request
                return api.request(orgReq);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError.message);
                // Optionally handle redirection to login or other recovery steps
            }
        }

        return Promise.reject(error);
    }
);
