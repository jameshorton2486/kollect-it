import { Metadata } from "next";
import { AesopSection } from "@/components/AesopSection";

export const metadata: Metadata = {
  title: "Privacy Policy | Kollect-It",
  description: "Kollect-It Privacy Policy outlining how we collect, use, and protect your information.",
  alternates: {
    canonical: "https://kollect-it.com/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Kollect-It",
    description: "Learn how Kollect-It collects, uses, and protects your personal information.",
    url: "https://kollect-it.com/privacy",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <main>
      <AesopSection variant="cream">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl mb-12 pb-6 border-b-2 border-gold">
            Privacy Policy
          </h1>

          <div className="space-y-10">
            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                1. Information We Collect
              </h2>
              <p className="leading-relaxed text-gray-800">
                We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This includes your name, email address, shipping address, and payment information.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                2. How We Use Your Information
              </h2>
              <p className="leading-relaxed text-gray-800">
                We use the information we collect to process your orders, communicate with you, improve our services, and prevent fraud.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                3. Information Sharing
              </h2>
              <p className="leading-relaxed text-gray-800">
                We do not sell your personal information. We may share your information with third-party service providers who help us operate our business, such as payment processors and shipping carriers.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                4. Data Security
              </h2>
              <p className="leading-relaxed text-gray-800">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                5. Your Rights
              </h2>
              <p className="leading-relaxed text-gray-800">
                You have the right to access, correct, or delete your personal information. You may also object to the processing of your personal information or request that we restrict the processing of your personal information.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                6. Cookies
              </h2>
              <p className="leading-relaxed text-gray-800">
                We use cookies to improve your experience on our website. For more information, please see our Cookie Policy.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                7. Contact Us
              </h2>
              <p className="leading-relaxed text-gray-800">
                Questions about privacy? Reach out to me at james@kollect-it.com. I&apos;m happy to explain how I handle your information.
              </p>
            </section>
          </div>
        </div>
      </AesopSection>
    </main>
  );
}
