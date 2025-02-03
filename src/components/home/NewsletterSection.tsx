import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function NewsletterSection() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success!",
      description: "You've been subscribed to our newsletter.",
    });
  };

  return (
    <section className="bg-nav py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Stay Updated
        </h2>
        <p className="text-white/80 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter for the latest collectibles and exclusive offers.
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-4">
          <Input
            type="email"
            placeholder="Enter your email"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            required
          />
          <Button type="submit" className="bg-shop-accent1 hover:bg-shop-600 text-white">
            <Mail className="mr-2 h-4 w-4" />
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}