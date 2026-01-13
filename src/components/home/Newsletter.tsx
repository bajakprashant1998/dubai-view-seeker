import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  return (
    <section className="py-20 bg-gradient-to-br from-ocean to-ocean-dark">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Get Exclusive Deals
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Subscribe to our newsletter and receive special offers, travel tips, 
            and early access to new experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Enter your email address"
              className="h-14 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 text-base"
            />
            <Button variant="gold" size="xl" className="shrink-0">
              <Send className="h-5 w-5 mr-2" />
              Subscribe
            </Button>
          </div>

          <p className="text-primary-foreground/60 text-sm mt-4">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
