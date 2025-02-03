import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type NewsletterForm = z.infer<typeof newsletterSchema>;

export function NewsletterSection() {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = (data: NewsletterForm) => {
    toast({
      title: "Success!",
      description: "You've been subscribed to our newsletter.",
    });
    reset();
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-nav section-padding"
    >
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="heading-responsive text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-responsive text-white/80 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest collectibles and exclusive offers.
          </p>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit(onSubmit)} 
          className="max-w-md mx-auto flex flex-col sm:flex-row gap-4"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex-1">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-300 mt-1 text-left">
                {errors.email.message}
              </p>
            )}
          </div>
          <Button 
            type="submit" 
            className="bg-shop-accent1 hover:bg-shop-600 text-white h-12 px-8 hover-lift"
          >
            <Mail className="mr-2 h-4 w-4" />
            Subscribe
          </Button>
        </motion.form>
      </div>
    </motion.section>
  );
}