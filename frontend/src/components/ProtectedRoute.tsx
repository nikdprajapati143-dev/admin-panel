import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Loader2, Key } from "lucide-react";
import { useAuthStore } from "../store/authStore.js";
import { hasPermission } from "../utils/permission.js";

interface ProtectedRouteProps {
    requiredPermission?: string;
    children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    requiredPermission,
    children,
}) => {
    const { admin, isAuthenticated, isLoading, checkAuthStatus } = useAuthStore();

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F7F5F0] flex flex-col items-center justify-center p-4">
                <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#164E50] flex items-center justify-center text-amber-300 shadow-sm">
                        <Key className="w-5 h-5" />
                    </div>
                    <span className="font-serif-title text-2xl font-bold text-[#164E50]">
                        Handy Help GY
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-[#64748B]">
                    <Loader2 className="w-4 h-4 animate-spin text-[#164E50]" />
                    <span>Verifying session...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    if (requiredPermission && !hasPermission(admin, requiredPermission)) {
        return <Navigate to="/admin/403" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};
