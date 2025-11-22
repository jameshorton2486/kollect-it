import { Metadata } from "next";
import { AesopSection } from "@/components/AesopSection";

export const metadata: Metadata = {
  title: "Terms of Service | Kollect-It",
  description: "Terms and conditions for using the Kollect-It marketplace.",
};

export default function TermsPage() {
  return (
    <main>
      <AesopSection variant="sand">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl mb-12 pb-6 border-b-2 border-gold">
            Terms of Service
          </h1>

          <div className="space-y-10">
            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                1. Acceptance of Terms
              </h2>
              <p className="leading-relaxed text-ink-light">
                By accessing or using the Kollect-It marketplace, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our services.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                2. User Accounts
              </h2>
              <p className="leading-relaxed text-ink-light">
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                3. Buying and Selling
              </h2>
              <p className="leading-relaxed text-ink-light">
                Buyers agree to pay for items purchased. Sellers agree to ship items promptly and accurately describe their condition. All transactions are subject to our authentication process.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                4. Fees and Payments
              </h2>
              <p className="leading-relaxed text-ink-light">
                We charge fees for our services as described in our Fee Schedule. You are responsible for paying all fees and applicable taxes.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                5. Returns and Refunds
              </h2>
              <p className="leading-relaxed text-ink-light">
                Our return policy allows for returns within 30 days if the item is not as described. Please review our full Return Policy for details.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                6. Intellectual Property
              </h2>
              <p className="leading-relaxed text-ink-light">
                The content on Kollect-It, including text, graphics, and logos, is the property of Kollect-It or its licensors and is protected by copyright laws.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                7. Limitation of Liability
              </h2>
              <p className="leading-relaxed text-ink-light">
                Kollect-It shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the services.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4 text-gold">
                8. Contact Information
              </h2>
              <p className="leading-relaxed text-ink-light">
                For any questions regarding these Terms, please contact us at legal@kollect-it.com.
              </p>
            </section>
          </div>
        </div>
      </AesopSection>
    </main>
  );
}
