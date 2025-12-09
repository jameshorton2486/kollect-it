import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ConsignmentTeaser() {
  return (
    <section className="bg-lux-pearl section-tight">
      <div className="container mx-auto text-center">
        <p className="text-body text-ink-600 max-w-xl mx-auto">
          Have something special to consign? We accept select pieces valued over $500.
        </p>
        <Button asChild className="btn-primary mt-6 rounded-full px-8">
          <Link href="/consign">Start a Consignment</Link>
        </Button>
      </div>
    </section>
  );
}
