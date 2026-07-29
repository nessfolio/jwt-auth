import axios from 'axios';
import {AuthResponse} from "@/src/models/response/AuthResponse";

export const API_URL = `http://localhost:9090/api`

const API = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

API.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config;
})

API.interceptors.response.use((config) => {
    return config
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status == 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true });
            localStorage.setItem('token', response.data.accessToken)
            return API.request(originalRequest);
        } catch(e) {
            console.log('Unauthorized', e)
        }
    }
    throw error;
})

export default API;