import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Products from "@/pages/Products";
import SellerDashboard from "@/pages/SellerDashboard";
import ProductListing from "@/pages/ProductListing";
import SubscriptionManagement from "@/pages/seller/SubscriptionManagement";
import InventoryManagement from "@/pages/seller/InventoryManagement";
import SalesAnalytics from "@/pages/seller/SalesAnalytics";
import ListingManagement from "@/pages/seller/ListingManagement";
import Index from "@/pages/Index";
import { VerifyEmail } from "@/pages/VerifyEmail";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Products />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/product-listing" element={<ProductListing />} />
        <Route path="/seller/subscription" element={<SubscriptionManagement />} />
        <Route path="/seller/inventory" element={<InventoryManagement />} />
        <Route path="/seller/analytics" element={<SalesAnalytics />} />
        <Route path="/seller/listings" element={<ListingManagement />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </Router>
  );
}