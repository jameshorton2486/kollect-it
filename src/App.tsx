import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductListing from "@/pages/ProductListing";
import Categories from "@/pages/Categories";
import BuyerDashboard from "@/pages/BuyerDashboard";
import SellerDashboard from "@/pages/SellerDashboard";
import NotFound from "@/pages/NotFound";
import { Auth } from "@/pages/Auth";
import { PasswordRecovery } from "@/pages/PasswordRecovery";
import { EmailVerification } from "@/pages/EmailVerification";
import Blog from "@/pages/Blog";
import AboutUs from "@/pages/AboutUs";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import ShippingReturns from "@/pages/ShippingReturns";
import ShoppingCart from "@/pages/ShoppingCart";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import PurchaseHistory from "@/pages/PurchaseHistory";
import PersonalCollection from "@/pages/PersonalCollection";
import AdminDashboard from "@/pages/AdminDashboard";
import CategoryManagement from "@/pages/CategoryManagement";
import NewArrivals from "@/pages/NewArrivals";
import Featured from "@/pages/Featured";
import { Toaster } from "@/components/ui/sonner";
import { PageLayout } from "@/components/layout/PageLayout";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ArticleDetail } from "@/components/articles/ArticleDetail";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages with PublicLayout */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
        <Route path="/product-listing" element={<PublicLayout><ProductListing /></PublicLayout>} />
        <Route path="/categories" element={<PublicLayout><Categories /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutUs /></PublicLayout>} />
        <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/new-arrivals" element={<PublicLayout><NewArrivals /></PublicLayout>} />
        <Route path="/featured" element={<PublicLayout><Featured /></PublicLayout>} />
        
        {/* Legal pages with PageLayout */}
        <Route path="/terms-of-service" element={<PageLayout><TermsOfService /></PageLayout>} />
        <Route path="/privacy-policy" element={<PageLayout><PrivacyPolicy /></PageLayout>} />
        <Route path="/shipping-returns" element={<PageLayout><ShippingReturns /></PageLayout>} />
        
        {/* Auth pages with PageLayout */}
        <Route path="/auth" element={<PageLayout><Auth /></PageLayout>} />
        <Route path="/password-recovery" element={<PageLayout><PasswordRecovery /></PageLayout>} />
        <Route path="/email-verification" element={<PageLayout><EmailVerification /></PageLayout>} />
        
        {/* Shopping pages with PageLayout */}
        <Route path="/cart" element={<PageLayout showBackButton><ShoppingCart /></PageLayout>} />
        <Route path="/checkout" element={<PageLayout showBackButton><Checkout /></PageLayout>} />
        <Route path="/order-confirmation" element={<PageLayout><OrderConfirmation /></PageLayout>} />
        
        {/* Dashboard pages with DashboardLayout */}
        <Route path="/buyer-dashboard" element={<DashboardLayout><BuyerDashboard /></DashboardLayout>} />
        <Route path="/seller-dashboard" element={<DashboardLayout><SellerDashboard /></DashboardLayout>} />
        <Route path="/purchase-history" element={<DashboardLayout><PurchaseHistory /></DashboardLayout>} />
        <Route path="/personal-collection" element={<DashboardLayout><PersonalCollection /></DashboardLayout>} />
        <Route path="/admin-dashboard" element={<DashboardLayout><AdminDashboard /></DashboardLayout>} />
        <Route path="/category-management" element={<DashboardLayout><CategoryManagement /></DashboardLayout>} />
        
        <Route path="/articles/:id" element={<PageLayout><ArticleDetail /></PageLayout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
