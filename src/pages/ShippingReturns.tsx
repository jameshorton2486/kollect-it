import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Footer } from "@/components/home/Footer";

export default function ShippingReturns() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Breadcrumbs 
            items={[
              { label: "Home", href: "/" },
              { label: "Shipping & Returns", href: "/shipping-returns" }
            ]} 
          />
        </div>
      </nav>

      <main className="flex-grow max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-shop-900 mb-4">Shipping & Returns Policy</h1>
          <p className="text-shop-600">Comprehensive information on shipping methods, delivery times, costs, and the returns process.</p>
        </header>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-shop-800 mb-4">Shipping Information</h2>
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-shop-700">Delivery Methods</h3>
              <p className="text-shop-600">Information about our standard and express shipping options.</p>
              
              <h3 className="text-xl font-medium text-shop-700">Processing Times</h3>
              <p className="text-shop-600">Details about order processing and estimated delivery timeframes.</p>
              
              <h3 className="text-xl font-medium text-shop-700">Shipping Costs</h3>
              <p className="text-shop-600">Explanation of shipping rates and any free shipping offers.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-shop-800 mb-4">Returns Process</h2>
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-shop-700">Return Policy</h3>
              <p className="text-shop-600">Our return policy and eligible items for return.</p>
              
              <h3 className="text-xl font-medium text-shop-700">Return Process</h3>
              <p className="text-shop-600">Step-by-step guide on how to return items.</p>
              
              <h3 className="text-xl font-medium text-shop-700">Refunds</h3>
              <p className="text-shop-600">Information about refund processing and timeframes.</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}