import { Testimonial } from "./Testimonial";

const testimonials = [
  {
    content: "The subscription model has saved me thousands compared to traditional marketplaces. Highly recommended!",
    author: "Sarah Johnson",
    role: "Vintage Collector"
  },
  {
    content: "Easy to use platform with a great community of collectors. The no-commission approach is fantastic.",
    author: "Michael Chen",
    role: "Antique Dealer"
  },
  {
    content: "Finally, a platform that understands the needs of antique sellers. The pricing is transparent and fair.",
    author: "Emma Thompson",
    role: "Art Dealer"
  }
];

export function TestimonialGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
      {testimonials.map((testimonial, index) => (
        <Testimonial key={index} {...testimonial} />
      ))}
    </div>
  );
}