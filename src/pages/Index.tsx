
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
import { Helmet } from "react-helmet";

const Index = () => {
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Kollect-It",
    "description": "Your premier destination for collectibles and unique items",
    "url": window.location.origin,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${window.location.origin}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>Kollect-It - Premier Collectibles Marketplace</title>
        <meta name="description" content="Discover unique collectibles and rare items at Kollect-It, your trusted marketplace for collectors and enthusiasts." />
        <meta name="keywords" content="collectibles, rare items, marketplace, antiques, vintage" />
        <link rel="canonical" href={window.location.href} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen"
        role="main"
        aria-label="Homepage content"
      >
        {!session && <AuthPromptBanner />}
        
        <nav className="sr-only focus:not-sr-only" aria-label="Skip navigation">
          <a 
            href="#main-content" 
            className="absolute z-50 bg-white text-black p-3 m-3 -translate-y-16 focus:translate-y-0 transition-transform"
          >
            Skip to main content
          </a>
        </nav>

        <main id="main-content">
          <HeroSection />
          <CategoriesSection />
          <PricingSection />
          <QualityCommitmentSection />
          <NewsletterSection />
        </main>
      </motion.div>
    </DashboardLayout>
  );
};

export default Index;
