import { DashboardLayout } from "@/components/DashboardLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedListingsSection } from "@/components/home/FeaturedListingsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { CommunitySection } from "@/components/home/CommunitySection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { TrendingCollectiblesSection } from "@/components/home/TrendingCollectiblesSection";

const Home = () => {
  return (
    <DashboardLayout>
      <main className="min-h-screen">
        <HeroSection />
        <TrendingCollectiblesSection />
        <CategoriesSection />
        <FeaturedListingsSection />
        <HowItWorksSection />
        <CommunitySection />
        <NewsletterSection />
      </main>
    </DashboardLayout>
  );
};

export default Home;