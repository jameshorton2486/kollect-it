
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, FileText, UserCheck, Scale, Lock, Bell, FileWarning, HelpCircle } from "lucide-react";

interface TermSection {
  icon: React.ReactNode;
  title: string;
  content: string;
}

export default function TermsOfService() {
  const sections: TermSection[] = [
    {
      icon: <Shield className="h-6 w-6 text-shop-600" />,
      title: "Platform Usage",
      content: "By accessing and using Kollect-It, you agree to comply with these terms and conditions. Our platform is designed for collectors and enthusiasts to buy, sell, and trade collectible items. Users must be at least 18 years old or have parental consent to use our services. We reserve the right to modify these terms at any time, with notice to our users."
    },
    {
      icon: <UserCheck className="h-6 w-6 text-shop-600" />,
      title: "User Responsibilities",
      content: "Users are responsible for maintaining the security of their accounts and ensuring all listing information is accurate and truthful. You agree not to engage in any fraudulent activities, misrepresentation of items, or harassment of other users. Users must respect intellectual property rights and only list items they have the right to sell."
    },
    {
      icon: <FileText className="h-6 w-6 text-shop-600" />,
      title: "Buying and Selling Policies",
      content: "All transactions must be completed through our platform's secure payment system. Sellers must accurately describe items, including condition, authenticity, and any defects. Buyers must make payments promptly and provide accurate shipping information. We maintain a fair dispute resolution process for all transactions."
    },
    {
      icon: <Lock className="h-6 w-6 text-shop-600" />,
      title: "Privacy and Data Usage",
      content: "We are committed to protecting your privacy and handling your personal information responsibly. Data collection and usage are governed by our Privacy Policy. We implement industry-standard security measures to protect your information and transactions. Users have the right to request their data and opt out of certain data collection practices."
    },
    {
      icon: <Scale className="h-6 w-6 text-shop-600" />,
      title: "Dispute Resolution",
      content: "In case of disputes between users, our platform provides a structured resolution process. Users agree to attempt resolution through our internal system before seeking external remedies. We reserve the right to mediate disputes and make final decisions regarding platform-related conflicts. Legal proceedings, if necessary, shall be governed by applicable laws."
    },
    {
      icon: <Bell className="h-6 w-6 text-shop-600" />,
      title: "Updates to Terms",
      content: "We may update these terms to reflect changes in our services, legal requirements, or platform policies. Users will be notified of significant changes via email or platform notifications. Continued use of the platform after changes constitutes acceptance of the updated terms."
    },
    {
      icon: <FileWarning className="h-6 w-6 text-shop-600" />,
      title: "Prohibited Items and Conduct",
      content: "Certain items are prohibited from being listed on our platform, including counterfeit goods, illegal items, and hazardous materials. Users must not engage in harassment, hate speech, or any form of discriminatory behavior. Violations may result in account suspension or termination."
    },
    {
      icon: <HelpCircle className="h-6 w-6 text-shop-600" />,
      title: "Contact Information",
      content: "For questions about these terms or to report violations, please contact our support team at support@kollect-it.com or call 1-800-KOLLECT. Our support team is available Monday through Friday, 9 AM to 5 PM EST. For urgent matters, please use our 24/7 online reporting system."
    }
  ];

  const lastUpdated = new Date("2024-01-01").toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-shop-900 mb-4">Terms of Service</h1>
          <p className="text-shop-600 max-w-2xl mx-auto">
            Welcome to Kollect-It. These terms govern your use of our platform and services.
            By using our platform, you agree to these terms.
          </p>
          <p className="text-sm text-shop-500 mt-4">
            Last updated: {lastUpdated}
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          {sections.map((section, index) => (
            <Card key={index} className="transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-shop-800 mb-3">
                      {section.title}
                    </h2>
                    <p className="text-shop-600 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <footer className="mt-12 text-center text-shop-500 text-sm">
          <p>
            These terms of service constitute a legally binding agreement between you and Kollect-It.
            If you have any questions, please contact our support team.
          </p>
        </footer>
      </div>
    </PageLayout>
  );
}
