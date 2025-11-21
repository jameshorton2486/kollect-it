import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Kollect-It",
  description: "Terms and conditions for using the Kollect-It marketplace.",
};

export default function TermsPage() {
  return (
    <div style={{ backgroundColor: "#F7F6F2", minHeight: "100vh", padding: "60px 20px", color: "#3A3A3A" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "#FFFFFF", padding: "60px", borderRadius: "8px", border: "1px solid #EAE6DD" }}>
        <h1 style={{ fontFamily: "serif", fontSize: "3rem", marginBottom: "40px", borderBottom: "2px solid #C9A66B", paddingBottom: "20px" }}>Terms of Service</h1>
        
        <div style={{ display: "grid", gap: "40px" }}>
          <section>
            <h2 style={{ fontFamily: "serif", fontSize: "1.8rem", marginBottom: "15px", color: "#C9A66B" }}>1. Acceptance of Terms</h2>
            <p style={{ lineHeight: "1.6" }}>
              By accessing or using the Kollect-It marketplace, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our services.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "serif", fontSize: "1.8rem", marginBottom: "15px", color: "#C9A66B" }}>2. User Accounts</h2>
            <p style={{ lineHeight: "1.6" }}>
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "serif", fontSize: "1.8rem", marginBottom: "15px", color: "#C9A66B" }}>3. Buying and Selling</h2>
            <p style={{ lineHeight: "1.6" }}>
              Buyers agree to pay for items purchased. Sellers agree to ship items promptly and accurately describe their condition. All transactions are subject to our authentication process.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "serif", fontSize: "1.8rem", marginBottom: "15px", color: "#C9A66B" }}>4. Fees and Payments</h2>
            <p style={{ lineHeight: "1.6" }}>
              We charge fees for our services as described in our Fee Schedule. You are responsible for paying all fees and applicable taxes.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "serif", fontSize: "1.8rem", marginBottom: "15px", color: "#C9A66B" }}>5. Returns and Refunds</h2>
            <p style={{ lineHeight: "1.6" }}>
              Our return policy allows for returns within 30 days if the item is not as described. Please review our full Return Policy for details.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "serif", fontSize: "1.8rem", marginBottom: "15px", color: "#C9A66B" }}>6. Intellectual Property</h2>
            <p style={{ lineHeight: "1.6" }}>
              The content on Kollect-It, including text, graphics, and logos, is the property of Kollect-It or its licensors and is protected by copyright laws.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "serif", fontSize: "1.8rem", marginBottom: "15px", color: "#C9A66B" }}>7. Limitation of Liability</h2>
            <p style={{ lineHeight: "1.6" }}>
              Kollect-It shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the services.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "serif", fontSize: "1.8rem", marginBottom: "15px", color: "#C9A66B" }}>8. Contact Information</h2>
            <p style={{ lineHeight: "1.6" }}>
              For any questions regarding these Terms, please contact us at legal@kollect-it.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
