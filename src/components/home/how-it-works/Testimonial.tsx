import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TestimonialProps {
  content: string;
  author: string;
  role: string;
}

export function Testimonial({ content, author, role }: TestimonialProps) {
  return (
    <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-all">
      <div className="flex items-start gap-2 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
        ))}
      </div>
      <p className="text-shop-600 mb-4 italic">"{content}"</p>
      <div>
        <p className="font-semibold text-shop-800">{author}</p>
        <p className="text-sm text-shop-500">{role}</p>
      </div>
    </Card>
  );
}