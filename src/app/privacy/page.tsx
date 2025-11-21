import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Kollect-It",
  description: "Kollect-It Privacy Policy outlining how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <div style={{ backgroundColor: "#F7F6F2", minHeight: "100vh", padding: "60px 20px", color: "#3A3A3A" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "#FFFFFF", padding: "60px", borderRadius: "8px", border: "1px solid #EAE6DD" }}>
        <h1 style={{ fontFamily: "serif", fontSize: "3rem", marginBottom: "40px", borderBottom: "2px solid #C9A66B", paddingBottom: "20px" }}>Privacy Policy</h1>
        
        <div style={{ display: "grid", gap: "40px" }}>
          <section>
            <h2 style={{ fontFamily: "serif", fontSize: "1.8rem", marginBottom: "15px", color: "#C9A66B" }}>1. Information We Collect</h2>
            <p style={{ lineHeight: "1.6" }}>
              We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This includes your name, email address, shipping address, and payment information.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "serif", fontSize: "1.8rem", marginBottom: "15px", color: "#C9A66B" }}>2. How We Use Your Information</h2>
            <p style={{ lineHeight: "1.6" }}>
              We use the information we collect to process your orders, communicate with you, improve our services, and prevent fraud.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "serif", fontSize: "1.8rem", marginBottom: "15px", color: "#C9A66B" }}>3. Information Sharing</h2>
            <p style={{ lineHeight: "1.6" }}>
              We do not sell your personal information. We may share your information with third-party service providers who help us operate our business, such as payment processors and shipping carriers.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "serif", fontSize: "1.8rem", marginBottom: "15px", color: "#C9A66B" }}>4. Data Security</h2>
            <p style={{ lineHeight: "1.6" }}>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "serif", fontSize: "1.8rem", marginBottom: "15px", color: "#C9A66B" }}>5. Your Rights</h2>
            <p style={{ lineHeight: "1.6" }}>
              You have the right to access, correct, or delete your personal information. You may also object to the processing of your personal information or request that we restrict the processing of your personal information.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "serif", fontSize: "1.8rem", marginBottom: "15px", color: "#C9A66B" }}>6. Cookies</h2>
            <p style={{ lineHeight: "1.6" }}>
              We use cookies to improve your experience on our website. For more information, please see our Cookie Policy.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "serif", fontSize: "1.8rem", marginBottom: "15px", color: "#C9A66B" }}>7. Contact Us</h2>
            <p style={{ lineHeight: "1.6" }}>
              If you have any questions about this Privacy Policy, please contact us at privacy@kollect-it.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
