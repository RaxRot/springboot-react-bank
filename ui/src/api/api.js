import axios from "axios";
import toast from "react-hot-toast";

// прямое подключение к backend
export const api = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true, // JWT cookie
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err?.response?.status;
        const msg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Request failed";
        if (status === 401) {
            toast.error("Please login to continue");
            if (window.location.pathname !== "/login") {
                setTimeout(() => (window.location.href = "/login"), 600);
            }
        } else if (status === 403) {
            toast.error("Access denied");
        } else {
            toast.error(msg);
        }
        return Promise.reject(err);
    }
);
