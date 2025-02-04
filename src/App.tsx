import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "@/pages/Home";
import { Auth } from "@/pages/Auth";
import { Products } from "@/pages/Products";
import { Categories } from "@/pages/Categories";
import { Featured } from "@/pages/Featured";
import { NewArrivals } from "@/pages/NewArrivals";
import { Blog } from "@/pages/Blog";
import { AboutUs } from "@/pages/AboutUs";
import { Contact } from "@/pages/Contact";
import { VerifyEmail } from "@/pages/VerifyEmail";
import { PasswordRecovery } from "@/pages/PasswordRecovery";
import ProfileSettings from "@/pages/ProfileSettings";
import ShoppingCart from "@/pages/ShoppingCart";
import ProductDetailPage from "@/pages/ProductDetail";
import { InventoryManagement } from "@/pages/seller/InventoryManagement";
import { SalesAnalytics } from "@/pages/seller/SalesAnalytics";
import { ListingManagement } from "@/pages/seller/ListingManagement";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/featured" element={<Featured />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/password-recovery" element={<PasswordRecovery />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/seller/inventory" element={<InventoryManagement />} />
        <Route path="/seller/analytics" element={<SalesAnalytics />} />
        <Route path="/seller/listings" element={<ListingManagement />} />
      </Routes>
    </Router>
  );
}