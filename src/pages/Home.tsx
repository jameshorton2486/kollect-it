
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { PricingSection } from "@/components/home/PricingSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { QualityCommitmentSection } from "@/components/home/QualityCommitmentSection";

const Home = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <CategoriesSection />
      <PricingSection />
      <QualityCommitmentSection />
      <NewsletterSection />
    </main>
  );
};

export default Home;
