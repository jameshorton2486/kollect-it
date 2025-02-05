import { DashboardLayout } from "@/components/DashboardLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { PricingSection } from "@/components/home/PricingSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { QualityCommitmentSection } from "@/components/home/QualityCommitmentSection";
import { motion } from "framer-motion";
import { AuthPromptBanner } from "@/components/auth/AuthPromptBanner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen"
      >
        {!session && <AuthPromptBanner />}
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