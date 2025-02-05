
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Footer } from "@/components/home/Footer";
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Twitter } from "lucide-react";
import { Form } from "@/components/ui/form";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar placeholder */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Breadcrumbs 
            items={[
              { label: "Home", href: "/" },
              { label: "Contact", href: "/contact" }
            ]} 
          />
        </div>
      </nav>

      {/* Header Section */}
      <header className="bg-shop-50 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Mail className="h-12 w-12 text-shop-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-shop-900 mb-4">Contact Us</h1>
          <p className="text-shop-600 max-w-2xl mx-auto">
            We're always here to help at Kollect-It! Whether you have questions about a specific item, need assistance with an order, or want to learn more about our services, don't hesitate to reach out.
          </p>
        </div>
      </header>

      {/* Contact Information Grid */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <Mail className="h-8 w-8 text-shop-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <div className="space-y-2">
                <p className="text-shop-600">General: info@kollect-it.com</p>
                <p className="text-shop-600">Support: support@kollect-it.com</p>
                <p className="text-shop-600">Sellers: sell@kollect-it.com</p>
              </div>
            </div>
            <div className="text-center">
              <Phone className="h-8 w-8 text-shop-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-shop-600">469-386-6065</p>
              <div className="flex items-center justify-center mt-2">
                <Clock className="h-4 w-4 text-shop-600 mr-2" />
                <p className="text-shop-600 text-sm">Mon-Fri: 9AM-5PM (EST)</p>
              </div>
            </div>
            <div className="text-center">
              <MapPin className="h-8 w-8 text-shop-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className="text-shop-600">
                Kollect-It<br />
                7324 Hovingham<br />
                San Antonio, Texas 78257
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Can We Help Section */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">How Can We Help?</h2>
          <div className="grid gap-6">
            <div className="bg-shop-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">General Inquiries</h3>
              <p className="text-shop-600">
                For questions about our collection, products, or services, feel free to reach out. We're happy to provide more details or help you find the perfect piece for your collection.
              </p>
            </div>
            <div className="bg-shop-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Customer Support</h3>
              <p className="text-shop-600">
                Need help with an order, shipping, returns, or any other issues? Our customer support team is here to make your experience with Kollect-It as smooth as possible.
              </p>
            </div>
            <div className="bg-shop-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Seller & Consignment Inquiries</h3>
              <p className="text-shop-600">
                Interested in selling items or consigning with Kollect-It? We'd love to hear from you! Get in touch to discuss how we can help you list your treasures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-shop-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Send us a Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-shop-700 mb-1">First Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-shop-300 focus:outline-none focus:ring-2 focus:ring-shop-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-shop-700 mb-1">Last Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-shop-300 focus:outline-none focus:ring-2 focus:ring-shop-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-shop-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg border border-shop-300 focus:outline-none focus:ring-2 focus:ring-shop-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-shop-700 mb-1">Phone (Optional)</label>
              <input
                type="tel"
                className="w-full px-4 py-2 rounded-lg border border-shop-300 focus:outline-none focus:ring-2 focus:ring-shop-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-shop-700 mb-1">Message</label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-shop-300 focus:outline-none focus:ring-2 focus:ring-shop-500"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-shop-600 text-white rounded-lg hover:bg-shop-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8">Follow Us</h2>
          <div className="flex justify-center space-x-6">
            <a href="https://facebook.com/KollectIt" target="_blank" rel="noopener noreferrer" className="text-shop-600 hover:text-shop-700">
              <Facebook className="h-8 w-8" />
            </a>
            <a href="https://instagram.com/KollectIt" target="_blank" rel="noopener noreferrer" className="text-shop-600 hover:text-shop-700">
              <Instagram className="h-8 w-8" />
            </a>
            <a href="https://twitter.com/KollectIt" target="_blank" rel="noopener noreferrer" className="text-shop-600 hover:text-shop-700">
              <Twitter className="h-8 w-8" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
