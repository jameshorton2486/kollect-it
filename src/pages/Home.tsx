import { DashboardLayout } from "@/components/DashboardLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedListingsSection } from "@/components/home/FeaturedListingsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { Footer } from "@/components/home/Footer";

const Home = () => {
  return (
    <DashboardLayout>
      <main className="min-h-screen">
        <HeroSection />
        <CategoriesSection />
        <FeaturedListingsSection />
        <HowItWorksSection />
        <Footer />
      </main>
    </DashboardLayout>
  );
};

export default Home;