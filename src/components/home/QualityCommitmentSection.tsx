import { Shield, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export function QualityCommitmentSection() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="section-padding bg-shop-50"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-green-500" />
            <h2 className="heading-responsive text-shop-900">
              Our Commitment to Quality
            </h2>
          </div>
          <p className="text-responsive text-shop-600 max-w-2xl mx-auto">
            We maintain high standards to ensure a trustworthy marketplace for all collectors
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6 hover-lift">
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
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6 hover-lift">
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
          </motion.div>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-responsive text-shop-600 max-w-3xl mx-auto mb-8">
            Our commitment to quality ensures that every item listed on Kollect-It meets our 
            high standards for accuracy and authenticity. We take pride in maintaining a 
            trusted marketplace where collectors can buy and sell with confidence.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}