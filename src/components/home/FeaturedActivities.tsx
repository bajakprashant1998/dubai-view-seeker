import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActivityCard } from "@/components/ActivityCard";
import { useMergedActivities, useFeaturedTours, mapTourToActivity } from "@/hooks/use-tours";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedActivities() {
  const { data: featuredDbTours, isLoading: featuredLoading } = useFeaturedTours();
  const { activities: allActivities, isLoading: allLoading } = useMergedActivities();

  const featuredActivities =
    featuredDbTours && featuredDbTours.length > 0
      ? featuredDbTours.map(mapTourToActivity)
      : allActivities.slice(0, 4);

  const isLoading = featuredLoading || allLoading;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            Top <span className="text-gradient-gold">Experiences</span>
          </h2>
          <Link to="/tours">
            <Button variant="ghost" className="text-gold hover:text-gold-dark gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[380px] rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <ActivityCard activity={activity} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
