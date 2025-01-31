import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Footer } from "@/components/home/Footer";
import { BookOpen } from "lucide-react";

export default function Blog() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar placeholder */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Breadcrumbs 
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" }
            ]} 
          />
        </div>
      </nav>

      {/* Header Section */}
      <header className="bg-shop-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-6 w-6 text-shop-600" />
            <h1 className="text-3xl font-bold text-shop-900">Kollect-It Blog</h1>
          </div>
          <p className="text-shop-600 max-w-2xl">
            Stay updated with the latest news, collecting tips, and market trends in the world of fine art and collectibles.
          </p>
        </div>
      </header>

      {/* Blog List Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Placeholder for blog posts */}
            <div className="animate-pulse">
              <div className="bg-shop-200 h-48 rounded-lg mb-4"></div>
              <div className="bg-shop-200 h-6 w-3/4 rounded mb-2"></div>
              <div className="bg-shop-200 h-4 rounded mb-2"></div>
              <div className="bg-shop-200 h-4 w-1/2 rounded"></div>
            </div>
            {/* Add more placeholder items as needed */}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-shop-50 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-shop-900 mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-shop-600 mb-6">Get the latest updates and news delivered to your inbox.</p>
          <form className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border border-shop-300 focus:outline-none focus:ring-2 focus:ring-shop-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-shop-600 text-white rounded-lg hover:bg-shop-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}