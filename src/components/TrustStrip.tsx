"use client";

import { Shield, Award, Truck, HeartHandshake } from "lucide-react";

const trustPoints = [
  {
    icon: Shield,
    title: "100% Authenticated",
    description: "Every item professionally verified and documented",
  },
  {
    icon: Award,
    title: "Expert Curation",
    description: "Personally selected by experienced collectors",
  },
  {
    icon: Truck,
    title: "Secure Shipping",
    description: "Fully insured delivery worldwide",
  },
  {
    icon: HeartHandshake,
    title: "Transparent Pricing",
    description: "Fair market value with no hidden fees",
  },
];

export function TrustStrip() {
  return (
    <section className="py-12 md:py-16 bg-surface-1 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                  <Icon className="h-8 w-8 text-gold" />
                </div>

                {/* Title */}
                <h3 className="font-serif text-ink font-semibold text-lg mb-2">
                  {point.title}
                </h3>

                {/* Description */}
                <p className="text-ink/70 text-sm leading-relaxed">
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
