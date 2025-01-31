import { DashboardLayout } from "@/components/DashboardLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { CommunitySection } from "@/components/home/CommunitySection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { PricingSection } from "@/components/home/PricingSection";

const Index = () => {
  return (
    <DashboardLayout>
      <HeroSection />
      <CategoriesSection />
      <PricingSection />
      <CommunitySection />
      <NewsletterSection />
    </DashboardLayout>
  );
};

export default Index;