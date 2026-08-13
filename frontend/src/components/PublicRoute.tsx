import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";

export const PublicRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading && localStorage.getItem("accessToken")) {
        return null;
    }

    if (isAuthenticated) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
};
