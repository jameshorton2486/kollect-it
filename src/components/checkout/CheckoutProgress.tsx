
import { Check, ShoppingCart, Truck, CreditCard } from "lucide-react";

interface CheckoutProgressProps {
  currentStep: "cart" | "shipping" | "payment" | "confirmation";
}

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  const steps = [
    { id: "cart", label: "Cart", icon: ShoppingCart },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "confirmation", label: "Confirmation", icon: Check },
  ] as const;

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.id === currentStep);
  };

  return (
    <div className="w-full py-6">
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isActive = index <= getCurrentStepIndex();
          const Icon = step.icon;
          
          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div className="relative flex items-center justify-center w-full">
                <div
                  className={`h-0.5 flex-1 ${
                    index === 0 ? "invisible" : isActive ? "bg-[#C6A961]" : "bg-gray-200"
                  }`}
                />
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    transition-all duration-300
                    ${
                      isActive
                        ? "bg-[#C6A961] text-white shadow-lg scale-110"
                        : "bg-gray-200 text-gray-400"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div
                  className={`h-0.5 flex-1 ${
                    index === steps.length - 1
                      ? "invisible"
                      : index < getCurrentStepIndex()
                      ? "bg-[#C6A961]"
                      : "bg-gray-200"
                  }`}
                />
              </div>
              <span
                className={`mt-3 text-sm font-medium transition-colors duration-300 ${
                  isActive ? "text-[#C6A961]" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
