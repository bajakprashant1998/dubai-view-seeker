import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Filter } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ComboCard } from "@/components/ComboCard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMergedComboDeals } from "@/hooks/use-combos";

const filterOptions = [
  { value: "all", label: "All Combos" },
  { value: "popular", label: "Most Popular" },
  { value: "budget", label: "Budget Friendly" },
  { value: "luxury", label: "Luxury" },
];

const ComboDeals = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const { comboDeals, isLoading } = useMergedComboDeals();

  const filteredDeals = comboDeals.filter((combo) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "popular") return combo.popular;
    if (activeFilter === "budget") return combo.comboPrice < 300;
    if (activeFilter === "luxury") return combo.comboPrice >= 400;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-ocean to-ocean-dark py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <Badge className="bg-gold/20 text-gold border-gold/30 mb-6 px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2" />
                Exclusive Combo Deals
              </Badge>

              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Save Big with Our <span className="text-gold">Combo Packages</span>
              </h1>

              <p className="text-primary-foreground/80 text-lg md:text-xl mb-8 leading-relaxed">
                Bundle your favorite Dubai experiences and save up to 30%. 
                Handcrafted packages designed for every type of traveler.
              </p>

              <div className="flex flex-wrap justify-center gap-8">
                {[
                  { value: "30%", label: "Max Savings" },
                  { value: `${comboDeals.length}+`, label: "Combo Deals" },
                  { value: "2-4", label: "Activities Each" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <p className="text-3xl font-bold text-gold">{stat.value}</p>
                    <p className="text-sm text-primary-foreground/70">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Deals Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-3 mb-10"
            >
              <Filter className="h-5 w-5 text-muted-foreground" />
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setActiveFilter(option.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeFilter === option.value
                      ? "bg-gold text-ocean-dark"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>

            <p className="text-muted-foreground mb-8">
              Showing <span className="font-semibold text-foreground">{filteredDeals.length}</span> combo deals
            </p>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-[460px] rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDeals.map((combo, index) => (
                  <ComboCard key={combo.id} combo={combo} index={index} />
                ))}
              </div>
            )}

            {!isLoading && filteredDeals.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  No combo deals found matching your filter.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Why Combos Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                Why Book <span className="text-gradient-gold">Combo Deals</span>?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get more value and convenience with our carefully curated packages
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Save Up to 30%",
                  description: "Bundled pricing means significant savings compared to booking activities separately.",
                  icon: "💰"
                },
                {
                  title: "Flexible Scheduling",
                  description: "Use your combo tickets across multiple days. No rush, enjoy at your own pace.",
                  icon: "📅"
                },
                {
                  title: "Curated Experiences",
                  description: "Expertly combined activities that complement each other perfectly.",
                  icon: "✨"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-8 text-center shadow-card border border-border"
                >
                  <span className="text-4xl mb-4 block">{benefit.icon}</span>
                  <h3 className="font-serif text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ComboDeals;
