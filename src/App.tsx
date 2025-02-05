import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Auth } from "./pages/Auth";
import { AuthCallback } from "./components/auth/AuthCallback";
import { PasswordRecovery } from "./pages/PasswordRecovery";
import { VerifyEmail } from "./pages/VerifyEmail";
import ProfileSettings from "./pages/ProfileSettings";
import AdminDashboard from "./pages/AdminDashboard";
import { UserManagementTable } from "./components/admin/UserManagementTable";
import { ContentManagement } from "./components/admin/ContentManagement";
import { AnalyticsDashboard } from "./components/admin/AnalyticsDashboard";
import { DashboardLayout } from "./components/DashboardLayout";
import { MainNavbar } from "./components/navigation/MainNavbar";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <MainNavbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/password-recovery" element={<PasswordRecovery />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />}>
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="users" element={<UserManagementTable />} />
            <Route path="content" element={<ContentManagement />} />
          </Route>
        </Routes>
        <Toaster />
      </ErrorBoundary>
    </Router>
  );
}