import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-shop-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Kollect-It</h3>
            <p className="text-shop-300">Your trusted marketplace for unique collectibles and fine art.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-shop-300 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-shop-300 hover:text-white">Categories</a></li>
              <li><a href="#" className="text-shop-300 hover:text-white">Featured Items</a></li>
              <li><a href="#" className="text-shop-300 hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Help & Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-shop-300 hover:text-white">FAQ</a></li>
              <li><a href="#" className="text-shop-300 hover:text-white">Shipping Info</a></li>
              <li><a href="#" className="text-shop-300 hover:text-white">Returns</a></li>
              <li><a href="#" className="text-shop-300 hover:text-white">Terms & Conditions</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-shop-300 hover:text-white"><Facebook className="w-6 h-6" /></a>
              <a href="#" className="text-shop-300 hover:text-white"><Twitter className="w-6 h-6" /></a>
              <a href="#" className="text-shop-300 hover:text-white"><Instagram className="w-6 h-6" /></a>
              <a href="#" className="text-shop-300 hover:text-white"><Youtube className="w-6 h-6" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-shop-700 mt-8 pt-8 text-center text-white">
          <p>&copy; {new Date().getFullYear()} Kollect-It. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}