import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import ImageUpload, { GalleryUpload } from "@/components/admin/ImageUpload";

interface ListItem { title: string; }
interface FaqItem { question: string; answer: string; }
interface TimingItem { heading: string; description: string; }
interface HourlyRental { label: string; duration: string; duration_unit: string; price: number; description: string; }
interface TransferOption { type: string; description: string; price: number; }
interface AddonItem { name: string; description: string; price: number; }
interface ItineraryItem { time: string; title: string; description: string; }
interface SeasonalPrice { season: string; start_date: string; end_date: string; adult_price: number; child_price: number; }

interface HotelInfo {
  hotel_name: string; star_rating: string; room_type: string;
  check_in: string; check_out: string; amenities: string[];
}
interface SafetyInfo {
  health_requirements: string; safety_briefing: string;
  insurance_info: string; waiver_needed: boolean;
}
interface CapacityInfo {
  slots_per_timeslot: number | null; overbooking_limit: number | null;
  total_daily_capacity: number | null;
}

const defaultHotel: HotelInfo = { hotel_name: "", star_rating: "", room_type: "", check_in: "", check_out: "", amenities: [] };
const defaultSafety: SafetyInfo = { health_requirements: "", safety_briefing: "", insurance_info: "", waiver_needed: false };
const defaultCapacity: CapacityInfo = { slots_per_timeslot: null, overbooking_limit: null, total_daily_capacity: null };

const defaultTour = {
  title: "", slug: "", overview: "", status: "draft", featured: false, category: "",
  feature_image: "", banner_image: "", youtube_link: "",
  duration: "", duration_unit: "hours", pickup_time: "", dropback_time: "",
  adult_price: 0, adult_sale_price: null as number | null,
  child_price: 0, child_sale_price: null as number | null,
  infant_price: 0,
  private_transfer_price: null as number | null, sharing_transfer_price: null as number | null,
  pricing_type: "normal", min_quantity: 1, max_quantity: 20,
  min_people: null as number | null, max_people: null as number | null,
  service_fee_enabled: false, service_fee: null as number | null,
  extra_fee_enabled: false, extra_fee: null as number | null,
  booking_policy: "", cancellation_policy: "", child_policy: "",
  faqs_enabled: false,
  adult_age_label: "Adult", child_age_label: "Child", infant_age_label: "Infant",
  meta_title: "", meta_keyword: "", meta_description: "", meta_tag: "",
  meeting_point: "", map_link: "", guide_type: "live", tour_type: "group",
  difficulty_level: "easy", accessibility_info: "", dress_code: "",
  seasonal_availability: "", confirmation_type: "instant", voucher_type: "mobile",
  min_age: null as number | null, wheelchair_accessible: false, max_group_size: null as number | null,
};

const TourForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [tour, setTour] = useState(defaultTour);
  const [inclusions, setInclusions] = useState<ListItem[]>([]);
  const [whyGo, setWhyGo] = useState<ListItem[]>([]);
  const [advantage, setAdvantage] = useState<ListItem[]>([]);
  const [importantInfo, setImportantInfo] = useState<ListItem[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState<ListItem[]>([]);
  const [operatingHours, setOperatingHours] = useState<ListItem[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [timingLocation, setTimingLocation] = useState<TimingItem[]>([]);
  const [exclusions, setExclusions] = useState<ListItem[]>([]);
  const [whatToBring, setWhatToBring] = useState<ListItem[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [blackoutDates, setBlackoutDates] = useState<string[]>([]);
  const [gallery, setGallery] = useState<string[]>([]);
  // New fields
  const [hotelInfo, setHotelInfo] = useState<HotelInfo>(defaultHotel);
  const [hourlyRentals, setHourlyRentals] = useState<HourlyRental[]>([]);
  const [transferOptions, setTransferOptions] = useState<TransferOption[]>([]);
  const [addons, setAddons] = useState<AddonItem[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [safetyInfo, setSafetyInfo] = useState<SafetyInfo>(defaultSafety);
  const [seasonalPricing, setSeasonalPricing] = useState<SeasonalPrice[]>([]);
  const [capacityInfo, setCapacityInfo] = useState<CapacityInfo>(defaultCapacity);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      supabase.from("tours").select("*").eq("id", id).single().then(({ data, error }) => {
        if (error || !data) { toast.error("Tour not found"); navigate("/admin/tours"); return; }
        const d = data as any;
        setTour({
          title: d.title || "", slug: d.slug || "", overview: d.overview || "",
          status: d.status, featured: d.featured || false, category: d.category || "",
          feature_image: d.feature_image || "", banner_image: d.banner_image || "",
          youtube_link: d.youtube_link || "", duration: d.duration || "",
          duration_unit: d.duration_unit || "hours", pickup_time: d.pickup_time || "",
          dropback_time: d.dropback_time || "",
          adult_price: Number(d.adult_price) || 0,
          adult_sale_price: d.adult_sale_price ? Number(d.adult_sale_price) : null,
          child_price: Number(d.child_price) || 0,
          child_sale_price: d.child_sale_price ? Number(d.child_sale_price) : null,
          infant_price: Number(d.infant_price) || 0,
          private_transfer_price: d.private_transfer_price ? Number(d.private_transfer_price) : null,
          sharing_transfer_price: d.sharing_transfer_price ? Number(d.sharing_transfer_price) : null,
          pricing_type: d.pricing_type || "normal",
          min_quantity: d.min_quantity || 1, max_quantity: d.max_quantity || 20,
          min_people: d.min_people, max_people: d.max_people,
          service_fee_enabled: d.service_fee_enabled || false,
          service_fee: d.service_fee ? Number(d.service_fee) : null,
          extra_fee_enabled: d.extra_fee_enabled || false,
          extra_fee: d.extra_fee ? Number(d.extra_fee) : null,
          booking_policy: d.booking_policy || "", cancellation_policy: d.cancellation_policy || "",
          child_policy: d.child_policy || "", faqs_enabled: d.faqs_enabled || false,
          adult_age_label: d.adult_age_label || "Adult", child_age_label: d.child_age_label || "Child",
          infant_age_label: d.infant_age_label || "Infant",
          meta_title: d.meta_title || "", meta_keyword: d.meta_keyword || "",
          meta_description: d.meta_description || "", meta_tag: d.meta_tag || "",
          meeting_point: d.meeting_point || "", map_link: d.map_link || "",
          guide_type: d.guide_type || "live", tour_type: d.tour_type || "group",
          difficulty_level: d.difficulty_level || "easy", accessibility_info: d.accessibility_info || "",
          dress_code: d.dress_code || "", seasonal_availability: d.seasonal_availability || "",
          confirmation_type: d.confirmation_type || "instant", voucher_type: d.voucher_type || "mobile",
          min_age: d.min_age ?? null, wheelchair_accessible: d.wheelchair_accessible || false,
          max_group_size: d.max_group_size ?? null,
        });
        setInclusions((d.inclusions as ListItem[]) || []);
        setExclusions((d.exclusions as ListItem[]) || []);
        setWhatToBring((d.what_to_bring as ListItem[]) || []);
        setLanguages((d.languages as string[]) || []);
        setAvailableDays((d.available_days as string[]) || []);
        setBlackoutDates((d.blackout_dates as string[]) || []);
        setWhyGo((d.why_go as ListItem[]) || []);
        setAdvantage((d.advantage as ListItem[]) || []);
        setImportantInfo((d.important_info as ListItem[]) || []);
        setAdditionalInfo((d.additional_info as ListItem[]) || []);
        setOperatingHours((d.operating_hours as ListItem[]) || []);
        setFaqs((d.faqs as FaqItem[]) || []);
        setTimingLocation((d.activity_timing_location as TimingItem[]) || []);
        setGallery((d.gallery as string[]) || []);
        // New fields
        setHotelInfo(d.hotel_info && typeof d.hotel_info === "object" && !Array.isArray(d.hotel_info) ? { ...defaultHotel, ...d.hotel_info } : defaultHotel);
        setHourlyRentals(Array.isArray(d.hourly_rentals) ? d.hourly_rentals : []);
        setTransferOptions(Array.isArray(d.transfer_options) ? d.transfer_options : []);
        setAddons(Array.isArray(d.addons) ? d.addons : []);
        setItinerary(Array.isArray(d.itinerary) ? d.itinerary : []);
        setSafetyInfo(d.safety_requirements && typeof d.safety_requirements === "object" && !Array.isArray(d.safety_requirements) ? { ...defaultSafety, ...d.safety_requirements } : defaultSafety);
        setSeasonalPricing(Array.isArray(d.seasonal_pricing) ? d.seasonal_pricing : []);
        setCapacityInfo(d.capacity && typeof d.capacity === "object" && !Array.isArray(d.capacity) ? { ...defaultCapacity, ...d.capacity } : defaultCapacity);
      });
    }
  }, [id, isEdit, navigate]);

  const updateField = (field: string, value: any) => setTour(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!tour.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    const slug = tour.slug || tour.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const payload: any = {
      ...tour, slug,
      adult_price: tour.adult_price || 0, child_price: tour.child_price || 0, infant_price: tour.infant_price || 0,
      gallery, inclusions: inclusions as any, exclusions: exclusions as any,
      what_to_bring: whatToBring as any, languages, available_days: availableDays,
      blackout_dates: blackoutDates, why_go: whyGo as any, advantage: advantage as any,
      important_info: importantInfo as any, additional_info: additionalInfo as any,
      operating_hours: operatingHours as any, faqs: faqs as any,
      activity_timing_location: timingLocation as any,
      // New fields
      hotel_info: hotelInfo, hourly_rentals: hourlyRentals, transfer_options: transferOptions,
      addons: addons, itinerary: itinerary, safety_requirements: safetyInfo,
      seasonal_pricing: seasonalPricing, capacity: capacityInfo,
    };

    let error;
    if (isEdit) {
      ({ error } = await supabase.from("tours").update(payload).eq("id", id));
    } else {
      ({ error } = await supabase.from("tours").insert(payload));
    }
    if (error) { toast.error(error.message); setSaving(false); return; }
    toast.success(isEdit ? "Tour updated!" : "Tour created!");
    navigate("/admin/tours");
  };

  const ListEditor = ({ items, setItems, label }: { items: ListItem[]; setItems: (v: ListItem[]) => void; label: string }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Input value={item.title} onChange={(e) => { const n = [...items]; n[i] = { title: e.target.value }; setItems(n); }} placeholder={`Enter ${label.toLowerCase()}`} />
          <Button variant="ghost" size="icon" onClick={() => setItems(items.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4 text-destructive" /></Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => setItems([...items, { title: "" }])}><Plus className="w-4 h-4 mr-1" /> Add Item</Button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/tours")}><ArrowLeft className="w-5 h-5" /></Button>
        <h2 className="text-2xl font-bold">{isEdit ? "Edit Tour" : "Create Tour"}</h2>
        <div className="ml-auto flex gap-2">
          <Select value={tour.status} onValueChange={(v) => updateField("status", v)}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSave} disabled={saving}><Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save"}</Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList className="w-full flex flex-wrap h-auto gap-1">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="hourly">Hourly Rentals</TabsTrigger>
          <TabsTrigger value="hotel">Hotel Info</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
          <TabsTrigger value="addons">Add-ons</TabsTrigger>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="information">Info</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal Pricing</TabsTrigger>
          <TabsTrigger value="capacity">Capacity</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input value={tour.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Enter tour title" />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={tour.slug} onChange={(e) => updateField("slug", e.target.value)} placeholder="auto-generated-from-title" />
              </div>
              <div className="space-y-2">
                <Label>Overview</Label>
                <Textarea value={tour.overview} onChange={(e) => updateField("overview", e.target.value)} placeholder="Tour overview..." rows={6} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={tour.category} onValueChange={(v) => updateField("category", v)}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Attractions">Attractions</SelectItem>
                    <SelectItem value="Adventure">Adventure</SelectItem>
                    <SelectItem value="Luxury">Luxury</SelectItem>
                    <SelectItem value="Theme Parks">Theme Parks</SelectItem>
                    <SelectItem value="Cultural">Cultural</SelectItem>
                    <SelectItem value="City Tours">City Tours</SelectItem>
                    <SelectItem value="Water Activities">Water Activities</SelectItem>
                    <SelectItem value="Hotel Packages">Hotel Packages</SelectItem>
                    <SelectItem value="Jet Ski">Jet Ski</SelectItem>
                    <SelectItem value="Yacht">Yacht</SelectItem>
                    <SelectItem value="Desert Safari">Desert Safari</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={tour.featured} onCheckedChange={(v) => updateField("featured", v)} />
                <Label>Enable Featured</Label>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Media</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ImageUpload label="Feature Image" value={tour.feature_image} onChange={(url) => updateField("feature_image", url)} folder="feature" />
              <Separator />
              <ImageUpload label="Banner Image" value={tour.banner_image} onChange={(url) => updateField("banner_image", url)} folder="banner" />
              <Separator />
              <GalleryUpload images={gallery} onChange={setGallery} />
              <Separator />
              <div className="space-y-2">
                <Label>YouTube Link</Label>
                <Input value={tour.youtube_link} onChange={(e) => updateField("youtube_link", e.target.value)} placeholder="https://youtube.com/..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Pricing</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Pricing Type</Label>
                <Select value={tour.pricing_type} onValueChange={(v) => updateField("pricing_type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="per_person">Per Person</SelectItem>
                    <SelectItem value="tiered">Tiered</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Adult Price (AED)</Label><Input type="number" value={tour.adult_price} onChange={(e) => updateField("adult_price", Number(e.target.value))} /></div>
                <div className="space-y-2"><Label>Adult Sale Price</Label><Input type="number" value={tour.adult_sale_price ?? ""} onChange={(e) => updateField("adult_sale_price", e.target.value ? Number(e.target.value) : null)} /></div>
                <div className="space-y-2"><Label>Child Price (AED)</Label><Input type="number" value={tour.child_price} onChange={(e) => updateField("child_price", Number(e.target.value))} /></div>
                <div className="space-y-2"><Label>Child Sale Price</Label><Input type="number" value={tour.child_sale_price ?? ""} onChange={(e) => updateField("child_sale_price", e.target.value ? Number(e.target.value) : null)} /></div>
                <div className="space-y-2"><Label>Infant Price (AED)</Label><Input type="number" value={tour.infant_price} onChange={(e) => updateField("infant_price", Number(e.target.value))} /></div>
              </div>
              <Separator />
              <h4 className="font-medium">Transfer Pricing</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Private Transfer Price</Label><Input type="number" value={tour.private_transfer_price ?? ""} onChange={(e) => updateField("private_transfer_price", e.target.value ? Number(e.target.value) : null)} /></div>
                <div className="space-y-2"><Label>Sharing Transfer Price</Label><Input type="number" value={tour.sharing_transfer_price ?? ""} onChange={(e) => updateField("sharing_transfer_price", e.target.value ? Number(e.target.value) : null)} /></div>
              </div>
              <Separator />
              <h4 className="font-medium">Fees</h4>
              <div className="flex items-center gap-3 mb-2"><Switch checked={tour.service_fee_enabled} onCheckedChange={(v) => updateField("service_fee_enabled", v)} /><Label>Enable Service Fee</Label></div>
              {tour.service_fee_enabled && <Input type="number" value={tour.service_fee ?? ""} onChange={(e) => updateField("service_fee", e.target.value ? Number(e.target.value) : null)} placeholder="Service fee amount" />}
              <div className="flex items-center gap-3 mb-2"><Switch checked={tour.extra_fee_enabled} onCheckedChange={(v) => updateField("extra_fee_enabled", v)} /><Label>Enable Extra Fee</Label></div>
              {tour.extra_fee_enabled && <Input type="number" value={tour.extra_fee ?? ""} onChange={(e) => updateField("extra_fee", e.target.value ? Number(e.target.value) : null)} placeholder="Extra fee amount" />}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Quantity</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2"><Label>Min Qty</Label><Input type="number" value={tour.min_quantity} onChange={(e) => updateField("min_quantity", Number(e.target.value))} /></div>
                <div className="space-y-2"><Label>Max Qty</Label><Input type="number" value={tour.max_quantity} onChange={(e) => updateField("max_quantity", Number(e.target.value))} /></div>
                <div className="space-y-2"><Label>Min People</Label><Input type="number" value={tour.min_people ?? ""} onChange={(e) => updateField("min_people", e.target.value ? Number(e.target.value) : null)} /></div>
                <div className="space-y-2"><Label>Max People</Label><Input type="number" value={tour.max_people ?? ""} onChange={(e) => updateField("max_people", e.target.value ? Number(e.target.value) : null)} /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hourly Rentals Tab */}
        <TabsContent value="hourly" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Hourly Rental Options</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Add multiple duration/price tiers for rentals like Jet Ski, Yacht, ATV, etc.</p>
              {hourlyRentals.map((r, i) => (
                <div key={i} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Option {i + 1}</span>
                    <Button variant="ghost" size="icon" onClick={() => setHourlyRentals(hourlyRentals.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Label</Label><Input value={r.label} onChange={(e) => { const n = [...hourlyRentals]; n[i] = { ...n[i], label: e.target.value }; setHourlyRentals(n); }} placeholder="e.g. 1 Hour Jet Ski" /></div>
                    <div className="space-y-1"><Label className="text-xs">Price (AED)</Label><Input type="number" value={r.price} onChange={(e) => { const n = [...hourlyRentals]; n[i] = { ...n[i], price: Number(e.target.value) }; setHourlyRentals(n); }} /></div>
                    <div className="space-y-1">
                      <Label className="text-xs">Duration</Label>
                      <div className="flex gap-2">
                        <Input value={r.duration} onChange={(e) => { const n = [...hourlyRentals]; n[i] = { ...n[i], duration: e.target.value }; setHourlyRentals(n); }} placeholder="e.g. 1" />
                        <Select value={r.duration_unit} onValueChange={(v) => { const n = [...hourlyRentals]; n[i] = { ...n[i], duration_unit: v }; setHourlyRentals(n); }}>
                          <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minutes">Minutes</SelectItem>
                            <SelectItem value="hours">Hours</SelectItem>
                            <SelectItem value="days">Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1"><Label className="text-xs">Description</Label><Input value={r.description} onChange={(e) => { const n = [...hourlyRentals]; n[i] = { ...n[i], description: e.target.value }; setHourlyRentals(n); }} placeholder="Brief description" /></div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setHourlyRentals([...hourlyRentals, { label: "", duration: "", duration_unit: "hours", price: 0, description: "" }])}>
                <Plus className="w-4 h-4 mr-1" /> Add Rental Option
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hotel Info Tab */}
        <TabsContent value="hotel" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Hotel Package Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Hotel Name</Label><Input value={hotelInfo.hotel_name} onChange={(e) => setHotelInfo({ ...hotelInfo, hotel_name: e.target.value })} placeholder="e.g. Atlantis The Palm" /></div>
                <div className="space-y-2">
                  <Label>Star Rating</Label>
                  <Select value={hotelInfo.star_rating} onValueChange={(v) => setHotelInfo({ ...hotelInfo, star_rating: v })}>
                    <SelectTrigger><SelectValue placeholder="Select rating" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Star</SelectItem>
                      <SelectItem value="4">4 Star</SelectItem>
                      <SelectItem value="5">5 Star</SelectItem>
                      <SelectItem value="7">7 Star</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Room Type</Label><Input value={hotelInfo.room_type} onChange={(e) => setHotelInfo({ ...hotelInfo, room_type: e.target.value })} placeholder="e.g. Deluxe King Room" /></div>
                <div className="space-y-2"><Label>Check-in Time</Label><Input value={hotelInfo.check_in} onChange={(e) => setHotelInfo({ ...hotelInfo, check_in: e.target.value })} placeholder="e.g. 3:00 PM" /></div>
                <div className="space-y-2"><Label>Check-out Time</Label><Input value={hotelInfo.check_out} onChange={(e) => setHotelInfo({ ...hotelInfo, check_out: e.target.value })} placeholder="e.g. 12:00 PM" /></div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Hotel Amenities</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {hotelInfo.amenities.map((a, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm">
                      {a}<button type="button" onClick={() => setHotelInfo({ ...hotelInfo, amenities: hotelInfo.amenities.filter((_, j) => j !== i) })} className="text-destructive hover:text-destructive/80">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input id="new-amenity" placeholder="e.g. Free WiFi, Pool, Spa" onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); const v = (e.target as HTMLInputElement).value.trim(); if (v) { setHotelInfo({ ...hotelInfo, amenities: [...hotelInfo.amenities, v] }); (e.target as HTMLInputElement).value = ""; } }
                  }} />
                  <Button type="button" variant="outline" size="sm" onClick={() => {
                    const el = document.getElementById("new-amenity") as HTMLInputElement; const v = el?.value.trim(); if (v) { setHotelInfo({ ...hotelInfo, amenities: [...hotelInfo.amenities, v] }); el.value = ""; }
                  }}><Plus className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transfer Options Tab */}
        <TabsContent value="transfers" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Transfer Options</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Add different transfer types with separate pricing (hotel pickup, airport, shared bus, etc.)</p>
              {transferOptions.map((t, i) => (
                <div key={i} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Transfer {i + 1}</span>
                    <Button variant="ghost" size="icon" onClick={() => setTransferOptions(transferOptions.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Type</Label>
                      <Select value={t.type} onValueChange={(v) => { const n = [...transferOptions]; n[i] = { ...n[i], type: v }; setTransferOptions(n); }}>
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hotel_pickup">Hotel Pickup</SelectItem>
                          <SelectItem value="airport_transfer">Airport Transfer</SelectItem>
                          <SelectItem value="shared_bus">Shared Bus</SelectItem>
                          <SelectItem value="private_car">Private Car</SelectItem>
                          <SelectItem value="limousine">Limousine</SelectItem>
                          <SelectItem value="self_drive">Self Drive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1"><Label className="text-xs">Description</Label><Input value={t.description} onChange={(e) => { const n = [...transferOptions]; n[i] = { ...n[i], description: e.target.value }; setTransferOptions(n); }} placeholder="Details" /></div>
                    <div className="space-y-1"><Label className="text-xs">Price (AED)</Label><Input type="number" value={t.price} onChange={(e) => { const n = [...transferOptions]; n[i] = { ...n[i], price: Number(e.target.value) }; setTransferOptions(n); }} /></div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setTransferOptions([...transferOptions, { type: "", description: "", price: 0 }])}>
                <Plus className="w-4 h-4 mr-1" /> Add Transfer Option
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add-ons Tab */}
        <TabsContent value="addons" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Add-ons & Extras</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Optional extras guests can add: photography, meals, VIP upgrade, insurance, etc.</p>
              {addons.map((a, i) => (
                <div key={i} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Add-on {i + 1}</span>
                    <Button variant="ghost" size="icon" onClick={() => setAddons(addons.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Name</Label><Input value={a.name} onChange={(e) => { const n = [...addons]; n[i] = { ...n[i], name: e.target.value }; setAddons(n); }} placeholder="e.g. Professional Photography" /></div>
                    <div className="space-y-1"><Label className="text-xs">Description</Label><Input value={a.description} onChange={(e) => { const n = [...addons]; n[i] = { ...n[i], description: e.target.value }; setAddons(n); }} placeholder="Brief description" /></div>
                    <div className="space-y-1"><Label className="text-xs">Price (AED)</Label><Input type="number" value={a.price} onChange={(e) => { const n = [...addons]; n[i] = { ...n[i], price: Number(e.target.value) }; setAddons(n); }} /></div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setAddons([...addons, { name: "", description: "", price: 0 }])}>
                <Plus className="w-4 h-4 mr-1" /> Add Extra
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Itinerary Tab */}
        <TabsContent value="itinerary" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Tour Itinerary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Step-by-step timeline of the tour experience.</p>
              {itinerary.map((item, i) => (
                <div key={i} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Stop {i + 1}</span>
                    <Button variant="ghost" size="icon" onClick={() => setItinerary(itinerary.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Time</Label><Input value={item.time} onChange={(e) => { const n = [...itinerary]; n[i] = { ...n[i], time: e.target.value }; setItinerary(n); }} placeholder="e.g. 9:00 AM" /></div>
                    <div className="space-y-1"><Label className="text-xs">Title</Label><Input value={item.title} onChange={(e) => { const n = [...itinerary]; n[i] = { ...n[i], title: e.target.value }; setItinerary(n); }} placeholder="e.g. Hotel Pickup" /></div>
                    <div className="space-y-1"><Label className="text-xs">Description</Label><Input value={item.description} onChange={(e) => { const n = [...itinerary]; n[i] = { ...n[i], description: e.target.value }; setItinerary(n); }} placeholder="Details about this stop" /></div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setItinerary([...itinerary, { time: "", title: "", description: "" }])}>
                <Plus className="w-4 h-4 mr-1" /> Add Itinerary Stop
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tour Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Duration & Times</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <div className="flex gap-2">
                    <Input value={tour.duration} onChange={(e) => updateField("duration", e.target.value)} placeholder="e.g. 3" />
                    <Select value={tour.duration_unit} onValueChange={(v) => updateField("duration_unit", v)}>
                      <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2"><Label>Pickup Time</Label><Input value={tour.pickup_time} onChange={(e) => updateField("pickup_time", e.target.value)} placeholder="e.g. 9:00 AM" /></div>
                <div className="space-y-2"><Label>Dropback Time</Label><Input value={tour.dropback_time} onChange={(e) => updateField("dropback_time", e.target.value)} placeholder="e.g. 5:00 PM" /></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Age Configuration</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Adult Age Label</Label><Input value={tour.adult_age_label} onChange={(e) => updateField("adult_age_label", e.target.value)} /></div>
                <div className="space-y-2"><Label>Child Age Label</Label><Input value={tour.child_age_label} onChange={(e) => updateField("child_age_label", e.target.value)} /></div>
                <div className="space-y-2"><Label>Infant Age Label</Label><Input value={tour.infant_age_label} onChange={(e) => updateField("infant_age_label", e.target.value)} /></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Activity Timing & Location</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {timingLocation.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={item.heading} onChange={(e) => { const n = [...timingLocation]; n[i] = { ...n[i], heading: e.target.value }; setTimingLocation(n); }} placeholder="e.g. Duration" />
                  <Input value={item.description} onChange={(e) => { const n = [...timingLocation]; n[i] = { ...n[i], description: e.target.value }; setTimingLocation(n); }} placeholder="e.g. 6 Hours Approx." />
                  <Button variant="ghost" size="icon" onClick={() => setTimingLocation(timingLocation.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setTimingLocation([...timingLocation, { heading: "", description: "" }])}><Plus className="w-4 h-4 mr-1" /> Add Item</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location & Guide Tab */}
        <TabsContent value="location" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Meeting Point</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Meeting Point / Pickup Location</Label><Textarea value={tour.meeting_point} onChange={(e) => updateField("meeting_point", e.target.value)} placeholder="e.g. Hotel lobby, Dubai Mall entrance..." rows={3} /></div>
              <div className="space-y-2"><Label>Google Maps Link</Label><Input value={tour.map_link} onChange={(e) => updateField("map_link", e.target.value)} placeholder="https://maps.google.com/..." /></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Guide & Language</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Guide Type</Label>
                <Select value={tour.guide_type} onValueChange={(v) => updateField("guide_type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="live">Live Guide</SelectItem>
                    <SelectItem value="audio">Audio Guide</SelectItem>
                    <SelectItem value="self-guided">Self-Guided</SelectItem>
                    <SelectItem value="none">No Guide</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Languages Available</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {languages.map((lang, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm">
                      {lang}<button type="button" onClick={() => setLanguages(languages.filter((_, j) => j !== i))} className="text-destructive hover:text-destructive/80">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input id="new-lang" placeholder="e.g. English" onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); const v = (e.target as HTMLInputElement).value.trim(); if (v && !languages.includes(v)) { setLanguages([...languages, v]); (e.target as HTMLInputElement).value = ""; } }
                  }} />
                  <Button type="button" variant="outline" size="sm" onClick={() => {
                    const el = document.getElementById("new-lang") as HTMLInputElement; const v = el?.value.trim(); if (v && !languages.includes(v)) { setLanguages([...languages, v]); el.value = ""; }
                  }}><Plus className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tour Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Tour Type & Difficulty</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tour Type</Label>
                  <Select value={tour.tour_type} onValueChange={(v) => updateField("tour_type", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="group">Group Tour</SelectItem>
                      <SelectItem value="private">Private Tour</SelectItem>
                      <SelectItem value="self-guided">Self-Guided</SelectItem>
                      <SelectItem value="shared">Shared Tour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Difficulty Level</Label>
                  <Select value={tour.difficulty_level} onValueChange={(v) => updateField("difficulty_level", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="challenging">Challenging</SelectItem>
                      <SelectItem value="extreme">Extreme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Confirmation & Voucher</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Confirmation Type</Label>
                  <Select value={tour.confirmation_type} onValueChange={(v) => updateField("confirmation_type", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instant">Instant Confirmation</SelectItem>
                      <SelectItem value="manual">Manual Confirmation</SelectItem>
                      <SelectItem value="within_24h">Within 24 Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Voucher Type</Label>
                  <Select value={tour.voucher_type} onValueChange={(v) => updateField("voucher_type", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mobile">Mobile Voucher</SelectItem>
                      <SelectItem value="printed">Printed Voucher</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Accessibility & Requirements</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Minimum Age</Label><Input type="number" value={tour.min_age ?? ""} onChange={(e) => updateField("min_age", e.target.value ? Number(e.target.value) : null)} placeholder="No minimum" /></div>
                <div className="space-y-2"><Label>Max Group Size</Label><Input type="number" value={tour.max_group_size ?? ""} onChange={(e) => updateField("max_group_size", e.target.value ? Number(e.target.value) : null)} placeholder="No limit" /></div>
              </div>
              <div className="flex items-center gap-3"><Switch checked={tour.wheelchair_accessible} onCheckedChange={(v) => updateField("wheelchair_accessible", v)} /><Label>Wheelchair Accessible</Label></div>
              <div className="space-y-2"><Label>Accessibility Information</Label><Textarea value={tour.accessibility_info} onChange={(e) => updateField("accessibility_info", e.target.value)} placeholder="Details about accessibility..." rows={3} /></div>
              <div className="space-y-2"><Label>Dress Code</Label><Input value={tour.dress_code} onChange={(e) => updateField("dress_code", e.target.value)} placeholder="e.g. Smart casual, covered shoulders..." /></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">What to Bring</CardTitle></CardHeader>
            <CardContent><ListEditor items={whatToBring} setItems={setWhatToBring} label="Items to Bring" /></CardContent>
          </Card>
        </TabsContent>

        {/* Safety Tab */}
        <TabsContent value="safety" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Safety & Requirements</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Health Requirements</Label><Textarea value={safetyInfo.health_requirements} onChange={(e) => setSafetyInfo({ ...safetyInfo, health_requirements: e.target.value })} placeholder="e.g. Must be in good physical health, no heart conditions..." rows={3} /></div>
              <div className="space-y-2"><Label>Safety Briefing</Label><Textarea value={safetyInfo.safety_briefing} onChange={(e) => setSafetyInfo({ ...safetyInfo, safety_briefing: e.target.value })} placeholder="Safety instructions provided before the activity..." rows={3} /></div>
              <div className="space-y-2"><Label>Insurance Information</Label><Textarea value={safetyInfo.insurance_info} onChange={(e) => setSafetyInfo({ ...safetyInfo, insurance_info: e.target.value })} placeholder="Insurance coverage details..." rows={3} /></div>
              <div className="flex items-center gap-3"><Switch checked={safetyInfo.waiver_needed} onCheckedChange={(v) => setSafetyInfo({ ...safetyInfo, waiver_needed: v })} /><Label>Waiver/Consent Form Required</Label></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Information Tab */}
        <TabsContent value="information" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <ListEditor items={inclusions} setItems={setInclusions} label="Inclusions" />
              <Separator />
              <ListEditor items={exclusions} setItems={setExclusions} label="Exclusions" />
              <Separator />
              <ListEditor items={whyGo} setItems={setWhyGo} label="Why Should I Go For This?" />
              <Separator />
              <ListEditor items={advantage} setItems={setAdvantage} label="The BetterView Tours Advantage" />
              <Separator />
              <ListEditor items={importantInfo} setItems={setImportantInfo} label="Important Information" />
              <Separator />
              <ListEditor items={additionalInfo} setItems={setAdditionalInfo} label="Additional Information" />
              <Separator />
              <ListEditor items={operatingHours} setItems={setOperatingHours} label="Operating Hours" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Policies Tab */}
        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2"><Label>Booking Policy</Label><Textarea value={tour.booking_policy} onChange={(e) => updateField("booking_policy", e.target.value)} rows={4} /></div>
              <div className="space-y-2"><Label>Cancellation Policy</Label><Textarea value={tour.cancellation_policy} onChange={(e) => updateField("cancellation_policy", e.target.value)} rows={4} /></div>
              <div className="space-y-2"><Label>Child Policy</Label><Textarea value={tour.child_policy} onChange={(e) => updateField("child_policy", e.target.value)} rows={4} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Available Days</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <Button key={day} type="button" variant={availableDays.includes(day) ? "default" : "outline"} size="sm"
                    onClick={() => setAvailableDays(availableDays.includes(day) ? availableDays.filter(d => d !== day) : [...availableDays, day])}>
                    {day}
                  </Button>
                ))}
              </div>
              <div className="space-y-2"><Label>Seasonal Availability</Label><Input value={tour.seasonal_availability} onChange={(e) => updateField("seasonal_availability", e.target.value)} placeholder="e.g. October to April, Summer only..." /></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Blackout Dates</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-wrap gap-2 mb-2">
                {blackoutDates.map((d, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm">
                    {d}<button type="button" onClick={() => setBlackoutDates(blackoutDates.filter((_, j) => j !== i))} className="text-destructive hover:text-destructive/80">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input id="new-blackout" type="date" />
                <Button type="button" variant="outline" size="sm" onClick={() => {
                  const el = document.getElementById("new-blackout") as HTMLInputElement; const v = el?.value; if (v && !blackoutDates.includes(v)) { setBlackoutDates([...blackoutDates, v]); el.value = ""; }
                }}><Plus className="w-4 h-4 mr-1" /> Add</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seasonal Pricing Tab */}
        <TabsContent value="seasonal" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Seasonal Pricing</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Set different prices for peak/off-peak seasons with specific date ranges.</p>
              {seasonalPricing.map((sp, i) => (
                <div key={i} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Season {i + 1}</span>
                    <Button variant="ghost" size="icon" onClick={() => setSeasonalPricing(seasonalPricing.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Season Name</Label><Input value={sp.season} onChange={(e) => { const n = [...seasonalPricing]; n[i] = { ...n[i], season: e.target.value }; setSeasonalPricing(n); }} placeholder="e.g. Peak Summer" /></div>
                    <div className="space-y-1"><Label className="text-xs">Start Date</Label><Input type="date" value={sp.start_date} onChange={(e) => { const n = [...seasonalPricing]; n[i] = { ...n[i], start_date: e.target.value }; setSeasonalPricing(n); }} /></div>
                    <div className="space-y-1"><Label className="text-xs">End Date</Label><Input type="date" value={sp.end_date} onChange={(e) => { const n = [...seasonalPricing]; n[i] = { ...n[i], end_date: e.target.value }; setSeasonalPricing(n); }} /></div>
                    <div className="space-y-1"><Label className="text-xs">Adult Price (AED)</Label><Input type="number" value={sp.adult_price} onChange={(e) => { const n = [...seasonalPricing]; n[i] = { ...n[i], adult_price: Number(e.target.value) }; setSeasonalPricing(n); }} /></div>
                    <div className="space-y-1"><Label className="text-xs">Child Price (AED)</Label><Input type="number" value={sp.child_price} onChange={(e) => { const n = [...seasonalPricing]; n[i] = { ...n[i], child_price: Number(e.target.value) }; setSeasonalPricing(n); }} /></div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setSeasonalPricing([...seasonalPricing, { season: "", start_date: "", end_date: "", adult_price: 0, child_price: 0 }])}>
                <Plus className="w-4 h-4 mr-1" /> Add Season
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Capacity Tab */}
        <TabsContent value="capacity" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Capacity Management</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Slots Per Timeslot</Label><Input type="number" value={capacityInfo.slots_per_timeslot ?? ""} onChange={(e) => setCapacityInfo({ ...capacityInfo, slots_per_timeslot: e.target.value ? Number(e.target.value) : null })} placeholder="e.g. 20" /></div>
                <div className="space-y-2"><Label>Total Daily Capacity</Label><Input type="number" value={capacityInfo.total_daily_capacity ?? ""} onChange={(e) => setCapacityInfo({ ...capacityInfo, total_daily_capacity: e.target.value ? Number(e.target.value) : null })} placeholder="e.g. 100" /></div>
                <div className="space-y-2"><Label>Overbooking Limit</Label><Input type="number" value={capacityInfo.overbooking_limit ?? ""} onChange={(e) => setCapacityInfo({ ...capacityInfo, overbooking_limit: e.target.value ? Number(e.target.value) : null })} placeholder="e.g. 5" /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Switch checked={tour.faqs_enabled} onCheckedChange={(v) => updateField("faqs_enabled", v)} />
                <CardTitle className="text-lg">Enable FAQs</CardTitle>
              </div>
            </CardHeader>
            {tour.faqs_enabled && (
              <CardContent className="space-y-3">
                {faqs.map((faq, i) => (
                  <div key={i} className="space-y-2 p-3 border rounded-lg">
                    <div className="flex gap-2">
                      <Input value={faq.question} onChange={(e) => { const n = [...faqs]; n[i] = { ...n[i], question: e.target.value }; setFaqs(n); }} placeholder="Question" />
                      <Button variant="ghost" size="icon" onClick={() => setFaqs(faqs.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                    <Textarea value={faq.answer} onChange={(e) => { const n = [...faqs]; n[i] = { ...n[i], answer: e.target.value }; setFaqs(n); }} placeholder="Answer" rows={2} />
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}><Plus className="w-4 h-4 mr-1" /> Add FAQ</Button>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">SEO Management</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Meta Title</Label><Input value={tour.meta_title} onChange={(e) => updateField("meta_title", e.target.value)} placeholder="Enter title" /></div>
              <div className="space-y-2"><Label>Meta Keyword</Label><Input value={tour.meta_keyword} onChange={(e) => updateField("meta_keyword", e.target.value)} placeholder="Enter keywords" /></div>
              <div className="space-y-2"><Label>Meta Description</Label><Textarea value={tour.meta_description} onChange={(e) => updateField("meta_description", e.target.value)} placeholder="Enter description" rows={4} /></div>
              <div className="space-y-2"><Label>Meta Tag</Label><Input value={tour.meta_tag} onChange={(e) => updateField("meta_tag", e.target.value)} placeholder="Enter tag" /></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TourForm;
