import { Link } from "react-router-dom";
import { Star, Clock, MapPin, Zap } from "lucide-react";
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
        "group block bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 border border-border hover:border-gold/30",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={activity.image}
          alt={activity.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark/60 via-transparent to-transparent" />
        
        {/* Tags */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {discount > 0 && (
            <Badge className="bg-gold text-ocean-dark font-semibold">
              {discount}% OFF
            </Badge>
          )}
          {activity.instantConfirmation && (
            <Badge variant="secondary" className="bg-card/90 text-foreground">
              <Zap className="h-3 w-3 mr-1" />
              Instant
            </Badge>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4">
          <Badge variant="outline" className="bg-card/90 text-foreground border-0">
            {activity.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-serif text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-gold transition-colors">
          {activity.title}
        </h3>

        {/* Short Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {activity.shortDescription}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{activity.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{activity.location}</span>
          </div>
        </div>

        {/* Rating & Price */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-gold">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-semibold">{activity.rating}</span>
            </div>
            <span className="text-muted-foreground text-sm">
              ({activity.reviewCount.toLocaleString()})
            </span>
          </div>

          {/* Price */}
          <div className="text-right">
            {activity.originalPrice && (
              <span className="text-sm text-muted-foreground line-through mr-2">
                AED {activity.originalPrice}
              </span>
            )}
            <span className="text-lg font-bold text-foreground">
              AED {activity.price}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
