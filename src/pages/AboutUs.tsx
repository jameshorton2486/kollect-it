
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Shield, Users, Heart, Search, Mail, Phone } from "lucide-react";

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "About Us" }
      ]}
    >
      {/* Hero Section */}
      <section className="py-12 bg-shop-50 rounded-lg">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold text-shop-900 mb-6">About Kollect-It</h1>
          <p className="text-lg text-shop-600 mb-8">
            We're here to help people connect with unique and interesting items from the past,
            making the process of discovering and collecting these treasures fun, accessible,
            and rewarding for everyone.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-shop-900 mb-6">Our Mission</h2>
          <div className="prose prose-lg text-shop-600">
            <p>
              At Kollect-It, we offer a thoughtfully curated selection of antiques, artwork,
              and collectibles, sourced from auctions, estate sales, and trusted sellers.
              Each item is carefully chosen to ensure it's authentic and of good quality.
              Our goal is to bring these timeless pieces to collectors, decorators, and
              history lovers who will appreciate them for years to come.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 bg-shop-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-shop-900 mb-6">Our Story</h2>
          <div className="prose prose-lg text-shop-600">
            <p>
              Kollect-It was founded by a group of passionate collectors who saw the need
              for a space where people could find quality antiques and unique items. It all
              started with a single find — a rare painting discovered at an estate sale.
            </p>
            <p>
              What began as a personal hobby soon turned into a mission to make antiques
              and collectibles more accessible to everyone. Today, we're proud to bring a
              little bit of history, art, and culture into homes and collections around
              the world.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-shop-900 mb-8 text-center">
            Why Choose Kollect-It?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <Search className="h-8 w-8 text-shop-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Curated Collection</h3>
                <p className="text-shop-600">
                  We carefully select antiques, art, and collectibles to ensure authenticity
                  and quality.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Shield className="h-8 w-8 text-shop-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Trustworthy Marketplace</h3>
                <p className="text-shop-600">
                  Every item is thoroughly checked for authenticity and condition.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 bg-shop-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-shop-900 mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <BookOpen className="h-8 w-8 text-shop-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Authenticity</h3>
              <p className="text-shop-600">Only genuine antiques and collectibles.</p>
            </div>
            <div className="text-center">
              <Heart className="h-8 w-8 text-shop-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Preservation</h3>
              <p className="text-shop-600">Passionate about preserving history.</p>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 text-shop-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Integrity</h3>
              <p className="text-shop-600">Clear and accurate descriptions.</p>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 text-shop-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Community</h3>
              <p className="text-shop-600">A space for collectors to connect.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-shop-900 mb-8">Contact Us</h2>
          <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
            <div className="flex items-center justify-center gap-2">
              <Mail className="h-5 w-5 text-shop-600" />
              <span className="text-shop-600">info@kollect-it.com</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Phone className="h-5 w-5 text-shop-600" />
              <span className="text-shop-600">469-386-6065</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={() => navigate("/products")}>
              Explore Our Collection
            </Button>
            <Button variant="outline" onClick={() => navigate("/auth")}>
              Join Our Community
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
