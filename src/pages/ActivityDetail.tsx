import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  MapPin,
  Zap,
  Star,
  Calendar,
  Users,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  Shirt,
  Baby,
  Sun,
  Shield,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getActivityById, activities } from "@/data/activities";
import { ActivityCard } from "@/components/ActivityCard";

const ActivityDetail = () => {
  const { id } = useParams();
  const activity = getActivityById(id || "");
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!activity) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">Activity Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The activity you're looking for doesn't exist.
          </p>
          <Link to="/tours">
            <Button variant="gold">Browse All Tours</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = activity.originalPrice
    ? Math.round(((activity.originalPrice - activity.price) / activity.originalPrice) * 100)
    : 0;

  const totalPrice = activity.price * adults + activity.price * 0.5 * children;
  const relatedActivities = activities.filter(a => a.id !== activity.id && a.category === activity.category).slice(0, 3);

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
              <Link to="/tours" className="hover:text-foreground transition-colors">Tours</Link>
              <span>/</span>
              <span className="text-foreground">{activity.title}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative rounded-2xl overflow-hidden aspect-[16/10]"
              >
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Tags */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {discount > 0 && (
                    <Badge className="bg-gold text-ocean-dark font-semibold text-base px-4 py-1">
                      {discount}% OFF
                    </Badge>
                  )}
                  {activity.instantConfirmation && (
                    <Badge variant="secondary" className="bg-card/90 text-foreground">
                      <Zap className="h-4 w-4 mr-1" />
                      Instant Confirmation
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-card/90 flex items-center justify-center hover:bg-card transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-card/90 flex items-center justify-center hover:bg-card transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>

              {/* Title & Quick Info */}
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {activity.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {activity.title}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(activity.rating)
                              ? "text-gold fill-gold"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{activity.rating}</span>
                    <span className="text-muted-foreground">
                      ({activity.reviewCount.toLocaleString()} reviews)
                    </span>
                  </div>
                </div>

                {/* Key Info Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="font-semibold text-sm">{activity.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-semibold text-sm">{activity.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Hours</p>
                      <p className="font-semibold text-sm">{activity.openingHours}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Confirmation</p>
                      <p className="font-semibold text-sm">Instant</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0 gap-8">
                  {["overview", "inclusions", "details"].map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="capitalize rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-4 px-0"
                    >
                      {tab === "overview" ? "What to Expect" : tab}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="overview" className="pt-6 space-y-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold mb-4">About This Experience</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {activity.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-bold mb-4">What to Expect</h3>
                    <ul className="space-y-3">
                      {activity.whatToExpect.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="h-4 w-4 text-gold" />
                          </div>
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 bg-gold/5 rounded-xl border border-gold/20">
                    <div className="flex items-center gap-3 mb-3">
                      <Sun className="h-5 w-5 text-gold" />
                      <h4 className="font-semibold">Best Time to Visit</h4>
                    </div>
                    <p className="text-muted-foreground">{activity.bestTime}</p>
                  </div>
                </TabsContent>

                <TabsContent value="inclusions" className="pt-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        Inclusions
                      </h3>
                      <ul className="space-y-3">
                        {activity.inclusions.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
                        <X className="h-5 w-5 text-destructive" />
                        Exclusions
                      </h3>
                      <ul className="space-y-3">
                        {activity.exclusions.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="pt-6 space-y-6">
                  <div className="grid gap-4">
                    <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                      <Shirt className="h-6 w-6 text-gold shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Dress Code</h4>
                        <p className="text-muted-foreground text-sm">{activity.dressCode}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                      <Baby className="h-6 w-6 text-gold shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Age Requirements</h4>
                        <p className="text-muted-foreground text-sm">{activity.ageRequirements}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                      <Shield className="h-6 w-6 text-gold shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Cancellation Policy</h4>
                        <p className="text-muted-foreground text-sm">{activity.cancellationPolicy}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
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
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">From</p>
                      <div className="flex items-baseline gap-2">
                        {activity.originalPrice && (
                          <span className="text-lg text-muted-foreground line-through">
                            AED {activity.originalPrice}
                          </span>
                        )}
                        <span className="text-3xl font-bold text-foreground">
                          AED {activity.price}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">per person</p>
                    </div>
                    {discount > 0 && (
                      <Badge className="bg-gold text-ocean-dark font-semibold">
                        Save {discount}%
                      </Badge>
                    )}
                  </div>

                  {/* Date Selector Placeholder */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Date</label>
                    <button className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:border-gold transition-colors">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground">Choose a date</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Guests */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium block">Guests</label>
                    
                    {/* Adults */}
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

                    {/* Children */}
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
                    <Button variant="gold" size="xl" className="w-full">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </Button>
                  </div>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-4 pt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      <span>Secure Booking</span>
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

          {/* Related Activities */}
          {relatedActivities.length > 0 && (
            <section className="mt-16">
              <h2 className="font-serif text-2xl font-bold mb-8">
                Similar Experiences
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
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

export default ActivityDetail;