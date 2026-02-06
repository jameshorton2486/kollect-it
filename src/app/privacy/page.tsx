import { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

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

const sections = [
  {
    id: "information-collect",
    title: "1. Information We Collect",
    content: (
      <p className="leading-relaxed">
        We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This includes your name, email address, shipping address, and payment information.
      </p>
    ),
  },
  {
    id: "how-we-use",
    title: "2. How We Use Your Information",
    content: (
      <p className="leading-relaxed">
        We use the information we collect to process your orders, communicate with you, improve our services, and prevent fraud.
      </p>
    ),
  },
  {
    id: "information-sharing",
    title: "3. Information Sharing",
    content: (
      <p className="leading-relaxed">
        We do not sell your personal information. We may share your information with third-party service providers who help us operate our business, such as payment processors and shipping carriers.
      </p>
    ),
  },
  {
    id: "data-security",
    title: "4. Data Security",
    content: (
      <p className="leading-relaxed">
        We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "5. Your Rights",
    content: (
      <p className="leading-relaxed">
        You have the right to access, correct, or delete your personal information. You may also object to the processing of your personal information or request that we restrict the processing of your personal information.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "6. Cookies",
    content: (
      <p className="leading-relaxed">
        We use cookies to improve your experience on our website. For more information, please see our Cookie Policy.
      </p>
    ),
  },
  {
    id: "contact",
    title: "7. Contact Us",
    content: (
      <p className="leading-relaxed">
        Questions about privacy? Reach out to me at{" "}
        <a
          href="mailto:info@kollect-it.com"
          className="text-lux-gold hover:underline"
        >
          info@kollect-it.com
        </a>
        . I&apos;m happy to explain how I handle your information.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      label="Legal"
      title="Privacy Policy"
      description="How we collect, use, and protect your information."
      sections={sections}
    />
  );
}
