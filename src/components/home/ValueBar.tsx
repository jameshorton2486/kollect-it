import { Shield, Truck, FileText } from "lucide-react";

const trustItems = [
  {
    icon: Shield,
    title: "Expert Authentication",
    caption: "Every piece is researched and evaluated before listing.",
  },
  {
    icon: Truck,
    title: "Secure Packing & Shipping",
    caption: "Professional handling and reliable delivery worldwide.",
  },
  {
    icon: FileText,
    title: "Provenance When Available",
    caption: "Documentation and history provided with each item.",
  },
];

export default function ValueBar() {
  return (
    <section className="bg-lux-cream section-tight">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {trustItems.map((item) => (
            <div key={item.title} className="space-y-3">
              <item.icon className="mx-auto h-8 w-8 text-lux-gold" strokeWidth={1.5} />
              <h3 className="heading-subsection text-lux-charcoal">{item.title}</h3>
              <p className="text-muted">{item.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


