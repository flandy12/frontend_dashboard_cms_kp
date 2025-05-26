import axios from "axios";

const api = axios.create({
    baseURL: "http://api.inventoryapp.my.id/api",
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const token = "5|bs4q1IuVnkuXgpV3IoEWW0SlviwmK3jTrR1ijEwx95043f40";
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // contoh redirect ke login
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
