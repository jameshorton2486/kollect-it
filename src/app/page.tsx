import Hero from "@/components/Hero";
import FeaturedCollection from "@/components/FeaturedCollection";
import ProcessOverview from "@/components/ProcessOverview";
import TrustStrip from "@/components/TrustStrip";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function HomePage() {
  return (
    <main role="main">
      <Header />
      <Hero />
      <TrustStrip />
      <FeaturedCollection />
      <ProcessOverview />
      <Footer />
    </main>
  );
}

