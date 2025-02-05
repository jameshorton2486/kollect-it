
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function AuthFAQ() {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="h-5 w-5 text-primary" />
        <h3 className="font-medium">Common Questions</h3>
      </div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="account">
          <AccordionTrigger>Account Management</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p>Click the "Sign Up" button and follow the registration process. You'll need to verify your email address to complete the setup.</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
