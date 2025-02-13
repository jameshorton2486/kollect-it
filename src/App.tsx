
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
      <MainNavbar />
      <Routes>
        {/* Primary Pages */}
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/categories" element={<CategoryManagement />} />
        <Route path="/featured" element={<Featured />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/shipping-returns" element={<ShippingReturns />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        
        {/* Authentication Routes */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/password-recovery" element={<PasswordRecovery />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/mfa-verification" element={<MFAVerification />} />
        <Route path="/auth-documentation" element={<AuthDocumentation />} />
        
        {/* User-specific Routes */}
        <Route path="/personal-collection" element={<PersonalCollection />} />
        <Route path="/purchase-history" element={<PurchaseHistory />} />
        <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
        
        {/* Seller Routes */}
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/seller/analytics" element={<SalesAnalytics />} />
        <Route path="/seller-guidelines" element={<SellerGuidelines />} />
        
        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="users" element={<UserManagementTable />} />
          <Route path="content" element={<ContentManagement />} />
        </Route>
        <Route path="/category-management" element={<CategoryManagement />} />
      </Routes>
      <Toaster />
    </ErrorBoundary>
  );
}
