import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Star, Users, Sparkles, ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ComboDeal, getActivitiesForCombo, getActivityById } from "@/data/activities";
import { useMergedActivities } from "@/hooks/use-tours";
import { cn } from "@/lib/utils";

interface ComboCardProps {
  combo: ComboDeal;
  index?: number;
}

export function ComboCard({ combo, index = 0 }: ComboCardProps) {
  const { activities: allActivities } = useMergedActivities();

  // Resolve included activities from merged list (DB + static fallback)
  const includedActivities = combo.activities
    .map((actId) =>
      allActivities.find((a) => a.id === actId || (a as any)._dbTour?.id === actId || (a as any)._dbTour?.slug === actId) ||
      getActivityById(actId)
    )
    .filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        to={`/combo/${combo.id}`}
        className="group block bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 border border-border hover:border-gold/30"
      >
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={combo.image}
            alt={combo.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark/80 via-ocean-dark/20 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className="bg-gold text-ocean-dark font-bold text-sm px-3 py-1">
              Save {combo.savingsPercent}%
            </Badge>
            {combo.popular && (
              <Badge className="bg-primary text-primary-foreground font-semibold">
                <Sparkles className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            )}
          </div>

          {/* Duration */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-primary-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">{combo.duration}</span>
          </div>

          {/* Activity Count */}
          <div className="absolute bottom-4 right-4">
            <Badge variant="secondary" className="bg-card/90">
              {combo.activities.length} Activities
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-serif text-xl font-bold text-foreground mb-2 group-hover:text-gold transition-colors">
            {combo.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {combo.description}
          </p>

          {/* Included Activities */}
          <div className="space-y-2 mb-4">
            {includedActivities.slice(0, 3).map((activity) => (
              <div key={activity.id} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-gold shrink-0" />
                <span className="text-muted-foreground truncate">{activity.title}</span>
              </div>
            ))}
            {includedActivities.length > 3 && (
              <p className="text-sm text-gold font-medium pl-6">
                +{includedActivities.length - 3} more experiences
              </p>
            )}
          </div>

          {/* Best For Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {combo.bestFor.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>

          {/* Price Section */}
          <div className="flex items-end justify-between pt-4 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">Package Price</p>
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-muted-foreground line-through">
                  AED {combo.totalOriginalPrice}
                </span>
                <span className="text-2xl font-bold text-foreground">
                  AED {combo.comboPrice}
                </span>
              </div>
              <p className="text-sm text-gold font-medium">
                You save AED {combo.savings}
              </p>
            </div>
            <Button variant="gold" size="sm" className="shrink-0">
              View Deal
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}