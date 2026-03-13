import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-dubai.jpg";

export function Hero() {
  return (
    <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Dubai skyline at golden hour"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-dark/80 via-ocean-dark/50 to-transparent" />
      </div>

      {/* Content — left aligned, minimal */}
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-xl"
        >
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground leading-[1.1] mb-6">
            Discover Dubai,{" "}
            <span className="text-gradient-gold">Your Way</span>
          </h1>

          <p className="text-primary-foreground/80 text-lg sm:text-xl mb-10 leading-relaxed max-w-md">
            Curated tours, combo deals & instant bookings — all at the best price.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button variant="gold" size="xl" asChild>
              <Link to="/tours">
                Explore Tours
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link to="/combo-deals">View Combos</Link>
            </Button>
          </div>
        </motion.div>

        {/* Floating stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 flex gap-10"
        >
          {[
            { value: "50K+", label: "Travelers" },
            { value: "200+", label: "Experiences" },
            { value: "4.9", label: "Avg Rating" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-gold">{s.value}</p>
              <p className="text-xs text-primary-foreground/60 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
