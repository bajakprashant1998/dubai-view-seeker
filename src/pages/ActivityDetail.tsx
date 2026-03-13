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

interface SelectedRental { duration: string; price: number; label?: string }
interface SelectedAddon { name: string; price: number; description?: string }

function AddToCartButton({ activity, selectedDate, selectedTime, adults, children: childCount, totalPrice, selectedRental, selectedAddons }: {
  activity: { id: string; title: string; image: string; price: number; originalPrice?: number };
  selectedDate: Date | undefined;
  selectedTime: string | null;
  adults: number;
  children: number;
  totalPrice: number;
  selectedRental?: SelectedRental | null;
  selectedAddons: SelectedAddon[];
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
      selectedRental: selectedRental ? { label: selectedRental.label || selectedRental.duration, price: selectedRental.price } : undefined,
      selectedAddons: selectedAddons.length > 0 ? selectedAddons.map(a => ({ label: a.name, price: a.price })) : undefined,
    });
    toast.success(`${activity.title} added to cart!`);
  };
  return (
    <Button variant="gold" size="xl" className="w-full" disabled={!selectedDate || !selectedTime} onClick={handleAdd}>
      <ShoppingCart className="h-5 w-5 mr-2" />
      {!selectedDate ? "Select a Date" : !selectedTime ? "Select a Time" : `Add to Cart — AED ${totalPrice.toFixed(0)}`}
    </Button>
  );
}

