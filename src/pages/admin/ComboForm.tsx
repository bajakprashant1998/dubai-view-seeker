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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface TourOption {
  id: string;
  title: string;
  adult_price: number;
}

const defaultCombo = {
  title: "",
  slug: "",
  description: "",
  status: "draft",
  popular: false,
  image: "",
  duration: "",
  total_original_price: 0,
  combo_price: 0,
  savings: 0,
  savings_percent: 0,
  valid_until: "",
};

const ComboForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [combo, setCombo] = useState(defaultCombo);
  const [selectedTourIds, setSelectedTourIds] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [bestFor, setBestFor] = useState<string[]>([]);
  const [availableTours, setAvailableTours] = useState<TourOption[]>([]);
  const [saving, setSaving] = useState(false);

  // Load available tours
  useEffect(() => {
    supabase
      .from("tours")
      .select("id, title, adult_price")
      .order("title")
      .then(({ data }) => {
        setAvailableTours((data as TourOption[]) || []);
      });
  }, []);

  // Load existing combo for edit
  useEffect(() => {
    if (!isEdit) return;
    supabase
      .from("combo_deals")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          toast.error("Combo not found");
          navigate("/admin/combos");
          return;
        }
        const d = data as any;
        setCombo({
          title: d.title || "",
          slug: d.slug || "",
          description: d.description || "",
          status: d.status,
          popular: d.popular || false,
          image: d.image || "",
          duration: d.duration || "",
          total_original_price: Number(d.total_original_price) || 0,
          combo_price: Number(d.combo_price) || 0,
          savings: Number(d.savings) || 0,
          savings_percent: Number(d.savings_percent) || 0,
          valid_until: d.valid_until || "",
        });
        setSelectedTourIds(d.tour_ids || []);
        setHighlights(d.highlights || []);
        setBestFor(d.best_for || []);
      });
  }, [id, isEdit, navigate]);

  const updateField = (field: string, value: any) =>
    setCombo((prev) => ({ ...prev, [field]: value }));

  // Auto-calculate savings when prices change
  const recalc = (original: number, price: number) => {
    const savings = Math.max(0, original - price);
    const percent = original > 0 ? Math.round((savings / original) * 100) : 0;
    setCombo((prev) => ({ ...prev, savings, savings_percent: percent }));
  };

  const toggleTour = (tourId: string) => {
    setSelectedTourIds((prev) =>
      prev.includes(tourId) ? prev.filter((t) => t !== tourId) : [...prev, tourId]
    );
  };

  const handleSave = async () => {
    if (!combo.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (selectedTourIds.length < 2) {
      toast.error("Select at least 2 tours");
      return;
    }
    setSaving(true);

    const slug =
      combo.slug ||
      combo.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const payload = {
      title: combo.title,
      slug,
      description: combo.description,
      status: combo.status,
      popular: combo.popular,
      image: combo.image,
      duration: combo.duration,
      total_original_price: combo.total_original_price,
      combo_price: combo.combo_price,
      savings: combo.savings,
      savings_percent: combo.savings_percent,
      valid_until: combo.valid_until || null,
      tour_ids: selectedTourIds,
      highlights,
      best_for: bestFor,
    };

    let error;
    if (isEdit) {
      ({ error } = await supabase.from("combo_deals").update(payload).eq("id", id));
    } else {
      ({ error } = await supabase.from("combo_deals").insert(payload));
    }

    if (error) {
      toast.error(error.message);
      setSaving(false);
      return;
    }
    toast.success(isEdit ? "Combo updated!" : "Combo created!");
    navigate("/admin/combos");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/combos")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-2xl font-bold">{isEdit ? "Edit Combo Deal" : "Create Combo Deal"}</h2>
        <div className="ml-auto flex gap-2">
          <Select value={combo.status} onValueChange={(v) => updateField("status", v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={combo.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g. Dubai Essentials Combo"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={combo.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                placeholder="auto-generated-from-title"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={combo.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Combo deal description..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input
                value={combo.duration}
                onChange={(e) => updateField("duration", e.target.value)}
                placeholder="e.g. 2 Days"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={combo.popular} onCheckedChange={(v) => updateField("popular", v)} />
              <Label>Mark as Popular</Label>
            </div>
          </CardContent>
        </Card>

        {/* Image */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cover Image</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              label="Combo Image"
              value={combo.image}
              onChange={(url) => updateField("image", url)}
              folder="combos"
            />
          </CardContent>
        </Card>

        {/* Select Tours */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Included Tours ({selectedTourIds.length} selected)</CardTitle>
          </CardHeader>
          <CardContent>
            {availableTours.length === 0 ? (
              <p className="text-muted-foreground text-sm">No tours available. Create some tours first.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableTours.map((tour) => (
                  <label
                    key={tour.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={selectedTourIds.includes(tour.id)}
                      onCheckedChange={() => toggleTour(tour.id)}
                    />
                    <span className="flex-1 text-sm font-medium">{tour.title}</span>
                    <span className="text-sm text-muted-foreground">
                      AED {Number(tour.adult_price).toFixed(0)}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Original Price (AED)</Label>
                <Input
                  type="number"
                  value={combo.total_original_price}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    updateField("total_original_price", v);
                    recalc(v, combo.combo_price);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Combo Price (AED)</Label>
                <Input
                  type="number"
                  value={combo.combo_price}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    updateField("combo_price", v);
                    recalc(combo.total_original_price, v);
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Savings (AED)</Label>
                <Input type="number" value={combo.savings} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Savings %</Label>
                <Input type="number" value={combo.savings_percent} readOnly className="bg-muted" />
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Valid Until</Label>
              <Input
                type="date"
                value={combo.valid_until}
                onChange={(e) => updateField("valid_until", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Highlights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Highlights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {highlights.map((h, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={h}
                  onChange={(e) => {
                    const n = [...highlights];
                    n[i] = e.target.value;
                    setHighlights(n);
                  }}
                  placeholder="e.g. World's tallest building observation deck"
                />
                <Button variant="ghost" size="icon" onClick={() => setHighlights(highlights.filter((_, j) => j !== i))}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setHighlights([...highlights, ""])}>
              <Plus className="w-4 h-4 mr-1" /> Add Highlight
            </Button>
          </CardContent>
        </Card>

        {/* Best For */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Best For</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {bestFor.map((b, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={b}
                  onChange={(e) => {
                    const n = [...bestFor];
                    n[i] = e.target.value;
                    setBestFor(n);
                  }}
                  placeholder="e.g. Families with kids"
                />
                <Button variant="ghost" size="icon" onClick={() => setBestFor(bestFor.filter((_, j) => j !== i))}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setBestFor([...bestFor, ""])}>
              <Plus className="w-4 h-4 mr-1" /> Add Tag
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComboForm;
