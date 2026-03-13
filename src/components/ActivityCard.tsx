import { Link } from "react-router-dom";
import { Star, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Activity } from "@/data/activities";
import { cn } from "@/lib/utils";

interface ActivityCardProps {
  activity: Activity;
  className?: string;
}

export function ActivityCard({ activity, className }: ActivityCardProps) {
  const discount = activity.originalPrice
    ? Math.round(((activity.originalPrice - activity.price) / activity.originalPrice) * 100)
    : 0;

  return (
    <Link
      to={`/activity/${activity.id}`}
      className={cn(
        "group block rounded-2xl overflow-hidden bg-card border border-border hover:border-gold/40 transition-all duration-300 hover:shadow-elevated",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={activity.image}
          alt={activity.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {discount > 0 && (
          <Badge className="absolute top-3 left-3 bg-gold text-ocean-dark font-semibold text-xs">
            {discount}% OFF
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-serif text-base font-bold text-foreground mb-1.5 line-clamp-1 group-hover:text-gold transition-colors">
          {activity.title}
        </h3>

        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {activity.duration}
          </span>
          <span className="flex items-center gap-1 text-gold">
            <Star className="h-3.5 w-3.5 fill-current" />
            {activity.rating}
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          {activity.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              AED {activity.originalPrice}
            </span>
          )}
          <span className="text-base font-bold text-foreground">
            AED {activity.price}
          </span>
        </div>
      </div>
    </Link>
  );
}