const ActivityDetail = () => {
  const { id } = useParams();
  const { data: dbTour, isLoading } = useTour(id || "");
  const { activities: allActivities } = useMergedActivities();

  const activity = dbTour ? mapTourToActivity(dbTour) : getActivityById(id || "");

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedRental, setSelectedRental] = useState<SelectedRental | null>(null);
  const [selectedAddonsList, setSelectedAddonsList] = useState<SelectedAddon[]>([]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Skeleton className="h-[50vh] w-full" />
        <div className="container mx-auto px-4 py-8">
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

  const rentalExtra = selectedRental ? selectedRental.price : 0;
  const addonsExtra = selectedAddonsList.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = activity.price * adults + activity.price * 0.5 * children + rentalExtra + addonsExtra;
  const relatedActivities = allActivities
    .filter(a => a.id !== activity.id && a.category === activity.category)
    .slice(0, 4);

  const formatTimeSlot = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes || "00"} ${ampm}`;
  };

  const dbTourData = (activity as any)?._dbTour;
  const gallery: string[] = dbTourData?.gallery || [];
  const faqs: { question: string; answer: string }[] = dbTourData?.faqs_enabled && Array.isArray(dbTourData?.faqs) ? dbTourData.faqs : [];

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Banner */}
        <section className="relative h-[50vh] min-h-[360px] overflow-hidden">
          <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark/80 via-ocean-dark/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="container mx-auto">
              <nav className="flex items-center gap-2 text-xs text-primary-foreground/60 mb-4">
                <Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link>
                <span>/</span>
                <Link to="/tours" className="hover:text-primary-foreground transition-colors">Tours</Link>
                <span>/</span>
                <span className="text-primary-foreground/90">{activity.category}</span>
              </nav>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-3">
                {activity.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-primary-foreground/80">
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-gold fill-gold" />
                  <strong className="text-primary-foreground">{activity.rating}</strong>
                  ({activity.reviewCount.toLocaleString()})
                </span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{activity.duration}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{activity.location}</span>
                {activity.instantConfirmation && (
                  <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-gold" />Instant Confirmation</span>
                )}
              </div>
            </div>
          </div>
          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors">
              <Heart className="h-4 w-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* Gallery strip */}
        {gallery.length > 0 && (
          <div className="container mx-auto px-4 -mt-6 relative z-10">
            <div className="grid grid-cols-4 gap-2">
              {gallery.slice(0, 4).map((img, i) => (
                <div key={i} className="aspect-[3/2] rounded-xl overflow-hidden border-2 border-card">
                  <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Quick info pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {discount > 0 && <Badge className="bg-gold text-ocean-dark font-semibold">{discount}% OFF</Badge>}
                {activity.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs font-medium">{tag}</Badge>
                ))}
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0 gap-0 overflow-x-auto">
                  {[
                    { value: "overview", label: "Overview" },
                    { value: "inclusions", label: "Inclusions" },
                    ...(hasItinerary ? [{ value: "itinerary", label: "Itinerary" }] : []),
                    ...(hasRentals ? [{ value: "rentals", label: "Rentals" }] : []),
                    ...(hasHotel ? [{ value: "hotel", label: "Hotel" }] : []),
                    ...(hasTransfers ? [{ value: "transfers", label: "Transfers" }] : []),
                    ...(hasAddons ? [{ value: "addons", label: "Add-ons" }] : []),
                    { value: "details", label: "Details" },
                    ...(hasSafety ? [{ value: "safety", label: "Safety" }] : []),
                    ...(faqs.length > 0 ? [{ value: "faqs", label: "FAQs" }] : []),
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-3 pt-1 px-4 text-sm whitespace-nowrap"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Overview */}
                <TabsContent value="overview" className="pt-8 space-y-8">
                  <p className="text-muted-foreground leading-relaxed text-[15px]">{activity.description}</p>

                  {activity.whatToExpect.length > 0 && (
                    <div>
                      <h3 className="font-serif text-lg font-bold mb-4">Highlights</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {activity.whatToExpect.map((item, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                            <Check className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                            <span className="text-sm text-muted-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activity.bestTime && (
                    <div className="flex items-start gap-3 p-4 bg-gold/5 rounded-xl border border-gold/15">
                      <Sun className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium mb-0.5">Best Time to Visit</p>
                        <p className="text-sm text-muted-foreground">{activity.bestTime}</p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Inclusions */}
                <TabsContent value="inclusions" className="pt-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {activity.inclusions.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Included</h3>
                        <ul className="space-y-2.5">
                          {activity.inclusions.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm">
                              <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {exclusions.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Not Included</h3>
                        <ul className="space-y-2.5">
                          {exclusions.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm">
                              <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Itinerary */}
                {hasItinerary && (
                  <TabsContent value="itinerary" className="pt-8">
                    <div className="space-y-0">
                      {itinerary.map((step, i) => (
                        <div key={i} className="flex gap-4 pb-6 last:pb-0">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-gold/10 border-2 border-gold flex items-center justify-center text-xs font-bold text-gold">{i + 1}</div>
                            {i < itinerary.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
                          </div>
                          <div className="pt-1 pb-2">
                            {step.time && <span className="text-xs font-medium text-gold">{step.time}</span>}
                            <h4 className="font-semibold text-sm mt-0.5">{step.title}</h4>
                            {step.description && <p className="text-muted-foreground text-sm mt-1">{step.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                )}

                {/* Rentals */}
                {hasRentals && (
                  <TabsContent value="rentals" className="pt-8">
                    <div className="grid sm:grid-cols-3 gap-3">
                      {hourlyRentals.map((rental, i) => (
                        <div key={i} className="p-4 rounded-xl border border-border text-center hover:border-gold/40 transition-colors">
                          <p className="font-semibold text-sm">{rental.label || rental.duration}</p>
                          <p className="text-xl font-bold text-gold mt-1">AED {rental.price}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                )}

                {/* Hotel */}
                {hasHotel && (
                  <TabsContent value="hotel" className="pt-8">
                    <div className="p-5 rounded-xl border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{hotelInfo.name}</h4>
                        {hotelInfo.star_rating && (
                          <div className="flex gap-0.5">
                            {[...Array(Number(hotelInfo.star_rating) || 0)].map((_, i) => (
                              <Star key={i} className="h-3.5 w-3.5 text-gold fill-gold" />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="grid sm:grid-cols-3 gap-3 text-sm">
                        {hotelInfo.room_type && <div><span className="text-muted-foreground">Room</span><p className="font-medium">{hotelInfo.room_type}</p></div>}
                        {hotelInfo.check_in && <div><span className="text-muted-foreground">Check-in</span><p className="font-medium">{hotelInfo.check_in}</p></div>}
                        {hotelInfo.check_out && <div><span className="text-muted-foreground">Check-out</span><p className="font-medium">{hotelInfo.check_out}</p></div>}
                      </div>
                      {hotelInfo.amenities?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {hotelInfo.amenities.map((a: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">{a}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )}

                {/* Transfers */}
                {hasTransfers && (
                  <TabsContent value="transfers" className="pt-8 space-y-2">
                    {transferOptions.map((t, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border">
                        <div>
                          <p className="font-medium text-sm">{t.type}</p>
                          {t.description && <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>}
                        </div>
                        <span className="font-bold text-gold text-sm">AED {t.price}</span>
                      </div>
                    ))}
                  </TabsContent>
                )}

                {/* Add-ons */}
                {hasAddons && (
                  <TabsContent value="addons" className="pt-8 space-y-2">
                    {addons.map((addon, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border">
                        <div>
                          <p className="font-medium text-sm">{addon.name}</p>
                          {addon.description && <p className="text-xs text-muted-foreground mt-0.5">{addon.description}</p>}
                        </div>
                        <span className="font-bold text-gold text-sm">+AED {addon.price}</span>
                      </div>
                    ))}
                  </TabsContent>
                )}

                {/* Details */}
                <TabsContent value="details" className="pt-8">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {meetingPoint && (
                      <InfoCard icon={Map} title="Meeting Point" text={meetingPoint} link={mapLink ? { href: mapLink, label: "View Map" } : undefined} />
                    )}
                    {languages.length > 0 && (
                      <InfoCard icon={Globe} title="Languages" text={`${languages.join(", ")}${guideType ? ` · ${guideType} guide` : ""}`} />
                    )}
                    {(tourType || difficultyLevel) && (
                      <InfoCard icon={Users} title="Tour Type" text={`${tourType ? `${tourType} tour` : ""}${tourType && difficultyLevel ? " · " : ""}${difficultyLevel ? `${difficultyLevel} difficulty` : ""}`} />
                    )}
                    {activity.dressCode && <InfoCard icon={Shirt} title="Dress Code" text={activity.dressCode} />}
                    {activity.ageRequirements && <InfoCard icon={Baby} title="Age" text={activity.ageRequirements} />}
                    <InfoCard icon={Shield} title="Cancellation" text={activity.cancellationPolicy} />
                    {whatToBring.length > 0 && (
                      <InfoCard icon={Package} title="Bring" text={whatToBring.join(", ")} />
                    )}
                  </div>
                </TabsContent>

                {/* Safety */}
                {hasSafety && (
                  <TabsContent value="safety" className="pt-8 space-y-3">
                    {safetyReqs.health_requirements && <InfoCard icon={AlertTriangle} title="Health Requirements" text={safetyReqs.health_requirements} />}
                    {safetyReqs.safety_briefing && <InfoCard icon={Shield} title="Safety Briefing" text={safetyReqs.safety_briefing} />}
                    {safetyReqs.insurance_info && <InfoCard icon={Shield} title="Insurance" text={safetyReqs.insurance_info} />}
                    {safetyReqs.waiver_needed && (
                      <div className="p-3 bg-gold/5 rounded-lg border border-gold/15 text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-gold shrink-0" />
                        Waiver / consent form required
                      </div>
                    )}
                  </TabsContent>
                )}

                {/* FAQs */}
                {faqs.length > 0 && (
                  <TabsContent value="faqs" className="pt-8 space-y-3">
                    {faqs.map((faq, i) => (
                      <div key={i} className="p-4 rounded-xl border border-border">
                        <h4 className="font-medium text-sm mb-1">{faq.question}</h4>
                        <p className="text-muted-foreground text-sm">{faq.answer}</p>
                      </div>
                    ))}
                  </TabsContent>
                )}
              </Tabs>
            </div>

            {/* Booking Widget */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-2xl border border-border p-5 space-y-5 shadow-card"
                >
                  {/* Price header */}
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      {activity.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">AED {activity.originalPrice}</span>
                      )}
                      <span className="text-2xl font-bold text-foreground">AED {activity.price}</span>
                    </div>
                    {discount > 0 && <Badge className="bg-gold text-ocean-dark text-xs font-semibold">{discount}%</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground -mt-3">per person</p>

                  {/* Date */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-background hover:border-gold/40 transition-colors text-left text-sm">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className={selectedDate ? "text-foreground" : "text-muted-foreground"}>
                            {selectedDate ? format(selectedDate, "EEE, MMM d") : "Select date"}
                          </span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
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

                  {/* Time */}
                  {selectedDate && activity.timeSlots && activity.timeSlots.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Time</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {activity.timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={cn(
                              "px-2 py-2 rounded-lg text-xs font-medium transition-all border",
                              selectedTime === time
                                ? "bg-gold text-ocean-dark border-gold"
                                : "border-border bg-background hover:border-gold/40 text-foreground"
                            )}
                          >
                            {formatTimeSlot(time)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Guests */}
                  <div className="space-y-2">
                    <GuestRow label="Adults" sub="12+" value={adults} min={1} max={10} onChange={setAdults} />
                    <GuestRow label="Children" sub="3-11" value={children} min={0} max={10} onChange={setChildren} />
                  </div>

                  {/* Hourly Rental Selection */}
                  {hourlyRentals.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Duration</p>
                      <div className="space-y-1.5">
                        {hourlyRentals.map((rental, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedRental(selectedRental?.duration === rental.duration ? null : rental)}
                            className={cn(
                              "w-full flex items-center justify-between p-2.5 rounded-lg border text-xs transition-all",
                              selectedRental?.duration === rental.duration
                                ? "border-gold bg-gold/10"
                                : "border-border bg-background hover:border-gold/40"
                            )}
                          >
                            <span className="font-medium">{rental.label || rental.duration}</span>
                            <span className="font-bold text-gold">+AED {rental.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add-ons Selection */}
                  {addons.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Extras</p>
                      <div className="space-y-1.5">
                        {addons.map((addon, i) => {
                          const isSelected = selectedAddonsList.some(a => a.name === addon.name);
                          return (
                            <button
                              key={i}
                              onClick={() => {
                                setSelectedAddonsList(prev =>
                                  isSelected ? prev.filter(a => a.name !== addon.name) : [...prev, addon]
                                );
                              }}
                              className={cn(
                                "w-full flex items-center justify-between p-2.5 rounded-lg border text-xs transition-all",
                                isSelected ? "border-gold bg-gold/10" : "border-border bg-background hover:border-gold/40"
                              )}
                            >
                              <span className="flex items-center gap-2">
                                <div className={cn("w-4 h-4 rounded border flex items-center justify-center", isSelected ? "bg-gold border-gold" : "border-muted-foreground/30")}>
                                  {isSelected && <Check className="h-2.5 w-2.5 text-ocean-dark" />}
                                </div>
                                <span className="font-medium">{addon.name}</span>
                              </span>
                              <span className="font-bold text-gold">+AED {addon.price}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Price breakdown & CTA */}
                  <div className="pt-4 border-t border-border space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{adults} adult{adults > 1 ? "s" : ""} × AED {activity.price}</span>
                      <span>AED {(activity.price * adults).toFixed(0)}</span>
                    </div>
                    {children > 0 && (
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{children} child{children > 1 ? "ren" : ""} × AED {(activity.price * 0.5).toFixed(0)}</span>
                        <span>AED {(activity.price * 0.5 * children).toFixed(0)}</span>
                      </div>
                    )}
                    {selectedRental && (
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{selectedRental.label || selectedRental.duration}</span>
                        <span>AED {selectedRental.price}</span>
                      </div>
                    )}
                    {selectedAddonsList.map((a, i) => (
                      <div key={i} className="flex justify-between text-xs text-muted-foreground">
                        <span>{a.name}</span>
                        <span>AED {a.price}</span>
                      </div>
                    ))}
                  </div>

                  <AddToCartButton activity={activity} selectedDate={selectedDate} selectedTime={selectedTime} adults={adults} children={children} totalPrice={totalPrice} selectedRental={selectedRental} selectedAddons={selectedAddonsList} />

                  <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Shield className="h-3 w-3" />Secure</span>
                    <span className="flex items-center gap-1"><Zap className="h-3 w-3" />Instant</span>
                    <span className="flex items-center gap-1"><Check className="h-3 w-3" />Free Cancel</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Related */}
          {relatedActivities.length > 0 && (
            <section className="mt-16 pt-10 border-t border-border">
              <h2 className="font-serif text-2xl font-bold mb-6">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

/* ---- Reusable sub-components ---- */

function GuestRow({ label, sub, value, min, max, onChange }: {
  label: string; sub: string; value: number; min: number; max: number; onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-background">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-[11px] text-muted-foreground">Age {sub}</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onChange(Math.max(min, value - 1))} className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:border-gold/40 transition-colors">
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-6 text-center text-sm font-semibold">{value}</span>
        <button onClick={() => onChange(Math.min(max, value + 1))} className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:border-gold/40 transition-colors">
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, text, link }: {
  icon: React.ElementType; title: string; text: string; link?: { href: string; label: string };
}) {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl border border-border">
      <Icon className="h-4 w-4 text-gold shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-medium text-foreground mb-0.5">{title}</p>
        <p className="text-xs text-muted-foreground">{text}</p>
        {link && <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-xs text-gold hover:underline mt-1 inline-block">{link.label} →</a>}
      </div>
    </div>
  );
}

export default ActivityDetail;
