import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-[#0d2e49] text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-xl font-bold text-white footer-brand mb-4">Kollect-It</h3>
            <p className="text-white/80">Your trusted marketplace for unique collectibles and fine art.</p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products/create" className="text-white/80 hover:text-white transition-colors flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  List an Item
                </Link>
              </li>
              <li>
                <Link to="/seller/dashboard" className="text-white/80 hover:text-white transition-colors flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link to="/seller/orders" className="text-white/80 hover:text-white transition-colors flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Manage Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="font-semibold mb-4">Contact Support</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-white/80">
                <Mail className="w-4 h-4" />
                <a 
                  href="mailto:support@kollect-it.com" 
                  className="hover:text-white transition-colors"
                  aria-label="Email support"
                >
                  support@kollect-it.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-white/80">
                <Phone className="w-4 h-4" />
                <a 
                  href="tel:1-469-386-6065" 
                  className="hover:text-white transition-colors"
                  aria-label="Call support"
                >
                  1-469-386-6065
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Social Links */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 mb-6">
              <li>
                <Link to="/privacy-policy" className="text-white/80 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-white/80 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/community-guidelines" className="text-white/80 hover:text-white transition-colors">
                  Community Guidelines
                </Link>
              </li>
            </ul>
            
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-white/80 hover:text-white transition-colors hover:scale-110 transform duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-white/80 hover:text-white transition-colors hover:scale-110 transform duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-white/80 hover:text-white transition-colors hover:scale-110 transform duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-white/80 hover:text-white transition-colors hover:scale-110 transform duration-200"
                aria-label="Youtube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/80">
            &copy; {new Date().getFullYear()} Kollect-It. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
