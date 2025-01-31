import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Footer } from "@/components/home/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Privacy Policy</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </nav>

      <main className="flex-grow max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-shop-900 mb-4">Privacy Policy</h1>
          <p className="text-shop-600">Introduction to the Privacy Policy, outlining our commitment to protect user information.</p>
        </header>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-shop-800 mb-4">Information Collection</h2>
            <p className="text-shop-600 mb-4">Details about what personal information we collect and how we collect it.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-shop-800 mb-4">Information Usage</h2>
            <p className="text-shop-600 mb-4">How we use and process your personal information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-shop-800 mb-4">Information Sharing</h2>
            <p className="text-shop-600 mb-4">When and how we share your information with third parties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-shop-800 mb-4">Data Security</h2>
            <p className="text-shop-600 mb-4">Measures we take to protect your personal information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-shop-800 mb-4">Your Rights</h2>
            <p className="text-shop-600 mb-4">Your rights regarding your personal information and how to exercise them.</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}