import { PageLayout } from "@/components/layout/PageLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function FAQ() {
  return (
    <PageLayout 
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "FAQ" }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
          </div>
          <p className="text-muted-foreground">
            Find answers to common questions about buying, selling, shipping, and account management.
          </p>
        </header>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="account">
            <AccordionTrigger>Account Management</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <h3 className="font-medium">How do I create an account?</h3>
                <p>Click the "Sign Up" button and follow the registration process. You'll need to verify your email address to complete the setup.</p>
              </div>
              <div>
                <h3 className="font-medium">Can I switch between buyer and seller accounts?</h3>
                <p>Yes, you can upgrade to a seller account at any time by selecting a subscription plan from your account settings.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="selling">
            <AccordionTrigger>Selling on Kollect-It</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <h3 className="font-medium">How do I start selling?</h3>
                <p>Choose a seller subscription plan, complete your profile, and start listing items. Each plan has different item limits and features.</p>
              </div>
              <div>
                <h3 className="font-medium">What can I sell?</h3>
                <p>You can sell antiques, vintage collectibles, fine art, rare books, and jewelry. All items must be authentic and properly documented.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="buying">
            <AccordionTrigger>Buying and Payments</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <h3 className="font-medium">What payment methods are accepted?</h3>
                <p>We accept major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment gateway.</p>
              </div>
              <div>
                <h3 className="font-medium">Is buyer protection available?</h3>
                <p>Yes, all purchases are covered by our buyer protection policy, ensuring you receive your item as described or get your money back.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="shipping">
            <AccordionTrigger>Shipping and Returns</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <h3 className="font-medium">How is shipping handled?</h3>
                <p>Sellers are responsible for shipping items within 3 business days. All valuable items must be insured during transit.</p>
              </div>
              <div>
                <h3 className="font-medium">What is the return policy?</h3>
                <p>Items can be returned within 14 days if they don't match the description. Some restrictions apply to certain categories.</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </PageLayout>
  );
}