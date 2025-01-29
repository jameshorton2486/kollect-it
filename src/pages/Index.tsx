import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Gem,
  MessageCircle,
  ShoppingBag,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout>
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-shop-50 to-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-shop-900 leading-tight">
            Discover Unique Collectibles and Fine Art
          </h1>
          <p className="text-xl text-shop-600 max-w-3xl mx-auto">
            Explore our curated selection of rare collectibles and exquisite fine art. Whether you're a seasoned collector or just starting your journey, Kollect-It connects you with a passionate community and the most sought-after pieces in the market.
          </p>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <div className="flex items-center gap-2 text-shop-700">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Shop from Trusted Sellers</span>
              </div>
              <div className="flex items-center gap-2 text-shop-700">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Find One-of-a-Kind Collectibles</span>
              </div>
              <div className="flex items-center gap-2 text-shop-700">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Join a Thriving Collector Community</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-center pt-6">
            <Button size="lg" className="gap-2">
              Shop Now <ShoppingBag className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              Learn More <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-shop-900 mb-4">
            Explore a Diverse Range of Collectibles
          </h2>
          <p className="text-lg text-shop-600 text-center mb-12 max-w-3xl mx-auto">
            Find extraordinary pieces across multiple categories, handpicked for quality and authenticity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <CategoryCard
              icon={<Award className="w-8 h-8" />}
              title="Fine Art & Paintings"
              description="Masterpieces from renowned and emerging artists"
            />
            <CategoryCard
              icon={<Gem className="w-8 h-8" />}
              title="Vintage & Antique Collectibles"
              description="Coins, stamps, toys, and memorabilia"
            />
            <CategoryCard
              icon={<Star className="w-8 h-8" />}
              title="Luxury Collectibles"
              description="High-end watches, rare jewelry, and designer pieces"
            />
            <CategoryCard
              icon={<ShoppingBag className="w-8 h-8" />}
              title="Pop Culture & Media"
              description="Comics, trading cards, and iconic movie props"
            />
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 px-4 bg-shop-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-shop-900 mb-4">
            Join a Community of Collectors
          </h2>
          <p className="text-lg text-shop-600 text-center mb-12 max-w-3xl mx-auto">
            Connect, trade, and discuss your prized finds with fellow collectors who share your passion.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MessageCircle className="w-8 h-8" />}
              title="Engage in Forums"
              description="Exchange knowledge and expertise with fellow collectors"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Showcase Collection"
              description="Display and share your most treasured items"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Exclusive Events"
              description="Join webinars, auctions, and collector meetups"
            />
          </div>
          <div className="text-center mt-12">
            <Button size="lg" className="gap-2">
              Join the Community <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-shop-900">
            Stay Updated with the Latest in Collecting
          </h2>
          <p className="text-lg text-shop-600">
            Subscribe to our newsletter for updates on new arrivals, exclusive events, and collecting tips from experts!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
            <Input
              type="email"
              placeholder="Your email address"
              className="flex-1"
            />
            <Button size="lg">Subscribe</Button>
          </div>
          <p className="text-sm text-shop-500">
            By subscribing, you consent to our Privacy Policy and agree to receive updates.
          </p>
        </div>
      </section>
    </DashboardLayout>
  );
};

// CategoryCard Component
const CategoryCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="p-8 rounded-lg border border-shop-200 hover:border-shop-300 transition-all duration-300 bg-white hover:shadow-lg">
      <div className="text-shop-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-shop-800 mb-2">{title}</h3>
      <p className="text-shop-600">{description}</p>
    </div>
  );
};

// FeatureCard Component
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="p-8 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
      <div className="text-shop-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-shop-800 mb-2">{title}</h3>
      <p className="text-shop-600">{description}</p>
    </div>
  );
};

export default Index;