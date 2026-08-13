import axios from "axios";

export const apiClient = axios.create({
    baseURL: "http://localhost:5000/api/v1",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Helper to check if running in development environment
const isDev = import.meta.env.MODE === "development" || import.meta.env.DEV;

// Attach bearer token if present in localStorage
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Flag to avoid infinite loops during token refresh
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token!);
        }
    });
    failedQueue = [];
};

// Response Error Interceptor with Auto Refresh & Auto Redirect
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const isAuthRoute = originalRequest?.url?.includes("/admin/auth/");

        if (status === 401 && !originalRequest._retry && !isAuthRoute) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return apiClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Attempt to refresh token via httpOnly cookie or body
                const refreshRes = await axios.post(
                    "http://localhost:5000/api/v1/admin/auth/refresh",
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = refreshRes.data?.data?.accessToken;
                if (newAccessToken) {
                    localStorage.setItem("accessToken", newAccessToken);
                    apiClient.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    processQueue(null, newAccessToken);
                    return apiClient(originalRequest);
                } else {
                    throw new Error("No token returned");
                }
            } catch (refreshErr) {
                processQueue(refreshErr, null);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("adminUser");
                if (window.location.pathname !== "/admin/login") {
                    window.location.href = "/admin/login";
                }
                return Promise.reject(refreshErr);
            } finally {
                isRefreshing = false;
            }
        }

        if (isDev) {
            const method = (originalRequest?.method || "GET").toUpperCase();
            const url = originalRequest?.url || "";
            const errStatus = error.response?.status || "NETWORK_ERROR";
            const message =
                error.response?.data?.message || error.message || "An unexpected network error occurred";
            const validationErrors = error.response?.data?.errors;

            console.group(`%c[API ERROR] ${method} ${url}`, "color: #EF4444; font-weight: bold;");
            console.error(`Status Code: ${errStatus}`);
            console.error(`Message: ${message}`);
            if (validationErrors) {
                console.error("Validation Details:", validationErrors);
            }
            console.groupEnd();
        }

        return Promise.reject(error);
    }
);
