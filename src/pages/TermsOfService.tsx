import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Footer } from "@/components/home/Footer";

export default function TermsOfService() {
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
                <BreadcrumbPage>Terms of Service</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </nav>

      <main className="flex-grow max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-shop-900 mb-4">Terms of Service</h1>
          <p className="text-shop-600">Welcome to Kollect-It. By using our platform, you agree to these terms.</p>
        </header>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-shop-800 mb-4">Platform Usage</h2>
            <p className="text-shop-600 mb-4">Detailed terms and conditions governing the use of the Kollect-It platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-shop-800 mb-4">User Responsibilities</h2>
            <p className="text-shop-600 mb-4">User responsibilities and obligations when using our platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-shop-800 mb-4">Buying and Selling Policies</h2>
            <p className="text-shop-600 mb-4">Details on buying and selling policies, including transaction rules.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-shop-800 mb-4">Privacy and Data Usage</h2>
            <p className="text-shop-600 mb-4">Privacy and data usage policies for platform users.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-shop-800 mb-4">Dispute Resolution</h2>
            <p className="text-shop-600 mb-4">Dispute resolution procedures and legal jurisdiction information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-shop-800 mb-4">Updates to Terms</h2>
            <p className="text-shop-600 mb-4">Information about amendments and updates to these terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-shop-800 mb-4">Contact Information</h2>
            <p className="text-shop-600 mb-4">For further inquiries about our terms of service, please contact us.</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}