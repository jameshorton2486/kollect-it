import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ShippingReturns() {
  return (
    <PageLayout 
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Shipping & Returns" }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-shop-900 mb-4">Shipping & Returns Policy</h1>
          <p className="text-shop-600">
            Comprehensive information on shipping methods, delivery times, costs, and the returns process.
          </p>
        </header>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-shop-700 mb-2">Delivery Methods</h3>
                <p className="text-shop-600">
                  We offer standard and express shipping options to accommodate your needs.
                  Tracking information is provided for all shipments.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium text-shop-700 mb-2">Processing Times</h3>
                <p className="text-shop-600">
                  Sellers must ship items within 3 business days of purchase.
                  Estimated delivery times vary by location and shipping method.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium text-shop-700 mb-2">Shipping Costs</h3>
                <p className="text-shop-600">
                  Shipping costs are calculated based on item size, weight, and destination.
                  Free shipping may be available for certain items or order values.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Returns Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-shop-700 mb-2">Return Policy</h3>
                <p className="text-shop-600">
                  Items can be returned within 14 days of delivery if they don't match the description.
                  Some categories may have specific return restrictions.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium text-shop-700 mb-2">Return Process</h3>
                <p className="text-shop-600">
                  1. Request a return through your account dashboard<br />
                  2. Receive return shipping label (if applicable)<br />
                  3. Package item securely with all original materials<br />
                  4. Ship item back using provided label or tracking
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium text-shop-700 mb-2">Refunds</h3>
                <p className="text-shop-600">
                  Refunds are processed within 5 business days of receiving the returned item.
                  Original shipping costs may not be refundable.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}