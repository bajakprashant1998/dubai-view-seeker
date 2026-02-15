import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Clock,
  MapPin,
  Check,
  Calendar,
  Users,
  Minus,
  Plus,
  ShoppingCart,
  Shield,
  Zap,
  ChevronRight,
  Sparkles,
  Star,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getComboById, getActivitiesForCombo, comboDeals } from "@/data/activities";
import { ComboCard } from "@/components/ComboCard";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ComboDetail = () => {
  const { id } = useParams();
  const combo = getComboById(id || "");
  const { addItem } = useCart();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  if (!combo) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">Combo Deal Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The combo deal you're looking for doesn't exist.
          </p>
          <Link to="/combo-deals">
            <Button variant="gold">Browse All Combos</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const includedActivities = getActivitiesForCombo(combo);
  const totalPrice = combo.comboPrice * adults + combo.comboPrice * 0.5 * children;
  const otherCombos = comboDeals.filter(c => c.id !== combo.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Breadcrumb */}
        <div className="bg-muted/50 border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <Link to="/combo-deals" className="hover:text-foreground transition-colors">Combo Deals</Link>
              <span>/</span>
              <span className="text-foreground">{combo.title}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Image */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative rounded-2xl overflow-hidden aspect-[16/9]"
              >
                <img
                  src={combo.image}
                  alt={combo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark/60 via-transparent to-transparent" />
                
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-gold text-ocean-dark font-bold text-lg px-4 py-1.5">
                    Save {combo.savingsPercent}%
                  </Badge>
                  {combo.popular && (
                    <Badge className="bg-primary text-primary-foreground font-semibold text-base px-4 py-1.5">
                      <Sparkles className="h-4 w-4 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 flex items-center gap-4 text-primary-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span className="font-medium">{combo.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span className="font-medium">{combo.activities.length} Activities</span>
                  </div>
                </div>
              </motion.div>

              {/* Title & Description */}
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {combo.title}
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {combo.description}
                </p>
              </div>

              {/* Highlights */}
              <div className="bg-gold/5 rounded-2xl p-6 border border-gold/20">
                <h2 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-gold" />
                  Package Highlights
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {combo.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                      <span className="text-foreground">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Included Activities */}
              <div>
                <h2 className="font-serif text-2xl font-bold mb-6">
                  What's Included
                </h2>
                <div className="space-y-4">
                  {includedActivities.map((activity, index) => (
                    <Link
                      key={activity.id}
                      to={`/activity/${activity.id}`}
                      className="group flex gap-4 p-4 bg-card rounded-xl border border-border hover:border-gold/30 transition-all"
                    >
                      <div className="relative w-32 h-24 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={activity.image}
                          alt={activity.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                          <span className="text-ocean-dark font-bold text-sm">{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-gold transition-colors mb-1">
                          {activity.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                          {activity.shortDescription}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {activity.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {activity.location}
                          </div>
                          <div className="flex items-center gap-1 text-gold">
                            <Star className="h-4 w-4 fill-gold" />
                            {activity.rating}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-gold transition-colors shrink-0 self-center" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Best For */}
              <div>
                <h2 className="font-serif text-xl font-bold mb-4">Perfect For</h2>
                <div className="flex flex-wrap gap-3">
                  {combo.bestFor.map((tag) => (
                    <Badge key={tag} variant="secondary" className="px-4 py-2 text-sm">
                      <Users className="h-4 w-4 mr-2" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Widget */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-2xl shadow-elevated border border-border p-6 space-y-6"
                >
                  {/* Price */}
                  <div className="text-center pb-4 border-b border-border">
                    <p className="text-sm text-muted-foreground mb-1">Combo Package Price</p>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-lg text-muted-foreground line-through">
                        AED {combo.totalOriginalPrice}
                      </span>
                      <span className="text-4xl font-bold text-foreground">
                        AED {combo.comboPrice}
                      </span>
                    </div>
                    <p className="text-gold font-semibold mt-1">
                      You save AED {combo.savings} ({combo.savingsPercent}% off)
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">per person</p>
                  </div>

                  {/* Date Picker */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Start Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:border-gold transition-colors text-left">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <span className={selectedDate ? "text-foreground" : "text-muted-foreground"}>
                              {selectedDate ? format(selectedDate, "PPP") : "Choose a date"}
                            </span>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Guests */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium block">Guests</label>
                    
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background">
                      <div>
                        <p className="font-medium">Adults</p>
                        <p className="text-sm text-muted-foreground">Age 12+</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-gold transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">{adults}</span>
                        <button
                          onClick={() => setAdults(Math.min(10, adults + 1))}
                          className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-gold transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background">
                      <div>
                        <p className="font-medium">Children</p>
                        <p className="text-sm text-muted-foreground">Age 3-11 (50% off)</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-gold transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">{children}</span>
                        <button
                          onClick={() => setChildren(Math.min(10, children + 1))}
                          className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-gold transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold">AED {totalPrice.toFixed(0)}</span>
                    </div>
                    <Button
                      variant="gold"
                      size="xl"
                      className="w-full"
                      onClick={() => {
                        if (!selectedDate) return;
                        addItem({
                          id: combo.id,
                          type: "combo",
                          title: combo.title,
                          image: combo.image,
                          price: combo.comboPrice,
                          originalPrice: combo.totalOriginalPrice,
                          date: format(selectedDate, "MMM d, yyyy"),
                          adults,
                          children,
                          totalPrice,
                        });
                        toast.success(`${combo.title} added to cart!`);
                      }}
                      disabled={!selectedDate}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      {!selectedDate ? "Select a Date" : "Add to Cart"}
                    </Button>
                  </div>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-4 pt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      <span>Best Price</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4" />
                      <span>Instant Confirm</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Other Combos */}
          {otherCombos.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-2xl font-bold">
                  More Combo Deals
                </h2>
                <Link to="/combo-deals">
                  <Button variant="outline-gold">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {otherCombos.map((c, index) => (
                  <ComboCard key={c.id} combo={c} index={index} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ComboDetail;