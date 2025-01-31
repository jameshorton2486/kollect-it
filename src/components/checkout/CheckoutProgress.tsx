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
    <div className="w-full py-4">
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isActive = index <= getCurrentStepIndex();
          const Icon = step.icon;
          
          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div className="relative flex items-center justify-center w-full">
                <div
                  className={`h-1 flex-1 ${
                    index === 0 ? "invisible" : isActive ? "bg-shop-accent1" : "bg-gray-200"
                  }`}
                />
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${
                      isActive
                        ? "bg-shop-accent1 text-white"
                        : "bg-gray-200 text-gray-400"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div
                  className={`h-1 flex-1 ${
                    index === steps.length - 1
                      ? "invisible"
                      : index < getCurrentStepIndex()
                      ? "bg-shop-accent1"
                      : "bg-gray-200"
                  }`}
                />
              </div>
              <span
                className={`mt-2 text-sm ${
                  isActive ? "text-shop-accent1 font-medium" : "text-gray-400"
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