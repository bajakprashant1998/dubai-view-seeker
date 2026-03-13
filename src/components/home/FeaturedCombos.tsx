import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ComboCard } from "@/components/ComboCard";
import { useMergedComboDeals } from "@/hooks/use-combos";

export function FeaturedCombos() {
  const { comboDeals, isLoading } = useMergedComboDeals();
  const featured = comboDeals.filter((c) => c.popular).slice(0, 3);
  const display = featured.length > 0 ? featured : comboDeals.slice(0, 3);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            Combo <span className="text-gradient-gold">Deals</span>
          </h2>
          <Link to="/combo-deals">
            <Button variant="ghost" className="text-gold hover:text-gold-dark gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

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
