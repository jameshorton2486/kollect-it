import Hero from "@/components/Hero";
import FeaturedCollection from "@/components/FeaturedCollection";
import ProcessOverview from "@/components/ProcessOverview";
import TrustStrip from "@/components/TrustStrip";

export default function HomePage() {
  return (
    <main role="main">
      <Hero />
      <TrustStrip />
      <FeaturedCollection />
      <ProcessOverview />
    </main>
  );
}

