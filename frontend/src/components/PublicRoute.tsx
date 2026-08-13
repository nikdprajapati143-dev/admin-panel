import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";

export const PublicRoute: React.FC = () => {
    const { isAuthenticated } = useAuthStore();
    const hasToken = Boolean(localStorage.getItem("accessToken"));

    // If user is already logged in, redirect them straight to Dashboard
    if (isAuthenticated || hasToken) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
};
