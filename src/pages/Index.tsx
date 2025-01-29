import { DashboardLayout } from "@/components/DashboardLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { CommunitySection } from "@/components/home/CommunitySection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

const Index = () => {
  return (
    <DashboardLayout>
      <HeroSection />
      <CategoriesSection />
      <CommunitySection />
      <NewsletterSection />
    </DashboardLayout>
  );
};

export default Index;