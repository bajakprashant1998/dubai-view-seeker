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

interface ListItem {
  title: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface TimingItem {
  heading: string;
  description: string;
}

const defaultTour = {
  title: "",
  slug: "",
  overview: "",
  status: "draft",
  featured: false,
  category: "",
  feature_image: "",
  banner_image: "",
  youtube_link: "",
  duration: "",
  duration_unit: "hours",
  pickup_time: "",
  dropback_time: "",
  adult_price: 0,
  adult_sale_price: null as number | null,
  child_price: 0,
  child_sale_price: null as number | null,
  infant_price: 0,
  private_transfer_price: null as number | null,
  sharing_transfer_price: null as number | null,
  pricing_type: "normal",
  min_quantity: 1,
  max_quantity: 20,
  min_people: null as number | null,
  max_people: null as number | null,
  service_fee_enabled: false,
  service_fee: null as number | null,
  extra_fee_enabled: false,
  extra_fee: null as number | null,
  booking_policy: "",
  cancellation_policy: "",
  child_policy: "",
  faqs_enabled: false,
  adult_age_label: "Adult",
  child_age_label: "Child",
  infant_age_label: "Infant",
  meta_title: "",
  meta_keyword: "",
  meta_description: "",
  meta_tag: "",
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      supabase.from("tours").select("*").eq("id", id).single().then(({ data, error }) => {
        if (error || !data) { toast.error("Tour not found"); navigate("/admin/tours"); return; }
        setTour({
          title: data.title || "",
          slug: data.slug || "",
          overview: data.overview || "",
          status: data.status,
          featured: data.featured || false,
          category: data.category || "",
          feature_image: data.feature_image || "",
          banner_image: data.banner_image || "",
          youtube_link: data.youtube_link || "",
          duration: data.duration || "",
          duration_unit: data.duration_unit || "hours",
          pickup_time: data.pickup_time || "",
          dropback_time: data.dropback_time || "",
          adult_price: Number(data.adult_price) || 0,
          adult_sale_price: data.adult_sale_price ? Number(data.adult_sale_price) : null,
          child_price: Number(data.child_price) || 0,
          child_sale_price: data.child_sale_price ? Number(data.child_sale_price) : null,
          infant_price: Number(data.infant_price) || 0,
          private_transfer_price: data.private_transfer_price ? Number(data.private_transfer_price) : null,
          sharing_transfer_price: data.sharing_transfer_price ? Number(data.sharing_transfer_price) : null,
          pricing_type: data.pricing_type || "normal",
          min_quantity: data.min_quantity || 1,
          max_quantity: data.max_quantity || 20,
          min_people: data.min_people,
          max_people: data.max_people,
          service_fee_enabled: data.service_fee_enabled || false,
          service_fee: data.service_fee ? Number(data.service_fee) : null,
          extra_fee_enabled: data.extra_fee_enabled || false,
          extra_fee: data.extra_fee ? Number(data.extra_fee) : null,
          booking_policy: data.booking_policy || "",
          cancellation_policy: data.cancellation_policy || "",
          child_policy: data.child_policy || "",
          faqs_enabled: data.faqs_enabled || false,
          adult_age_label: data.adult_age_label || "Adult",
          child_age_label: data.child_age_label || "Child",
          infant_age_label: data.infant_age_label || "Infant",
          meta_title: data.meta_title || "",
          meta_keyword: data.meta_keyword || "",
          meta_description: data.meta_description || "",
          meta_tag: data.meta_tag || "",
        });
        setInclusions((data.inclusions as unknown as ListItem[]) || []);
        setWhyGo((data.why_go as unknown as ListItem[]) || []);
        setAdvantage((data.advantage as unknown as ListItem[]) || []);
        setImportantInfo((data.important_info as unknown as ListItem[]) || []);
        setAdditionalInfo((data.additional_info as unknown as ListItem[]) || []);
        setOperatingHours((data.operating_hours as unknown as ListItem[]) || []);
        setFaqs((data.faqs as unknown as FaqItem[]) || []);
        setTimingLocation((data.activity_timing_location as unknown as TimingItem[]) || []);
      });
    }
  }, [id, isEdit, navigate]);

  const updateField = (field: string, value: any) => setTour(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!tour.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);

    const slug = tour.slug || tour.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const payload = {
      ...tour,
      slug,
      adult_price: tour.adult_price || 0,
      child_price: tour.child_price || 0,
      infant_price: tour.infant_price || 0,
      inclusions: inclusions as any,
      why_go: whyGo as any,
      advantage: advantage as any,
      important_info: importantInfo as any,
      additional_info: additionalInfo as any,
      operating_hours: operatingHours as any,
      faqs: faqs as any,
      activity_timing_location: timingLocation as any,
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
          <TabsTrigger value="settings">Tour Settings</TabsTrigger>
          <TabsTrigger value="information">Information</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
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
              <div className="space-y-2">
                <Label>Feature Image URL</Label>
                <Input value={tour.feature_image} onChange={(e) => updateField("feature_image", e.target.value)} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Banner Image URL</Label>
                <Input value={tour.banner_image} onChange={(e) => updateField("banner_image", e.target.value)} placeholder="https://..." />
              </div>
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
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Adult Price (AED)</Label>
                  <Input type="number" value={tour.adult_price} onChange={(e) => updateField("adult_price", Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Adult Sale Price</Label>
                  <Input type="number" value={tour.adult_sale_price ?? ""} onChange={(e) => updateField("adult_sale_price", e.target.value ? Number(e.target.value) : null)} />
                </div>
                <div className="space-y-2">
                  <Label>Child Price (AED)</Label>
                  <Input type="number" value={tour.child_price} onChange={(e) => updateField("child_price", Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Child Sale Price</Label>
                  <Input type="number" value={tour.child_sale_price ?? ""} onChange={(e) => updateField("child_sale_price", e.target.value ? Number(e.target.value) : null)} />
                </div>
                <div className="space-y-2">
                  <Label>Infant Price (AED)</Label>
                  <Input type="number" value={tour.infant_price} onChange={(e) => updateField("infant_price", Number(e.target.value))} />
                </div>
              </div>
              <Separator />
              <h4 className="font-medium">Transfer Pricing</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Private Transfer Price</Label>
                  <Input type="number" value={tour.private_transfer_price ?? ""} onChange={(e) => updateField("private_transfer_price", e.target.value ? Number(e.target.value) : null)} />
                </div>
                <div className="space-y-2">
                  <Label>Sharing Transfer Price</Label>
                  <Input type="number" value={tour.sharing_transfer_price ?? ""} onChange={(e) => updateField("sharing_transfer_price", e.target.value ? Number(e.target.value) : null)} />
                </div>
              </div>
              <Separator />
              <h4 className="font-medium">Fees</h4>
              <div className="flex items-center gap-3 mb-2">
                <Switch checked={tour.service_fee_enabled} onCheckedChange={(v) => updateField("service_fee_enabled", v)} />
                <Label>Enable Service Fee</Label>
              </div>
              {tour.service_fee_enabled && (
                <Input type="number" value={tour.service_fee ?? ""} onChange={(e) => updateField("service_fee", e.target.value ? Number(e.target.value) : null)} placeholder="Service fee amount" />
              )}
              <div className="flex items-center gap-3 mb-2">
                <Switch checked={tour.extra_fee_enabled} onCheckedChange={(v) => updateField("extra_fee_enabled", v)} />
                <Label>Enable Extra Fee</Label>
              </div>
              {tour.extra_fee_enabled && (
                <Input type="number" value={tour.extra_fee ?? ""} onChange={(e) => updateField("extra_fee", e.target.value ? Number(e.target.value) : null)} placeholder="Extra fee amount" />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Quantity</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Min Qty</Label>
                  <Input type="number" value={tour.min_quantity} onChange={(e) => updateField("min_quantity", Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Max Qty</Label>
                  <Input type="number" value={tour.max_quantity} onChange={(e) => updateField("max_quantity", Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Min People</Label>
                  <Input type="number" value={tour.min_people ?? ""} onChange={(e) => updateField("min_people", e.target.value ? Number(e.target.value) : null)} />
                </div>
                <div className="space-y-2">
                  <Label>Max People</Label>
                  <Input type="number" value={tour.max_people ?? ""} onChange={(e) => updateField("max_people", e.target.value ? Number(e.target.value) : null)} />
                </div>
              </div>
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
                <div className="space-y-2">
                  <Label>Pickup Time</Label>
                  <Input value={tour.pickup_time} onChange={(e) => updateField("pickup_time", e.target.value)} placeholder="e.g. 9:00 AM" />
                </div>
                <div className="space-y-2">
                  <Label>Dropback Time</Label>
                  <Input value={tour.dropback_time} onChange={(e) => updateField("dropback_time", e.target.value)} placeholder="e.g. 5:00 PM" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Age Configuration</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Adult Age Label</Label>
                  <Input value={tour.adult_age_label} onChange={(e) => updateField("adult_age_label", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Child Age Label</Label>
                  <Input value={tour.child_age_label} onChange={(e) => updateField("child_age_label", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Infant Age Label</Label>
                  <Input value={tour.infant_age_label} onChange={(e) => updateField("infant_age_label", e.target.value)} />
                </div>
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

        {/* Information Tab */}
        <TabsContent value="information" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <ListEditor items={inclusions} setItems={setInclusions} label="Inclusions" />
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
              <div className="space-y-2">
                <Label>Booking Policy</Label>
                <Textarea value={tour.booking_policy} onChange={(e) => updateField("booking_policy", e.target.value)} rows={4} />
              </div>
              <div className="space-y-2">
                <Label>Cancellation Policy</Label>
                <Textarea value={tour.cancellation_policy} onChange={(e) => updateField("cancellation_policy", e.target.value)} rows={4} />
              </div>
              <div className="space-y-2">
                <Label>Child Policy</Label>
                <Textarea value={tour.child_policy} onChange={(e) => updateField("child_policy", e.target.value)} rows={4} />
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
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input value={tour.meta_title} onChange={(e) => updateField("meta_title", e.target.value)} placeholder="Enter title" />
              </div>
              <div className="space-y-2">
                <Label>Meta Keyword</Label>
                <Input value={tour.meta_keyword} onChange={(e) => updateField("meta_keyword", e.target.value)} placeholder="Enter keywords" />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea value={tour.meta_description} onChange={(e) => updateField("meta_description", e.target.value)} placeholder="Enter description" rows={4} />
              </div>
              <div className="space-y-2">
                <Label>Meta Tag</Label>
                <Input value={tour.meta_tag} onChange={(e) => updateField("meta_tag", e.target.value)} placeholder="Enter tag" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TourForm;
