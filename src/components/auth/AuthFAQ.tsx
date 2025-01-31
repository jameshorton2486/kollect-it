import { HelpCircle } from "lucide-react";

export function AuthFAQ() {
  return (
    <div className="mt-8 space-y-4 border rounded-lg p-4 bg-muted/50">
      <div className="flex items-start gap-3">
        <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
        <div>
          <h3 className="font-medium mb-2">Frequently Asked Questions</h3>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium">How do I get started?</h4>
              <p>Create an account, verify your email, and start exploring our vast collection of unique items.</p>
            </div>
            <div>
              <h4 className="font-medium">Is my information secure?</h4>
              <p>Absolutely! We use industry-standard encryption and security measures to protect your data.</p>
            </div>
            <div>
              <h4 className="font-medium">What features do I get access to?</h4>
              <p>Members enjoy exclusive features like watchlists, price alerts, and early access to special collections!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}