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
import { Toaster } from "@/components/ui/sonner";
import { PageLayout } from "@/components/layout/PageLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PageLayout><Home /></PageLayout>} />
        <Route path="/products" element={<PageLayout><Products /></PageLayout>} />
        <Route path="/product-listing" element={<PageLayout showBackButton><ProductListing /></PageLayout>} />
        <Route path="/categories" element={<PageLayout><Categories /></PageLayout>} />
        <Route path="/buyer-dashboard" element={<PageLayout><BuyerDashboard /></PageLayout>} />
        <Route path="/seller-dashboard" element={<PageLayout><SellerDashboard /></PageLayout>} />
        <Route path="/auth" element={<PageLayout><Auth /></PageLayout>} />
        <Route path="/password-recovery" element={<PageLayout><PasswordRecovery /></PageLayout>} />
        <Route path="/email-verification" element={<PageLayout><EmailVerification /></PageLayout>} />
        <Route path="/blog" element={<PageLayout><Blog /></PageLayout>} />
        <Route path="/about" element={<PageLayout><AboutUs /></PageLayout>} />
        <Route path="/faq" element={<PageLayout><FAQ /></PageLayout>} />
        <Route path="/contact" element={<PageLayout><Contact /></PageLayout>} />
        <Route path="/terms-of-service" element={<PageLayout><TermsOfService /></PageLayout>} />
        <Route path="/privacy-policy" element={<PageLayout><PrivacyPolicy /></PageLayout>} />
        <Route path="/shipping-returns" element={<PageLayout><ShippingReturns /></PageLayout>} />
        <Route path="/cart" element={<PageLayout showBackButton><ShoppingCart /></PageLayout>} />
        <Route path="/checkout" element={<PageLayout showBackButton><Checkout /></PageLayout>} />
        <Route path="/order-confirmation" element={<PageLayout><OrderConfirmation /></PageLayout>} />
        <Route path="/purchase-history" element={<PageLayout><PurchaseHistory /></PageLayout>} />
        <Route path="/personal-collection" element={<PageLayout><PersonalCollection /></PageLayout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;