import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL || "http://localhost:8000/api"
});

// Interceptor untuk Authorization
api.interceptors.request.use(
    (config) => {
        const token = getCookie('token'); // ambil dari cookies
        if (token) {
            // Jika token tidak ada, redirect ke halaman login
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

/**
 * Fungsi untuk mengirim request ke endpoint API
 * @param {string} endpoint - endpoint API tanpa baseURL (misal: "/users")
 * @param {object} formData - data yang akan dikirim (misal: { name: "John" })
 * @param {string} method - HTTP method (default: "POST")
 */
export const apiRequest = async (endpoint, formData = {}, method = "POST") => {
    try {
        const response = await api({
            url: endpoint,
            method: method.toLowerCase(),
            data: formData,
        });
        return response.data;
    } catch (error) {
        // log atau tangani error
        console.error("API request error:", error);
        throw error;
    }
};

export default api;
