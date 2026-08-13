import React from "react";
import { Link } from "react-router-dom";
import { Bell, LogOut, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext.js";

import { getAvatarUrl } from "../components/admins/AdminForm.js";

interface HeaderProps {
    adminName?: string;
    avatarUrl?: string;
    onMenuClick?: () => void;
    onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    adminName = "Admin",
    avatarUrl,
    onMenuClick,
    onLogout,
}) => {
    const { theme, toggleTheme } = useTheme();

    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    return (
        <header className="sticky top-0 z-30 bg-[#F7F5F0]/90 dark:bg-[#0E1D21]/90 backdrop-blur-md border-b border-[#E5E0D8] dark:border-[#1F3E45] px-4 lg:px-8 py-4 transition-all">
            <div className="flex items-center justify-between gap-4">
                {/* Left Header Section (Matching Image 2 Reference) */}
                <div className="flex items-center gap-3">
                    {/* Mobile Hamburger Button */}
                    {onMenuClick && (
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden p-2 rounded-xl border border-[#E5E0D8] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#1E293B] dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-[#334155] transition"
                            aria-label="Open Sidebar"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    )}

                    <div>
                        {/* Red Subtitle Stamp matching Image 2 */}
                        <p className="text-[10px] uppercase tracking-wider font-bold text-[#C53030] dark:text-[#F87171] mb-0.5">
                            HANDY HELP GY
                        </p>
                        {/* Subtitle Line matching Image 2 */}
                        <h1 className="font-serif-title text-xl lg:text-2xl font-bold text-[#1E293B] dark:text-[#F8FAFC] leading-tight">
                            Your home, in good hands
                        </h1>
                    </div>
                </div>

                {/* Right Header Controls */}
                <div className="flex items-center gap-2 lg:gap-4">
                    {/* Role Space Switcher Pill */}
                    <div className="hidden md:flex items-center p-1 bg-white dark:bg-[#1E293B] rounded-full border border-[#E5E0D8] dark:border-[#334155] text-xs font-medium shadow-xs">
                        <span className="px-3 py-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                            Customer
                        </span>
                        <span className="px-3 py-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                            Provider
                        </span>
                        <span className="px-3 py-1 bg-[#164E50] text-white rounded-full font-semibold shadow-2xs">
                            Admin
                        </span>
                    </div>

                    {/* Dark/Light Theme Switch Button */}
                    <button
                        onClick={toggleTheme}
                        className="w-9 h-9 rounded-full bg-white dark:bg-[#1E293B] border border-[#E5E0D8] dark:border-[#334155] flex items-center justify-center text-slate-600 dark:text-amber-400 hover:text-[#164E50] dark:hover:text-amber-300 hover:border-[#164E50] dark:hover:border-amber-400 transition shadow-2xs cursor-pointer"
                        title={theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode"}
                    >
                        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>

                    {/* Notification Bell */}
                    <button
                        className="relative w-9 h-9 rounded-full bg-white dark:bg-[#1E293B] border border-[#E5E0D8] dark:border-[#334155] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#164E50] hover:border-[#164E50] transition shadow-2xs cursor-pointer"
                        title="Notifications"
                    >
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#1E293B]" />
                    </button>

                    {/* User Profile Avatar Pill */}
                    <div className="flex items-center gap-2 pl-2 border-l border-[#E5E0D8] dark:border-[#334155]">
                        <Link
                            to="/admin/profile"
                            className="flex items-center gap-2 p-1 rounded-full hover:bg-white/60 dark:hover:bg-[#1E293B] border border-transparent hover:border-[#E5E0D8] dark:hover:border-[#334155] transition"
                        >
                            <img
                                src={getAvatarUrl(avatarUrl)}
                                alt={adminName}
                                className="w-9 h-9 rounded-full object-cover border border-[#E5E0D8] dark:border-[#334155]"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = defaultAvatar;
                                }}
                            />
                            <span className="hidden lg:inline text-xs font-semibold text-[#1E293B] dark:text-[#F8FAFC] max-w-[100px] truncate">
                                {adminName}
                            </span>
                        </Link>

                        {/* Quick Logout Button */}
                        {onLogout && (
                            <button
                                onClick={onLogout}
                                className="w-8 h-8 rounded-full border border-[#E5E0D8] dark:border-[#334155] bg-white dark:bg-[#1E293B] flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-500/30 transition cursor-pointer"
                                title="Logout"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
