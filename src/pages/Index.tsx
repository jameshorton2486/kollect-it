import { DashboardLayout } from "@/components/DashboardLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { PricingSection } from "@/components/home/PricingSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { QualityCommitmentSection } from "@/components/home/QualityCommitmentSection";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <HeroSection />
        <CategoriesSection />
        <PricingSection />
        <QualityCommitmentSection />
        <NewsletterSection />
      </motion.div>
    </DashboardLayout>
  );
};

export default Index;