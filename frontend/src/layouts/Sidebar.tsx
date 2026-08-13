import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Shield,
    UserCheck,
    User,
    KeyRound,
    LogOut,
    Key,
    ChevronRight,
    X,
} from "lucide-react";

interface SidebarProps {
    isMobileOpen?: boolean;
    onCloseMobile?: () => void;
    onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    isMobileOpen = false,
    onCloseMobile,
    onLogout,
}) => {
    const location = useLocation();

    const navItems = [
        {
            label: "Overview",
            path: "/admin/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "Admins",
            path: "/admin/admins",
            icon: Users,
        },
        {
            label: "Roles",
            path: "/admin/roles",
            icon: Shield,
        },
        {
            label: "Customers",
            path: "/admin/customers",
            icon: UserCheck,
        },
        // {
        //     label: "Profile",
        //     path: "/admin/profile",
        //     icon: User,
        // },
        // {
        //     label: "Change Password",
        //     path: "/admin/change-password",
        //     icon: KeyRound,
        // },
    ];

    const sidebarContent = (
        <div className="flex flex-col h-full bg-[#164E50] dark:bg-[#0E1D21] text-white p-6 justify-between select-none">
            {/* Top Logo & Section */}
            <div>
                {/* Brand Logo */}
                <div className="flex items-center justify-between mb-8">
                    <Link to="/admin/dashboard" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-white/10 dark:bg-white/5 flex items-center justify-center text-amber-300 group-hover:bg-white/20 dark:group-hover:bg-white/10 transition">
                            <Key className="w-4 h-4" />
                        </div>
                        <span className="font-serif-title text-xl font-bold tracking-tight text-white">
                            Handy Help <span className="text-amber-300 text-xs font-sans align-top">GY</span>
                        </span>
                    </Link>
                    {onCloseMobile && (
                        <button
                            onClick={onCloseMobile}
                            className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 dark:hover:bg-white/5"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Section Header */}
                <div className="mb-4">
                    <p className="text-[10px] uppercase tracking-widest font-semibold text-white/50 dark:text-slate-400 px-3">
                        ADMIN SPACE
                    </p>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1.5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={onCloseMobile}
                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? "bg-white/15 dark:bg-[#162D32] text-white font-semibold shadow-sm border border-transparent dark:border-[#254C54]"
                                    : "text-white/70 hover:text-white hover:bg-white/10 dark:text-slate-300 dark:hover:text-white dark:hover:bg-[#122529]"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={`w-4 h-4 ${isActive ? "text-amber-300" : "text-white/70 dark:text-slate-400"}`} />
                                    <span>{item.label}</span>
                                </div>
                                {isActive && <ChevronRight className="w-4 h-4 text-white/80 dark:text-slate-300" />}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Logout Action */}
            {/* <div className="pt-6 border-t border-white/10 dark:border-[#1F3E45]">
                <button
                    onClick={() => {
                        if (onLogout) onLogout();
                        if (onCloseMobile) onCloseMobile();
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-200 hover:text-white hover:bg-red-500/20 transition-all cursor-pointer"
                >
                    <LogOut className="w-4 h-4 text-red-300" />
                    <span>Logout</span>
                </button>
            </div> */}
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 border-r border-[#113E40] dark:border-[#1F3E45] bg-[#164E50] dark:bg-[#0E1D21]">
                {sidebarContent}
            </aside>

            {/* Mobile Drawer Overlay */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={onCloseMobile}
                    />
                    <div className="relative w-64 max-w-[80vw] h-full shadow-2xl z-10">
                        {sidebarContent}
                    </div>
                </div>
            )}
        </>
    );
};
