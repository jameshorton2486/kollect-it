import { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Refund Policy | Kollect-It",
  description: "Our refund and return policy for authenticated antiques and collectibles.",
  alternates: {
    canonical: "https://kollect-it.com/refund-policy",
  },
  openGraph: {
    title: "Refund Policy | Kollect-It",
    description: "Our refund and return policy for authenticated antiques and collectibles.",
    url: "https://kollect-it.com/refund-policy",
    type: "website",
  },
};

const sections = [
  {
    id: "commitment",
    title: "1. Our Commitment",
    content: (
      <p className="leading-relaxed">
        At Kollect-It, I stand behind every item I sell. If something isn&apos;t right, I want to make it right. This policy outlines how refunds and returns work.
      </p>
    ),
  },
  {
    id: "eligibility",
    title: "2. Eligibility for Refunds",
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">
          You may request a refund if:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>The item arrives damaged during shipping</li>
          <li>The item is significantly not as described in the listing</li>
          <li>The item fails authentication verification</li>
          <li>You contact me within 48 hours of delivery for any other concerns</li>
        </ul>
      </div>
    ),
  },
  {
    id: "refund-process",
    title: "3. Refund Process",
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">
          To request a refund:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Contact me at{" "}
            <a
              href="mailto:james@kollect-it.com"
              className="text-lux-gold hover:underline"
            >
              james@kollect-it.com
            </a>{" "}
            within 48 hours of delivery</li>
          <li>Include your order number and photos of any issues</li>
          <li>I&apos;ll respond within 24 hours with next steps</li>
          <li>If approved, return shipping instructions will be provided</li>
        </ol>
      </div>
    ),
  },
  {
    id: "refund-timeline",
    title: "4. Refund Timeline",
    content: (
      <p className="leading-relaxed">
        Once I receive and inspect the returned item, refunds are processed within 5-7 business days. The refund will be credited to your original payment method. Depending on your bank or card issuer, it may take an additional 5-10 business days for the refund to appear on your statement.
      </p>
    ),
  },
  {
    id: "return-shipping",
    title: "5. Return Shipping",
    content: (
      <p className="leading-relaxed">
        If the return is due to an error on my part (wrong item, damage, or misrepresentation), I will cover return shipping costs. For other returns, the buyer is responsible for return shipping.
      </p>
    ),
  },
  {
    id: "non-refundable",
    title: "6. Non-Refundable Situations",
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">
          Refunds are generally not available for:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Change of mind after 48 hours</li>
          <li>Items damaged after delivery due to mishandling</li>
          <li>Items not returned in original condition</li>
          <li>Custom or commissioned pieces (unless defective)</li>
        </ul>
      </div>
    ),
  },
  {
    id: "partial-refunds",
    title: "7. Partial Refunds",
    content: (
      <p className="leading-relaxed">
        In some cases, a partial refund may be offered if an item has minor issues that don&apos;t warrant a full return. This will be discussed on a case-by-case basis.
      </p>
    ),
  },
  {
    id: "contact",
    title: "8. Contact",
    content: (
      <p className="leading-relaxed">
        Questions about refunds? Reach out to me at{" "}
        <a
          href="mailto:james@kollect-it.com"
          className="text-lux-gold hover:underline"
        >
          james@kollect-it.com
        </a>{" "}
        or call{" "}
        <a
          href="tel:+14693866065"
          className="text-lux-gold hover:underline"
        >
          469-386-6065
        </a>
        . I handle every situation personally—no automated processes, just a direct conversation about how to make things right.
      </p>
    ),
  },
];

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      label="Legal"
      title="Refund Policy"
      sections={sections}
    />
  );
}
