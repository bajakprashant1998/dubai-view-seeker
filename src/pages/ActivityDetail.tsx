import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Clock, MapPin, Zap, Star, Calendar, Check, X, ChevronRight,
  Minus, Plus, ShoppingCart, Heart, Share2, Shirt, Baby, Sun, Shield,
  Hotel, Waves, Car, Package, Route, AlertTriangle, Users, Globe, Map,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityCard } from "@/components/ActivityCard";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTour, mapTourToActivity, useMergedActivities } from "@/hooks/use-tours";
import { getActivityById } from "@/data/activities";

function AddToCartButton({ activity, selectedDate, selectedTime, adults, children: childCount, totalPrice }: {
  activity: { id: string; title: string; image: string; price: number; originalPrice?: number };
  selectedDate: Date | undefined;
  selectedTime: string | null;
  adults: number;
  children: number;
  totalPrice: number;
}) {
  const { addItem } = useCart();
  const formatTime = (time: string) => {
    const [h, m] = time.split(":");
    const hr = parseInt(h);
    return `${hr > 12 ? hr - 12 : hr || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
  };
  const handleAdd = () => {
    if (!selectedDate || !selectedTime) return;
    addItem({
      id: activity.id,
      type: "activity",
      title: activity.title,
      image: activity.image,
      price: activity.price,
      originalPrice: activity.originalPrice,
      date: format(selectedDate, "MMM d, yyyy"),
      time: formatTime(selectedTime),
      adults,
      children: childCount,
      totalPrice,
    });
    toast.success(`${activity.title} added to cart!`);
  };
  return (
    <Button variant="gold" size="xl" className="w-full" disabled={!selectedDate || !selectedTime} onClick={handleAdd}>
      <ShoppingCart className="h-5 w-5 mr-2" />
      {!selectedDate ? "Select a Date" : !selectedTime ? "Select a Time" : "Add to Cart"}
    </Button>
  );
}

const ActivityDetail = () => {
  const { id } = useParams();
  const { data: dbTour, isLoading } = useTour(id || "");
  const { activities: allActivities } = useMergedActivities();

  // Try DB first, then static fallback
  const activity = dbTour
    ? mapTourToActivity(dbTour)
    : getActivityById(id || "");

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-[400px] rounded-2xl mb-8" />
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">Activity Not Found</h1>
          <p className="text-muted-foreground mb-8">The activity you're looking for doesn't exist.</p>
          <Link to="/tours"><Button variant="gold">Browse All Tours</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = activity.originalPrice
    ? Math.round(((activity.originalPrice - activity.price) / activity.originalPrice) * 100)
    : 0;

  const totalPrice = activity.price * adults + activity.price * 0.5 * children;
  const relatedActivities = allActivities
    .filter(a => a.id !== activity.id && a.category === activity.category)
    .slice(0, 3);

  const formatTimeSlot = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes || "00"} ${ampm}`;
  };

  // Get gallery from DB tour if available
  const dbTourData = (activity as any)?._dbTour;
  const gallery: string[] = dbTourData?.gallery || [];
  const faqs: { question: string; answer: string }[] = dbTourData?.faqs_enabled && Array.isArray(dbTourData?.faqs) ? dbTourData.faqs : [];
  
  // New fields
  const itinerary: { time: string; title: string; description: string }[] = Array.isArray(dbTourData?.itinerary) ? dbTourData.itinerary : [];
  const hotelInfo = dbTourData?.hotel_info || {};
  const hourlyRentals: { duration: string; price: number; label?: string }[] = Array.isArray(dbTourData?.hourly_rentals) ? dbTourData.hourly_rentals : [];
  const transferOptions: { type: string; price: number; description?: string }[] = Array.isArray(dbTourData?.transfer_options) ? dbTourData.transfer_options : [];
  const addons: { name: string; price: number; description?: string }[] = Array.isArray(dbTourData?.addons) ? dbTourData.addons : [];
  const safetyReqs = dbTourData?.safety_requirements || {};
  const exclusions: string[] = Array.isArray(dbTourData?.exclusions)
    ? (dbTourData.exclusions as any[]).map((i: any) => (typeof i === "string" ? i : i.text || ""))
    : [];
  const meetingPoint = dbTourData?.meeting_point || "";
  const mapLink = dbTourData?.map_link || "";
  const languages: string[] = dbTourData?.languages || [];
  const guideType = dbTourData?.guide_type || "";
  const tourType = dbTourData?.tour_type || "";
  const difficultyLevel = dbTourData?.difficulty_level || "";
  const whatToBring: string[] = Array.isArray(dbTourData?.what_to_bring)
    ? (dbTourData.what_to_bring as any[]).map((i: any) => (typeof i === "string" ? i : i.text || ""))
    : [];

  const hasItinerary = itinerary.length > 0;
  const hasHotel = hotelInfo.name;
  const hasRentals = hourlyRentals.length > 0;
  const hasTransfers = transferOptions.length > 0;
  const hasAddons = addons.length > 0;
  const hasSafety = safetyReqs.health_requirements || safetyReqs.safety_briefing || safetyReqs.insurance_info || safetyReqs.waiver_needed;
  const hasExtraDetails = meetingPoint || languages.length > 0 || tourType || difficultyLevel || whatToBring.length > 0;

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
              {/* Image */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative rounded-2xl overflow-hidden aspect-[16/10]">
                <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {discount > 0 && (
                    <Badge className="bg-gold text-ocean-dark font-semibold text-base px-4 py-1">{discount}% OFF</Badge>
                  )}
                  {activity.instantConfirmation && (
                    <Badge variant="secondary" className="bg-card/90 text-foreground">
                      <Zap className="h-4 w-4 mr-1" />Instant Confirmation
                    </Badge>
                  )}
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-card/90 flex items-center justify-center hover:bg-card transition-colors"><Heart className="h-5 w-5" /></button>
                  <button className="w-10 h-10 rounded-full bg-card/90 flex items-center justify-center hover:bg-card transition-colors"><Share2 className="h-5 w-5" /></button>
                </div>
              </motion.div>

              {/* Gallery */}
              {gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {gallery.slice(0, 4).map((img, i) => (
                    <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden">
                      <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Title & Quick Info */}
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {activity.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-sm">{tag}</Badge>
                  ))}
                </div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">{activity.title}</h1>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < Math.floor(activity.rating) ? "text-gold fill-gold" : "text-muted"}`} />
                      ))}
                    </div>
                    <span className="font-semibold">{activity.rating}</span>
                    {activity.reviewCount > 0 && (
                      <span className="text-muted-foreground">({activity.reviewCount.toLocaleString()} reviews)</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center"><Clock className="h-5 w-5 text-gold" /></div>
                    <div><p className="text-xs text-muted-foreground">Duration</p><p className="font-semibold text-sm">{activity.duration}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center"><MapPin className="h-5 w-5 text-gold" /></div>
                    <div><p className="text-xs text-muted-foreground">Location</p><p className="font-semibold text-sm">{activity.location}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center"><Calendar className="h-5 w-5 text-gold" /></div>
                    <div><p className="text-xs text-muted-foreground">Hours</p><p className="font-semibold text-sm">{activity.openingHours}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center"><Zap className="h-5 w-5 text-gold" /></div>
                    <div><p className="text-xs text-muted-foreground">Confirmation</p><p className="font-semibold text-sm">Instant</p></div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0 gap-6 flex-wrap">
                  {[
                    "overview",
                    "inclusions",
                    ...(hasItinerary ? ["itinerary"] : []),
                    ...(hasRentals ? ["rentals"] : []),
                    ...(hasHotel ? ["hotel"] : []),
                    ...(hasTransfers ? ["transfers"] : []),
                    ...(hasAddons ? ["addons"] : []),
                    "details",
                    ...(hasSafety ? ["safety"] : []),
                    ...(faqs.length > 0 ? ["faqs"] : []),
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="capitalize rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-4 px-0 text-sm"
                    >
                      {tab === "overview" ? "What to Expect" : tab === "faqs" ? "FAQs" : tab === "rentals" ? "Hourly Rentals" : tab === "addons" ? "Add-ons" : tab}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="overview" className="pt-6 space-y-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold mb-4">About This Experience</h3>
                    <p className="text-muted-foreground leading-relaxed">{activity.description}</p>
                  </div>
                  {activity.whatToExpect.length > 0 && (
                    <div>
                      <h3 className="font-serif text-xl font-bold mb-4">What to Expect</h3>
                      <ul className="space-y-3">
                        {activity.whatToExpect.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-0.5"><Check className="h-4 w-4 text-gold" /></div>
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {activity.bestTime && (
                    <div className="p-6 bg-gold/5 rounded-xl border border-gold/20">
                      <div className="flex items-center gap-3 mb-3"><Sun className="h-5 w-5 text-gold" /><h4 className="font-semibold">Best Time to Visit</h4></div>
                      <p className="text-muted-foreground">{activity.bestTime}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="inclusions" className="pt-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    {activity.inclusions.length > 0 && (
                      <div>
                        <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2"><Check className="h-5 w-5 text-green-500" />Inclusions</h3>
                        <ul className="space-y-3">
                          {activity.inclusions.map((item, index) => (
                            <li key={index} className="flex items-start gap-3"><Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" /><span className="text-muted-foreground">{item}</span></li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {exclusions.length > 0 && (
                      <div>
                        <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2"><X className="h-5 w-5 text-destructive" />Exclusions</h3>
                        <ul className="space-y-3">
                          {exclusions.map((item, index) => (
                            <li key={index} className="flex items-start gap-3"><X className="h-5 w-5 text-destructive shrink-0 mt-0.5" /><span className="text-muted-foreground">{item}</span></li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {hasItinerary && (
                  <TabsContent value="itinerary" className="pt-6">
                    <h3 className="font-serif text-xl font-bold mb-6 flex items-center gap-2"><Route className="h-5 w-5 text-gold" />Itinerary</h3>
                    <div className="relative space-y-0">
                      {itinerary.map((step, i) => (
                        <div key={i} className="flex gap-4 pb-6 last:pb-0">
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-gold/10 border-2 border-gold flex items-center justify-center text-sm font-bold text-gold">{i + 1}</div>
                            {i < itinerary.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
                          </div>
                          <div className="pt-1.5 pb-2">
                            {step.time && <span className="text-xs font-medium text-gold bg-gold/10 px-2 py-0.5 rounded-full">{step.time}</span>}
                            <h4 className="font-semibold mt-1">{step.title}</h4>
                            {step.description && <p className="text-muted-foreground text-sm mt-1">{step.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                )}

                {hasRentals && (
                  <TabsContent value="rentals" className="pt-6">
                    <h3 className="font-serif text-xl font-bold mb-6 flex items-center gap-2"><Waves className="h-5 w-5 text-gold" />Hourly Rental Options</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {hourlyRentals.map((rental, i) => (
                        <div key={i} className="p-5 rounded-xl border border-border bg-muted/30 hover:border-gold transition-colors text-center">
                          <Clock className="h-8 w-8 text-gold mx-auto mb-3" />
                          <p className="text-lg font-bold">{rental.duration}</p>
                          {rental.label && <p className="text-sm text-muted-foreground mb-2">{rental.label}</p>}
                          <p className="text-2xl font-bold text-gold">AED {rental.price}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                )}

                {hasHotel && (
                  <TabsContent value="hotel" className="pt-6">
                    <h3 className="font-serif text-xl font-bold mb-6 flex items-center gap-2"><Hotel className="h-5 w-5 text-gold" />Hotel Information</h3>
                    <div className="p-6 rounded-xl border border-border bg-muted/30 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold">{hotelInfo.name}</h4>
                        {hotelInfo.star_rating && (
                          <div className="flex items-center gap-1">
                            {[...Array(Number(hotelInfo.star_rating) || 0)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-gold fill-gold" />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        {hotelInfo.room_type && (
                          <div><span className="text-muted-foreground">Room Type:</span> <span className="font-medium">{hotelInfo.room_type}</span></div>
                        )}
                        {hotelInfo.check_in && (
                          <div><span className="text-muted-foreground">Check-in:</span> <span className="font-medium">{hotelInfo.check_in}</span></div>
                        )}
                        {hotelInfo.check_out && (
                          <div><span className="text-muted-foreground">Check-out:</span> <span className="font-medium">{hotelInfo.check_out}</span></div>
                        )}
                      </div>
                      {hotelInfo.amenities && hotelInfo.amenities.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Amenities</p>
                          <div className="flex flex-wrap gap-2">
                            {hotelInfo.amenities.map((a: string, i: number) => (
                              <Badge key={i} variant="outline">{a}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )}

                {hasTransfers && (
                  <TabsContent value="transfers" className="pt-6">
                    <h3 className="font-serif text-xl font-bold mb-6 flex items-center gap-2"><Car className="h-5 w-5 text-gold" />Transfer Options</h3>
                    <div className="space-y-3">
                      {transferOptions.map((t, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
                          <div>
                            <p className="font-semibold">{t.type}</p>
                            {t.description && <p className="text-sm text-muted-foreground">{t.description}</p>}
                          </div>
                          <span className="text-lg font-bold text-gold">AED {t.price}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                )}

                {hasAddons && (
                  <TabsContent value="addons" className="pt-6">
                    <h3 className="font-serif text-xl font-bold mb-6 flex items-center gap-2"><Package className="h-5 w-5 text-gold" />Available Add-ons</h3>
                    <div className="space-y-3">
                      {addons.map((addon, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
                          <div>
                            <p className="font-semibold">{addon.name}</p>
                            {addon.description && <p className="text-sm text-muted-foreground">{addon.description}</p>}
                          </div>
                          <span className="text-lg font-bold text-gold">+AED {addon.price}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                )}

                <TabsContent value="details" className="pt-6 space-y-6">
                  <div className="grid gap-4">
                    {meetingPoint && (
                      <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                        <Map className="h-6 w-6 text-gold shrink-0" />
                        <div>
                          <h4 className="font-semibold mb-1">Meeting Point</h4>
                          <p className="text-muted-foreground text-sm">{meetingPoint}</p>
                          {mapLink && <a href={mapLink} target="_blank" rel="noopener noreferrer" className="text-gold text-sm hover:underline mt-1 inline-block">View on Map →</a>}
                        </div>
                      </div>
                    )}
                    {languages.length > 0 && (
                      <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                        <Globe className="h-6 w-6 text-gold shrink-0" />
                        <div>
                          <h4 className="font-semibold mb-1">Languages & Guide</h4>
                          <p className="text-muted-foreground text-sm">{languages.join(", ")}{guideType ? ` • ${guideType} guide` : ""}</p>
                        </div>
                      </div>
                    )}
                    {(tourType || difficultyLevel) && (
                      <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                        <Users className="h-6 w-6 text-gold shrink-0" />
                        <div>
                          <h4 className="font-semibold mb-1">Tour Details</h4>
                          <p className="text-muted-foreground text-sm">
                            {tourType && <span className="capitalize">{tourType} tour</span>}
                            {tourType && difficultyLevel && " • "}
                            {difficultyLevel && <span className="capitalize">{difficultyLevel} difficulty</span>}
                          </p>
                        </div>
                      </div>
                    )}
                    {activity.dressCode && (
                      <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                        <Shirt className="h-6 w-6 text-gold shrink-0" />
                        <div><h4 className="font-semibold mb-1">Dress Code</h4><p className="text-muted-foreground text-sm">{activity.dressCode}</p></div>
                      </div>
                    )}
                    {whatToBring.length > 0 && (
                      <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                        <Package className="h-6 w-6 text-gold shrink-0" />
                        <div>
                          <h4 className="font-semibold mb-1">What to Bring</h4>
                          <ul className="text-muted-foreground text-sm space-y-1">
                            {whatToBring.map((item, i) => <li key={i}>• {item}</li>)}
                          </ul>
                        </div>
                      </div>
                    )}
                    {activity.ageRequirements && (
                      <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                        <Baby className="h-6 w-6 text-gold shrink-0" />
                        <div><h4 className="font-semibold mb-1">Age Requirements</h4><p className="text-muted-foreground text-sm">{activity.ageRequirements}</p></div>
                      </div>
                    )}
                    <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                      <Shield className="h-6 w-6 text-gold shrink-0" />
                      <div><h4 className="font-semibold mb-1">Cancellation Policy</h4><p className="text-muted-foreground text-sm">{activity.cancellationPolicy}</p></div>
                    </div>
                  </div>
                </TabsContent>

                {hasSafety && (
                  <TabsContent value="safety" className="pt-6">
                    <h3 className="font-serif text-xl font-bold mb-6 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-gold" />Safety & Requirements</h3>
                    <div className="grid gap-4">
                      {safetyReqs.health_requirements && (
                        <div className="p-4 bg-muted/50 rounded-xl">
                          <h4 className="font-semibold mb-1">Health Requirements</h4>
                          <p className="text-muted-foreground text-sm">{safetyReqs.health_requirements}</p>
                        </div>
                      )}
                      {safetyReqs.safety_briefing && (
                        <div className="p-4 bg-muted/50 rounded-xl">
                          <h4 className="font-semibold mb-1">Safety Briefing</h4>
                          <p className="text-muted-foreground text-sm">{safetyReqs.safety_briefing}</p>
                        </div>
                      )}
                      {safetyReqs.insurance_info && (
                        <div className="p-4 bg-muted/50 rounded-xl">
                          <h4 className="font-semibold mb-1">Insurance</h4>
                          <p className="text-muted-foreground text-sm">{safetyReqs.insurance_info}</p>
                        </div>
                      )}
                      {safetyReqs.waiver_needed && (
                        <div className="p-4 bg-gold/5 rounded-xl border border-gold/20">
                          <p className="text-sm font-medium flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-gold" />A waiver/consent form is required for this activity</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )}

                {faqs.length > 0 && (
                  <TabsContent value="faqs" className="pt-6 space-y-4">
                    {faqs.map((faq, i) => (
                      <div key={i} className="p-4 bg-muted/50 rounded-xl">
                        <h4 className="font-semibold mb-2">{faq.question}</h4>
                        <p className="text-muted-foreground text-sm">{faq.answer}</p>
                      </div>
                    ))}
                  </TabsContent>
                )}
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
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">From</p>
                      <div className="flex items-baseline gap-2">
                        {activity.originalPrice && <span className="text-lg text-muted-foreground line-through">AED {activity.originalPrice}</span>}
                        <span className="text-3xl font-bold text-foreground">AED {activity.price}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">per person</p>
                    </div>
                    {discount > 0 && <Badge className="bg-gold text-ocean-dark font-semibold">Save {discount}%</Badge>}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Date</label>
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
                          onSelect={(date) => { setSelectedDate(date); setSelectedTime(null); }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {selectedDate && activity.timeSlots && activity.timeSlots.length > 0 && (
                    <div>
                      <label className="text-sm font-medium mb-3 block">Select Time Slot</label>
                      <div className="grid grid-cols-3 gap-2">
                        {activity.timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={cn(
                              "px-3 py-2.5 rounded-lg text-sm font-medium transition-all border",
                              selectedTime === time
                                ? "bg-gold text-ocean-dark border-gold"
                                : "border-border bg-background hover:border-gold text-foreground"
                            )}
                          >
                            {formatTimeSlot(time)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <label className="text-sm font-medium block">Guests</label>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background">
                      <div><p className="font-medium">Adults</p><p className="text-sm text-muted-foreground">Age 12+</p></div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-gold transition-colors"><Minus className="h-4 w-4" /></button>
                        <span className="w-8 text-center font-semibold">{adults}</span>
                        <button onClick={() => setAdults(Math.min(10, adults + 1))} className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-gold transition-colors"><Plus className="h-4 w-4" /></button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background">
                      <div><p className="font-medium">Children</p><p className="text-sm text-muted-foreground">Age 3-11 (50% off)</p></div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-gold transition-colors"><Minus className="h-4 w-4" /></button>
                        <span className="w-8 text-center font-semibold">{children}</span>
                        <button onClick={() => setChildren(Math.min(10, children + 1))} className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-gold transition-colors"><Plus className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>

                  {selectedDate && selectedTime && (
                    <div className="p-4 bg-gold/5 rounded-xl border border-gold/20">
                      <h4 className="font-semibold text-sm mb-2">Booking Summary</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>📅 {format(selectedDate, "EEEE, MMMM d, yyyy")}</p>
                        <p>🕐 {formatTimeSlot(selectedTime)}</p>
                        <p>👥 {adults} Adult{adults > 1 ? "s" : ""}{children > 0 ? `, ${children} Child${children > 1 ? "ren" : ""}` : ""}</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold">AED {totalPrice.toFixed(0)}</span>
                    </div>
                    <AddToCartButton activity={activity} selectedDate={selectedDate} selectedTime={selectedTime} adults={adults} children={children} totalPrice={totalPrice} />
                  </div>

                  <div className="flex items-center justify-center gap-4 pt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1"><Shield className="h-4 w-4" /><span>Secure Booking</span></div>
                    <div className="flex items-center gap-1"><Zap className="h-4 w-4" /><span>Instant Confirm</span></div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {relatedActivities.length > 0 && (
            <section className="mt-16">
              <h2 className="font-serif text-2xl font-bold mb-8">Similar Experiences</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedActivities.map((a) => (
                  <ActivityCard key={a.id} activity={a} />
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
