import Hero from "../../deployments/Hero";
import FeaturedCollection from "../../deployments/FeaturedCollection";
import ProcessOverview from "../../deployments/ProcessOverview";
import TrustStrip from "../../deployments/TrustStrip (1)";
import Footer from "../../deployments/Footer";
import Header from "../../deployments/Header";

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

