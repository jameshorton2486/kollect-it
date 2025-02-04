import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Products from "@/pages/Products";
import SellerDashboard from "@/pages/SellerDashboard";
import ProductListing from "@/pages/ProductListing";
import InventoryManagement from "@/pages/seller/InventoryManagement";
import SalesAnalytics from "@/pages/seller/SalesAnalytics";
import ListingManagement from "@/pages/seller/ListingManagement";
import Index from "@/pages/Index";
import { Auth } from "@/pages/Auth";
import { VerifyEmail } from "@/pages/VerifyEmail";
import { PasswordRecovery } from "@/pages/PasswordRecovery";
import ProfileSettings from "@/pages/ProfileSettings";
import ShoppingCart from "@/pages/ShoppingCart";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/password-recovery" element={<PasswordRecovery />} />
        <Route path="/profile/settings" element={<ProfileSettings />} />
        <Route path="/products" element={<Products />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/product-listing" element={<ProductListing />} />
        <Route path="/seller/inventory" element={<InventoryManagement />} />
        <Route path="/seller/analytics" element={<SalesAnalytics />} />
        <Route path="/seller/listings" element={<ListingManagement />} />
        <Route path="/cart" element={<ShoppingCart />} />
      </Routes>
    </Router>
  );
}