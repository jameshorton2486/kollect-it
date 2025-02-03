import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export function ConditionGuidelines() {
  const guidelines = [
    {
      condition: "New",
      description: "Item is in original packaging and has never been used.",
      criteria: [
        "Original packaging intact",
        "No signs of wear or aging",
        "All original documentation present",
        "Factory seals unbroken (if applicable)",
      ],
    },
    {
      condition: "Like New",
      description: "Item shows minimal signs of handling or age.",
      criteria: [
        "No visible wear or damage",
        "All parts and pieces present",
        "May be missing original packaging",
        "Documentation present but may show minor handling",
      ],
    },
    {
      condition: "Excellent",
      description: "Item shows minor wear but maintains its original integrity.",
      criteria: [
        "Minor signs of age appropriate wear",
        "No significant flaws or damage",
        "All functional aspects intact",
        "May have minor patina consistent with age",
      ],
    },
    {
      condition: "Good",
      description: "Item shows normal wear consistent with age and use.",
      criteria: [
        "Normal wear patterns visible",
        "All major components intact and functional",
        "May have repairs consistent with age",
        "Patina and wear appropriate to age",
      ],
    },
    {
      condition: "Fair",
      description: "Item shows significant wear or may require minor repairs.",
      criteria: [
        "Visible wear and aging",
        "May need minor repairs",
        "All major components present",
        "Functionality may be impaired but fixable",
      ],
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-shop-600" />
          Condition Assessment Guidelines
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {guidelines.map((guide) => (
            <AccordionItem key={guide.condition} value={guide.condition}>
              <AccordionTrigger className="text-left">
                <span className="font-semibold">{guide.condition}</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p className="text-shop-600">{guide.description}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {guide.criteria.map((criterion, index) => (
                    <li key={index} className="text-shop-600">
                      {criterion}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}