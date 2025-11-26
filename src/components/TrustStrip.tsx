import React from "react";

const items = [
  {
    title: "Thoughtfully Selected",
    body: "Every item is hand-chosen for its quality, character, or story.",
  },
  {
    title: "Clear Descriptions",
    body: "Photos and details are straightforward so you know what to expect.",
  },
  {
    title: "Estate & Collector Finds",
    body: "Pieces come from local estates, auctions, and long-held collections.",
  },
  {
    title: "Personal Service",
    body: "This is a one-person shop. If you have a question, you talk directly to me.",
  },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-border-200 bg-surface-0">
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          {items.map((item) => (
            <div key={item.title} className="space-y-2">
              <div className="text-xs font-semibold tracking-[0.22em] text-gold-500 uppercase">
                {item.title}
              </div>
              <p className="text-sm text-ink-600 leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}