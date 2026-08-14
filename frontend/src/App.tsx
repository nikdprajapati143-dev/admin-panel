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
import { NotFoundPage } from "./pages/common/NotFoundPage.js";
import { UnauthorizedPage } from "./pages/common/UnauthorizedPage.js";
import { PERMISSIONS } from "./constants/permissions.js";

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
                <Toaster position="top-right" richColors closeButton />
                <BrowserRouter>
                    <Routes>
                        {/* Root Redirect to Dashboard / Login */}
                        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

                        {/* Public Auth Routes Container */}
                        <Route element={<PublicRoute />}>
                            <Route path="/admin" element={<AuthLayout />}>
                                <Route index element={<Navigate to="login" replace />} />
                                <Route path="login" element={<LoginPage />} />
                                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                                <Route path="reset-password" element={<ResetPasswordPage />} />
                            </Route>
                        </Route>

                        {/* Protected Admin Dashboard Layout */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/admin" element={<AdminLayout />}>
                                <Route path="dashboard" element={<DashboardPage />} />
                                <Route path="403" element={<UnauthorizedPage />} />
                                <Route path="profile" element={<ProfilePage />} />
                                <Route path="change-password" element={<ChangePasswordPage />} />

                                 {/* Admins Routes */}
                                <Route element={<ProtectedRoute requiredPermission={PERMISSIONS.ADMIN_LIST} />}>
                                    <Route path="admins" element={<AdminListPage />} />
                                </Route>
                                <Route element={<ProtectedRoute requiredPermission={PERMISSIONS.ADMIN_VIEW} />}>
                                    <Route path="admins/:id" element={<AdminDetailPage />} />
                                </Route>
                                <Route element={<ProtectedRoute requiredPermission={PERMISSIONS.ADMIN_CREATE} />}>
                                    <Route path="admins/create" element={<AdminCreatePage />} />
                                </Route>
                                <Route element={<ProtectedRoute requiredPermission={PERMISSIONS.ADMIN_EDIT} />}>
                                    <Route path="admins/:id/edit" element={<AdminEditPage />} />
                                </Route>

                                {/* Customers Routes */}
                                <Route element={<ProtectedRoute requiredPermission={PERMISSIONS.CUSTOMER_LIST} />}>
                                    <Route path="customers" element={<CustomerListPage />} />
                                </Route>
                                <Route element={<ProtectedRoute requiredPermission={PERMISSIONS.CUSTOMER_VIEW} />}>
                                    <Route path="customers/:id" element={<CustomerDetailPage />} />
                                </Route>
                                <Route element={<ProtectedRoute requiredPermission={PERMISSIONS.CUSTOMER_CREATE} />}>
                                    <Route path="customers/create" element={<CustomerCreatePage />} />
                                </Route>
                                <Route element={<ProtectedRoute requiredPermission={PERMISSIONS.CUSTOMER_EDIT} />}>
                                    <Route path="customers/:id/edit" element={<CustomerEditPage />} />
                                </Route>

                                {/* Roles Routes */}
                                <Route element={<ProtectedRoute requiredPermission={PERMISSIONS.ROLE_LIST} />}>
                                    <Route path="roles" element={<RoleListPage />} />
                                </Route>
                                <Route element={<ProtectedRoute requiredPermission={PERMISSIONS.ROLE_CREATE} />}>
                                    <Route path="roles/create" element={<RoleCreatePage />} />
                                </Route>
                                <Route element={<ProtectedRoute requiredPermission={PERMISSIONS.ROLE_EDIT} />}>
                                    <Route path="roles/:id/edit" element={<RoleEditPage />} />
                                </Route>
                            </Route>
                        </Route>

                        {/* Custom 404 Page for Unmatched Routes */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;
