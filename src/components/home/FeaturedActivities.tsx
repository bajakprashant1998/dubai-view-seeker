import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActivityCard } from "@/components/ActivityCard";
import { activities } from "@/data/activities";

export function FeaturedActivities() {
  const featuredActivities = activities.slice(0, 4);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4"
        >
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Top Dubai <span className="text-gradient-gold">Experiences</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Handpicked adventures that showcase the best of Dubai
            </p>
          </div>
          <Link to="/tours">
            <Button variant="outline-gold" size="lg" className="shrink-0">
              View All Tours
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ActivityCard activity={activity} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
