import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./context/ThemeContext.js";
import { ProtectedRoute } from "./components/ProtectedRoute.js";
import { PublicRoute } from "./components/PublicRoute.js";
import { AdminLayout } from "./layouts/AdminLayout.js";
import { AuthLayout } from "./layouts/AuthLayout.js";
import { AdminListPage } from "./pages/admins/AdminListPage.js";
import { AdminCreatePage } from "./pages/admins/AdminCreatePage.js";
import { AdminEditPage } from "./pages/admins/AdminEditPage.js";
import { AdminDetailPage } from "./pages/admins/AdminDetailPage.js";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage.js";
import { LoginPage } from "./pages/auth/LoginPage.js";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage.js";
import { CustomerListPage } from "./pages/customers/CustomerListPage.js";
import { CustomerCreatePage } from "./pages/customers/CustomerCreatePage.js";
import { CustomerEditPage } from "./pages/customers/CustomerEditPage.js";
import { CustomerDetailPage } from "./pages/customers/CustomerDetailPage.js";
import { DashboardPage } from "./pages/dashboard/DashboardPage.js";
import { ChangePasswordPage } from "./pages/profile/ChangePasswordPage.js";
import { ProfilePage } from "./pages/profile/ProfilePage.js";
import { RoleListPage } from "./pages/roles/RoleListPage.js";
import { RoleCreatePage } from "./pages/roles/RoleCreatePage.js";
import { RoleEditPage } from "./pages/roles/RoleEditPage.js";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

function App() {
    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <Toaster position="top-right" richColors />
                <BrowserRouter>
                    <Routes>
                        {/* Public Auth Routes Container */}
                        <Route element={<PublicRoute />}>
                            <Route path="/admin" element={<AuthLayout />}>
                                <Route path="login" element={<LoginPage />} />
                                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                                <Route path="reset-password" element={<ResetPasswordPage />} />
                            </Route>
                        </Route>

                        {/* Protected Admin Dashboard Layout */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/admin" element={<AdminLayout />}>
                                <Route path="dashboard" element={<DashboardPage />} />
                                <Route path="admins" element={<AdminListPage />} />
                                <Route path="admins/create" element={<AdminCreatePage />} />
                                <Route path="admins/:id" element={<AdminDetailPage />} />
                                <Route path="admins/:id/edit" element={<AdminEditPage />} />
                                <Route path="customers" element={<CustomerListPage />} />
                                <Route path="customers/create" element={<CustomerCreatePage />} />
                                <Route path="customers/:id" element={<CustomerDetailPage />} />
                                <Route path="customers/:id/edit" element={<CustomerEditPage />} />
                                <Route path="roles" element={<RoleListPage />} />
                                <Route path="roles/create" element={<RoleCreatePage />} />
                                <Route path="roles/:id/edit" element={<RoleEditPage />} />
                                <Route path="profile" element={<ProfilePage />} />
                                <Route path="change-password" element={<ChangePasswordPage />} />
                            </Route>
                        </Route>

                        {/* Default Redirect */}
                        <Route path="*" element={<Navigate to="/admin/login" replace />} />
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;
