import { Metadata } from "next";
import Link from "next/link";
import { Search, CreditCard, ShieldCheck, Truck, PackageCheck, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works | Kollect-It",
  description: "Learn how to buy and sell authenticated luxury collectibles on Kollect-It.",
};

export default function HowItWorksPage() {
  return (
    <div style={{ backgroundColor: "#F7F6F2", minHeight: "100vh", color: "#3A3A3A" }}>
      {/* Hero Section */}
      <div style={{ backgroundColor: "#3A3A3A", color: "#FFFFFF", padding: "80px 20px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "serif", fontSize: "3rem", marginBottom: "20px", color: "#C9A66B" }}>How It Works</h1>
        <p style={{ fontSize: "1.2rem", maxWidth: "800px", margin: "0 auto" }}>
          The premier marketplace for authenticated luxury collectibles and antiques.
        </p>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 20px" }}>
        
        {/* Buying Process */}
        <section style={{ marginBottom: "80px" }}>
          <h2 style={{ fontFamily: "serif", fontSize: "2.5rem", marginBottom: "40px", textAlign: "center" }}>Buying Process</h2>
          <div style={{ display: "grid", gap: "30px" }}>
            {[
              { step: 1, title: "Browse & Discover", desc: "Explore our curated collection of authenticated items.", icon: Search },
              { step: 2, title: "Place Order", desc: "Securely purchase your desired item using our protected payment system.", icon: CreditCard },
              { step: 3, title: "Authentication", desc: "Every item is verified by our experts before shipping.", icon: ShieldCheck },
              { step: 4, title: "Secure Shipping", desc: "Items are carefully packaged and shipped with insurance.", icon: Truck },
              { step: 5, title: "Delivery", desc: "Receive your item with our satisfaction guarantee.", icon: PackageCheck }
            ].map((item) => (
              <div key={item.step} style={{ display: "flex", alignItems: "flex-start", backgroundColor: "#FFFFFF", padding: "30px", borderRadius: "8px", border: "1px solid #EAE6DD" }}>
                <div style={{ 
                  backgroundColor: "#C9A66B", 
                  color: "#FFFFFF", 
                  width: "50px", 
                  height: "50px", 
                  borderRadius: "50%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontWeight: "bold",
                  marginRight: "20px",
                  flexShrink: 0
                }}>
                  <item.icon size={24} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "serif", fontSize: "1.5rem", marginBottom: "10px" }}>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px" }}>
          
          {/* Buyer Benefits */}
          <section>
            <h2 style={{ fontFamily: "serif", fontSize: "2rem", marginBottom: "30px", color: "#C9A66B" }}>For Buyers</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {[
                "Authenticity Guarantee",
                "Secure Payment Protection",
                "Insured Global Shipping",
                "Expert Curation",
                "Detailed Condition Reports",
                "30-Day Returns"
              ].map((benefit, i) => (
                <li key={i} style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}>
                  <CheckCircle2 size={20} color="#C9A66B" style={{ marginRight: "10px" }} /> {benefit}
                </li>
              ))}
            </ul>
          </section>

          {/* Seller Benefits */}
          <section>
            <h2 style={{ fontFamily: "serif", fontSize: "2rem", marginBottom: "30px", color: "#C9A66B" }}>For Sellers</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {[
                "Access to Global Collectors",
                "Competitive Commission Rates",
                "Professional Photography",
                "Marketing Support",
                "Secure Payment Processing",
                "Shipping Handling"
              ].map((benefit, i) => (
                <li key={i} style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}>
                  <CheckCircle2 size={20} color="#C9A66B" style={{ marginRight: "10px" }} /> {benefit}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "80px" }}>
          <Link 
            href="/sell" 
            style={{ 
              backgroundColor: "#C9A66B", 
              color: "#FFFFFF", 
              padding: "15px 40px", 
              borderRadius: "4px", 
              textDecoration: "none", 
              fontWeight: "bold",
              fontSize: "1.1rem",
              display: "inline-block"
            }}
          >
            Start Selling Today
          </Link>
        </div>

      </div>
    </div>
  );
}
