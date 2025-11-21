import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Options | Kollect-It",
  description: "Secure payment methods available on Kollect-It.",
};

export default function PaymentPage() {
  return (
    <div style={{ backgroundColor: "#F7F6F2", minHeight: "100vh", padding: "60px 20px", color: "#3A3A3A" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontFamily: "serif", fontSize: "3rem", marginBottom: "40px", textAlign: "center" }}>Payment Options</h1>
        
        <div style={{ display: "grid", gap: "30px", marginBottom: "60px" }}>
          {[
            { 
              title: "Credit Cards", 
              features: ["Visa, Mastercard, American Express, Discover", "Instant processing", "Secure encryption"] 
            },
            { 
              title: "PayPal", 
              features: ["Pay with your PayPal balance", "Buyer Protection included", "Quick checkout"] 
            },
            { 
              title: "Bank Transfer", 
              features: ["Direct wire transfer", "Ideal for high-value items", "Secure processing"] 
            },
            { 
              title: "Installment Plans", 
              features: ["Buy now, pay later", "Flexible monthly payments", "Interest-free options available"] 
            }
          ].map((method) => (
            <div key={method.title} style={{ backgroundColor: "#FFFFFF", padding: "30px", borderRadius: "8px", border: "1px solid #EAE6DD" }}>
              <h2 style={{ fontFamily: "serif", fontSize: "1.8rem", marginBottom: "15px", color: "#C9A66B" }}>{method.title}</h2>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {method.features.map((feature, i) => (
                  <li key={i} style={{ marginBottom: "8px", display: "flex", alignItems: "center" }}>
                    <span style={{ color: "#C9A66B", marginRight: "10px" }}>•</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: "#3A3A3A", color: "#FFFFFF", padding: "40px", borderRadius: "8px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "serif", fontSize: "2rem", marginBottom: "20px", color: "#C9A66B" }}>Security Guarantee</h2>
          <p style={{ lineHeight: "1.6" }}>
            Your security is our top priority. All transactions are encrypted using industry-standard SSL technology. 
            We never store your full credit card details on our servers.
          </p>
        </div>
      </div>
    </div>
  );
}
