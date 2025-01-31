import { Shield, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

export function QualityCommitmentSection() {
  return (
    <section className="py-20 px-4 bg-shop-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-green-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-shop-900">
              Our Commitment to Quality
            </h2>
          </div>
          <p className="text-lg text-shop-600 max-w-2xl mx-auto">
            We maintain high standards to ensure a trustworthy marketplace for all collectors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-shop-800 mb-2">
                  First Violation
                </h3>
                <p className="text-shop-600">
                  Sellers receive a warning and the listing will be removed
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-shop-800 mb-2">
                  Second Violation
                </h3>
                <p className="text-shop-600">
                  Results in permanent account suspension
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-shop-600 max-w-3xl mx-auto mb-8">
            Our commitment to quality ensures that every item listed on Kollect-It meets our 
            high standards for accuracy and authenticity. We take pride in maintaining a 
            trusted marketplace where collectors can buy and sell with confidence.
          </p>
        </div>
      </div>
    </section>
  );
}