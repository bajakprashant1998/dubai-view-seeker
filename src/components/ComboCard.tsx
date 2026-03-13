import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ComboDeal, getActivityById } from "@/data/activities";
import { useMergedActivities } from "@/hooks/use-tours";

interface ComboCardProps {
  combo: ComboDeal;
  index?: number;
}

export function ComboCard({ combo, index = 0 }: ComboCardProps) {
  const { activities: allActivities } = useMergedActivities();

  const includedActivities = combo.activities
    .map((actId) =>
      allActivities.find((a) => a.id === actId || (a as any)._dbTour?.id === actId || (a as any)._dbTour?.slug === actId) ||
      getActivityById(actId)
    )
    .filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Link
        to={`/combo/${combo.id}`}
        className="group block rounded-2xl overflow-hidden bg-card border border-border hover:border-gold/40 transition-all duration-300 hover:shadow-elevated"
      >
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={combo.image}
            alt={combo.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark/60 via-transparent to-transparent" />

          <Badge className="absolute top-3 left-3 bg-gold text-ocean-dark font-semibold text-xs">
            Save {combo.savingsPercent}%
          </Badge>

          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-primary-foreground text-xs">
            <Clock className="h-3.5 w-3.5" />
            <span>{combo.duration}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-serif text-lg font-bold text-foreground mb-3 group-hover:text-gold transition-colors line-clamp-1">
            {combo.title}
          </h3>

          {/* Included list — compact */}
          <div className="space-y-1.5 mb-4">
            {includedActivities.slice(0, 3).map((activity) => (
              <div key={activity.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-gold shrink-0" />
                <span className="truncate">{activity.title}</span>
              </div>
            ))}
            {includedActivities.length > 3 && (
              <p className="text-xs text-gold font-medium pl-[22px]">
                +{includedActivities.length - 3} more
              </p>
            )}
          </div>

          {/* Price row */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-muted-foreground line-through">
                AED {combo.totalOriginalPrice}
              </span>
              <span className="text-lg font-bold text-foreground">
                AED {combo.comboPrice}
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
