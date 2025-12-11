"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

interface FAQAccordionProps {
  /** Array of FAQ items */
  items: FAQItem[];
  /** Allow multiple items open at once */
  allowMultiple?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * FAQAccordion - A styled accordion component for FAQs
 *
 * Used for: FAQ pages, help sections, collapsible content
 *
 * @example
 * <FAQAccordion
 *   items={[
 *     { question: "How do I purchase?", answer: "Browse and add items to cart..." },
 *     { question: "What is your return policy?", answer: "We accept returns within 30 days..." }
 *   ]}
 * />
 */
export function FAQAccordion({
  items,
  allowMultiple = false,
  className = "",
}: FAQAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, index) => {
        const isOpen = openItems.has(index);
        return (
          <div
            key={index}
            className="border border-border-200 rounded-lg bg-white overflow-hidden transition-all duration-200 hover:shadow-clean"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 transition-colors duration-200 hover:bg-lux-cream/50"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
            >
              <h3 className="font-serif text-lg font-medium text-lux-black pr-4">
                {item.question}
              </h3>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-lux-gold flex-shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 text-lux-gray flex-shrink-0" />
              )}
            </button>
            {isOpen && (
              <div
                id={`faq-answer-${index}`}
                className="px-6 pb-4 text-ink-700 leading-relaxed"
              >
                {typeof item.answer === "string" ? (
                  <p>{item.answer}</p>
                ) : (
                  item.answer
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default FAQAccordion;
