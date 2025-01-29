import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold text-shop-900">
          Stay Updated with the Latest in Collecting
        </h2>
        <p className="text-lg text-shop-600">
          Subscribe to our newsletter for updates on new arrivals, exclusive events, and collecting tips from experts!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
          <Input
            type="email"
            placeholder="Your email address"
            className="flex-1"
          />
          <Button size="lg">Subscribe</Button>
        </div>
        <p className="text-sm text-shop-500">
          By subscribing, you consent to our Privacy Policy and agree to receive updates.
        </p>
      </div>
    </section>
  );
}