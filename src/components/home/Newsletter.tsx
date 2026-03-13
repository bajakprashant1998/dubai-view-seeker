import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  return (
    <section className="py-14 bg-ocean-dark">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-3xl mx-auto">
          <div className="text-center sm:text-left">
            <h3 className="font-serif text-xl font-bold text-primary-foreground">
              Get Exclusive Deals
            </h3>
            <p className="text-primary-foreground/60 text-sm mt-1">
              Offers & travel tips — no spam.
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Input
              type="email"
              placeholder="Your email"
              className="h-11 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 w-full sm:w-64"
            />
            <Button variant="gold" size="default" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
