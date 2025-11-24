import Hero from "@/components/Hero";
import FeaturedCollection from "@/components/home/FeaturedCollection";
import ProcessOverview from "@/components/home/ProcessOverview";
import TrustStrip from "@/components/home/TrustStrip";import Footer from "@/components/Footer";
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

