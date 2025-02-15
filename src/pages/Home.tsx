
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { PricingSection } from "@/components/home/PricingSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { QualityCommitmentSection } from "@/components/home/QualityCommitmentSection";
import { FeaturedListingsSection } from "@/components/home/FeaturedListingsSection";
import { TrendingCollectiblesSection } from "@/components/home/TrendingCollectiblesSection";

const Home = () => {
  return (
    <main className="min-h-screen" role="main" aria-label="Home page content">
      <HeroSection />
      <CategoriesSection />
      <FeaturedListingsSection />
      <TrendingCollectiblesSection />
      <PricingSection />
      <QualityCommitmentSection />
      <NewsletterSection />
    </main>
  );
};

export default Home;
