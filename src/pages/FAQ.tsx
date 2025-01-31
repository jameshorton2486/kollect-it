import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Footer } from "@/components/home/Footer";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar placeholder */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>FAQ</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </nav>

      {/* Header Section */}
      <header className="bg-shop-50 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <HelpCircle className="h-12 w-12 text-shop-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-shop-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-shop-600 max-w-2xl mx-auto">
            Find answers to common questions about buying, selling, shipping, and account management.
          </p>
        </div>
      </header>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I create an account?</AccordionTrigger>
              <AccordionContent>
                Click the "Sign Up" button in the top right corner and follow the registration process. You'll need to provide your email address and create a password.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How do I list an item for sale?</AccordionTrigger>
              <AccordionContent>
                After creating a seller account, go to your dashboard and click "List New Item." Fill out the required information including photos, description, and pricing.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What payment methods are accepted?</AccordionTrigger>
              <AccordionContent>
                We accept major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment gateway.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-shop-50 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-shop-600 mb-6">Our support team is here to help you.</p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-shop-600 text-white rounded-lg hover:bg-shop-700 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}