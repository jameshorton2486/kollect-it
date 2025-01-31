import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Footer } from "@/components/home/Footer";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar placeholder */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Contact</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </nav>

      {/* Header Section */}
      <header className="bg-shop-50 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Mail className="h-12 w-12 text-shop-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-shop-900 mb-4">Contact Us</h1>
          <p className="text-shop-600 max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help!
          </p>
        </div>
      </header>

      {/* Contact Information Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <Phone className="h-8 w-8 text-shop-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-shop-600">+1 (555) 123-4567</p>
            </div>
            <div className="text-center">
              <Mail className="h-8 w-8 text-shop-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-shop-600">support@kollect-it.com</p>
            </div>
            <div className="text-center">
              <MapPin className="h-8 w-8 text-shop-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Location</h3>
              <p className="text-shop-600">123 Collector Street<br />Art City, AC 12345</p>
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-shop-700 mb-1">Last Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-shop-300 focus:outline-none focus:ring-2 focus:ring-shop-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-shop-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg border border-shop-300 focus:outline-none focus:ring-2 focus:ring-shop-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-shop-700 mb-1">Message</label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-shop-300 focus:outline-none focus:ring-2 focus:ring-shop-500"
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

      <Footer />
    </div>
  );
}