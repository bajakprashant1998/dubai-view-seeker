import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ComboCard } from "@/components/ComboCard";
import { useMergedComboDeals } from "@/hooks/use-combos";

export function FeaturedCombos() {
  const { comboDeals, isLoading } = useMergedComboDeals();
  const featured = comboDeals.filter((c) => c.popular).slice(0, 3);
  const display = featured.length > 0 ? featured : comboDeals.slice(0, 3);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-gold" />
              <span className="text-gold font-semibold text-sm uppercase tracking-wider">
                Save More
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">
              Popular <span className="text-gradient-gold">Combo Deals</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Bundle your favorite experiences and save up to 30% with our handcrafted packages.
            </p>
          </div>
          <Link to="/combo-deals">
            <Button variant="outline-gold" className="shrink-0">
              View All Combos
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[460px] rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {display.map((combo, index) => (
              <ComboCard key={combo.id} combo={combo} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
