import { motion } from "framer-motion";
import { Search, Calendar, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-dubai.jpg";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Dubai skyline at golden hour"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-dark/70 via-ocean-dark/50 to-ocean-dark/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 border border-gold/30 text-gold mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-sm font-medium">Dubai's #1 Tourism Experience</span>
          </motion.div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
            Experience Dubai with a{" "}
            <span className="text-gradient-gold">Better View</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover extraordinary adventures, iconic landmarks, and unforgettable 
            experiences. Book with confidence — best prices guaranteed.
          </p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card/95 backdrop-blur-md rounded-2xl p-2 shadow-elevated max-w-3xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-2">
              {/* Activity Search */}
              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-background">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <Input
                  type="text"
                  placeholder="Search activities, tours, attractions..."
                  className="border-0 bg-transparent focus-visible:ring-0 p-0 h-auto text-base placeholder:text-muted-foreground"
                />
              </div>

              {/* Date Picker */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-background md:border-l border-border">
                <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Select Date</span>
              </div>

              {/* Search Button */}
              <Button variant="gold" size="xl" className="shrink-0">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 mt-12"
          >
            {[
              { label: "Happy Travelers", value: "50K+" },
              { label: "Experiences", value: "200+" },
              { label: "5-Star Reviews", value: "15K+" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-bold text-gold">{stat.value}</p>
                <p className="text-sm text-primary-foreground/70">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-2 text-primary-foreground/60"
        >
          <span className="text-xs uppercase tracking-wider">Explore More</span>
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
