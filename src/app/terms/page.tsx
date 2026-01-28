import { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Terms of Service | Kollect-It",
  description: "Terms and conditions for using the Kollect-It marketplace.",
  alternates: {
    canonical: "https://kollect-it.com/terms",
  },
  openGraph: {
    title: "Terms of Service | Kollect-It",
    description: "Terms and conditions for using the Kollect-It marketplace.",
    url: "https://kollect-it.com/terms",
    type: "website",
  },
};

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: (
      <p className="leading-relaxed">
        By using Kollect-It, you agree to these terms. I&apos;ve tried to keep them straightforward—if you have questions, feel free to reach out.
      </p>
    ),
  },
  {
    id: "user-accounts",
    title: "2. User Accounts",
    content: (
      <p className="leading-relaxed">
        You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
      </p>
    ),
  },
  {
    id: "buying-selling",
    title: "3. Buying and Selling",
    content: (
      <p className="leading-relaxed">
        Buyers agree to pay for items purchased. Sellers agree to ship items promptly and accurately describe their condition. All transactions are subject to our authentication process.
      </p>
    ),
  },
  {
    id: "fees-payments",
    title: "4. Fees and Payments",
    content: (
      <p className="leading-relaxed">
        We charge fees for our services as described in our Fee Schedule. You are responsible for paying all fees and applicable taxes.
      </p>
    ),
  },
  {
    id: "returns-refunds",
    title: "5. Returns and Refunds",
    content: (
      <p className="leading-relaxed">
        Our return policy allows for returns within 30 days if the item is not as described. Please review our full Return Policy for details.
      </p>
    ),
  },
  {
    id: "intellectual-property",
    title: "6. Intellectual Property",
    content: (
      <p className="leading-relaxed">
        The content on Kollect-It, including text, graphics, and logos, is the property of Kollect-It or its licensors and is protected by copyright laws.
      </p>
    ),
  },
  {
    id: "limitation-liability",
    title: "7. Limitation of Liability",
    content: (
      <p className="leading-relaxed">
        Kollect-It shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the services.
      </p>
    ),
  },
  {
    id: "contact",
    title: "8. Contact Information",
    content: (
      <p className="leading-relaxed">
        Questions about these terms? Contact me at{" "}
        <a
          href="mailto:jameshorton2486@gmail.com"
          className="text-lux-gold hover:underline"
        >
          jameshorton2486@gmail.com
        </a>{" "}
        and I&apos;ll be happy to clarify anything.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      label="Legal"
      title="Terms of Service"
      description="Please read these terms carefully before using Kollect-It."
      sections={sections}
    />
  );
}
