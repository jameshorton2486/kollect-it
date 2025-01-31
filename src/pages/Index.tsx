import { DashboardLayout } from "@/components/DashboardLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { PricingSection } from "@/components/home/PricingSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { QualityCommitmentSection } from "@/components/home/QualityCommitmentSection";

const Index = () => {
  return (
    <DashboardLayout>
      <HeroSection />
      <CategoriesSection />
      <PricingSection />
      <QualityCommitmentSection />
      <NewsletterSection />
    </DashboardLayout>
  );
};

export default Index;