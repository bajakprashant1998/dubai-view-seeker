import { motion } from "framer-motion";
import { Shield, Headphones, Ticket, RefreshCw, Star, Zap } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Best Price Guarantee",
    description: "Found it cheaper? We'll match it and give you an extra 10% off.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our expert team is available around the clock to assist you.",
  },
  {
    icon: Ticket,
    title: "Instant Mobile Tickets",
    description: "Skip the queues with QR tickets delivered straight to your phone.",
  },
  {
    icon: RefreshCw,
    title: "Free Cancellation",
    description: "Plans change. Cancel up to 24 hours before for a full refund.",
  },
  {
    icon: Star,
    title: "Verified Reviews",
    description: "Real experiences from real travelers. No fake reviews.",
  },
  {
    icon: Zap,
    title: "Instant Confirmation",
    description: "Book now, confirmed instantly. No waiting, no uncertainty.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose <span className="text-gradient-gold">Better View</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience the difference with Dubai's most trusted tourism partner
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all duration-300 border border-border hover:border-gold/30"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="h-7 w-7 text-gold" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
