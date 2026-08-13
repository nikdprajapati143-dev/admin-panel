import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import { Footer } from "./Footer.js";
import { Header } from "./Header.js";
import { Sidebar } from "./Sidebar.js";

export const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { admin, logout } = useAuthStore();

    const handleLogout = async () => {
        await logout();
        navigate("/admin/login", { replace: true });
    };

    return (
        <div className="min-h-screen flex bg-[#F7F5F0] dark:bg-[#0E1D21] text-[#1E293B] dark:text-[#F8FAFC] font-sans transition-colors duration-200">
            {/* Sidebar Component */}
            <Sidebar
                isMobileOpen={isMobileOpen}
                onCloseMobile={() => setIsMobileOpen(false)}
                onLogout={handleLogout}
            />

            {/* Main Application Content Column */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen">
                {/* Header Component */}
                <Header
                    adminName={admin?.name || "Admin"}
                    avatarUrl={admin?.avatar}
                    onMenuClick={() => setIsMobileOpen(true)}
                    onLogout={handleLogout}
                />

                {/* Dynamic Route Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    <Outlet />
                </main>

                {/* Footer Component */}
                <Footer />
            </div>
        </div>
    );
};
