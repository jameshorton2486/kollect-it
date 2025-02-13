import { Routes, Route } from "react-router-dom";
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
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import CategoryManagement from "./pages/CategoryManagement";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import SellerDashboard from "./pages/SellerDashboard";
import SalesAnalytics from "./pages/seller/SalesAnalytics";
import BuyerDashboard from "./pages/BuyerDashboard";
import MFAVerification from "./pages/MFAVerification";
import Blog from "./pages/Blog";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import ShoppingCart from "./pages/ShoppingCart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Featured from "./pages/Featured";
import NewArrivals from "./pages/NewArrivals";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ShippingReturns from "./pages/ShippingReturns";
import PersonalCollection from "./pages/PersonalCollection";
import PurchaseHistory from "./pages/PurchaseHistory";
import AuthDocumentation from "./pages/AuthDocumentation";
import SellerGuidelines from "./pages/SellerGuidelines";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MainNavbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/password-recovery" element={<PasswordRecovery />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/mfa-verification" element={<MFAVerification />} />
          <Route path="/auth-documentation" element={<AuthDocumentation />} />
          
          <Route path="/profile-settings" element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute>
              <ShoppingCart />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/order-confirmation" element={
            <ProtectedRoute>
              <OrderConfirmation />
            </ProtectedRoute>
          } />
          <Route path="/personal-collection" element={
            <ProtectedRoute>
              <PersonalCollection />
            </ProtectedRoute>
          } />
          <Route path="/purchase-history" element={
            <ProtectedRoute>
              <PurchaseHistory />
            </ProtectedRoute>
          } />
          <Route path="/buyer-dashboard" element={
            <ProtectedRoute>
              <BuyerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/seller-dashboard" element={
            <ProtectedRoute>
              <SellerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/seller/analytics" element={
            <ProtectedRoute>
              <SalesAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/admin-dashboard/*" element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/category-management" element={
            <ProtectedRoute requireAdmin>
              <CategoryManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/categories" element={<CategoryManagement />} />
          <Route path="/featured" element={<Featured />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/shipping-returns" element={<ShippingReturns />} />
          <Route path="/seller-guidelines" element={<SellerGuidelines />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </ErrorBoundary>
  );
}
