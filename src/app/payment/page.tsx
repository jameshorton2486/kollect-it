import { Metadata } from "next";
import { CreditCard, Wallet, Landmark, CalendarClock, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Options | Kollect-It",
  description: "Secure payment methods available on Kollect-It.",
};

export default function PaymentPage() {
  return (
    <div className="bg-surface-50 min-h-screen px-5 py-15 text-ink-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl mb-10 text-center">Payment Options</h1>
        
        <div className="grid gap-8 mb-15">
          {[
            { 
              title: "Credit Cards", 
              icon: CreditCard,
              features: ["Visa, Mastercard, American Express, Discover", "Instant processing", "Secure encryption"] 
            },
            { 
              title: "PayPal", 
              icon: Wallet,
              features: ["Pay with your PayPal balance", "Buyer Protection included", "Quick checkout"] 
            },
            { 
              title: "Bank Transfer", 
              icon: Landmark,
              features: ["Direct wire transfer", "Ideal for high-value items", "Secure processing"] 
            },
            { 
              title: "Installment Plans", 
              icon: CalendarClock,
              features: ["Buy now, pay later", "Flexible monthly payments", "Interest-free options available"] 
            }
          ].map((method) => (
            <div key={method.title} className="bg-surface-0 p-8 rounded-lg border border-border-200">
              <div className="flex items-center mb-4">
                <method.icon size={32} className="text-gold-500 mr-4" />
                <h2 className="font-serif text-2xl text-gold-500 m-0">{method.title}</h2>
              </div>
              <ul className="list-none p-0 ml-12">
                {method.features.map((feature, i) => (
                  <li key={i} className="mb-2 flex items-center">
                    <span className="text-gold-500 mr-3">•</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: "#3A3A3A", color: "#FFFFFF", padding: "40px", borderRadius: "8px", textAlign: "center" }}>
          <ShieldCheck size={48} color="#C9A66B" style={{ margin: "0 auto 20px" }} />
          <h2 style={{ fontFamily: "serif", fontSize: "2rem", marginBottom: "20px", color: "#C9A66B" }}>Security Guarantee</h2>
          <p style={{ lineHeight: "1.6" }}>
            Your security is our top priority. All transactions are encrypted using industry-standard SSL technology. 
            We never store your full credit card details on our servers.
          </p>
        </div>
      </div>
    </div>
  );
}
