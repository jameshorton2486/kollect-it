import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Footer } from "@/components/home/Footer";
import { Building, Users, Award, Heart } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar placeholder */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Breadcrumbs 
            items={[
              { label: "Home", href: "/" },
              { label: "About Us", href: "/about" }
            ]} 
          />
        </div>
      </nav>

      {/* Header Section */}
      <header className="bg-shop-50 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Building className="h-12 w-12 text-shop-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-shop-900 mb-4">About Kollect-It</h1>
          <p className="text-shop-600 max-w-2xl mx-auto">
            Your trusted marketplace for unique collectibles and fine art, connecting passionate collectors with authentic pieces.
          </p>
        </div>
      </header>

      {/* Feature Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Award className="h-12 w-12 text-shop-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
              <p className="text-shop-600">Every item is verified for authenticity and quality.</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-shop-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community First</h3>
              <p className="text-shop-600">Built by collectors, for collectors.</p>
            </div>
            <div className="text-center">
              <Heart className="h-12 w-12 text-shop-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Passion for Collection</h3>
              <p className="text-shop-600">Dedicated to preserving and sharing collectible treasures.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-shop-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Placeholder team members */}
            <div className="text-center">
              <div className="w-32 h-32 bg-shop-200 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold">John Doe</h3>
              <p className="text-shop-600">Founder & CEO</p>
            </div>
            {/* Add more team members as needed */}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}