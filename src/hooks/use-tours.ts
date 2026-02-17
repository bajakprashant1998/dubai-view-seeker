import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Activity, activities as staticActivities } from "@/data/activities";

type Tour = Tables<"tours">;

export interface DbActivity extends Activity {
  _dbTour?: Tour;
}

export function mapTourToActivity(tour: Tour): DbActivity {
  const inclusions = Array.isArray(tour.inclusions)
    ? (tour.inclusions as { text: string }[]).map((i) => (typeof i === "string" ? i : i.text || ""))
    : [];

  const price = tour.adult_sale_price ?? tour.adult_price ?? 0;
  const originalPrice = tour.adult_sale_price ? (tour.adult_price ?? undefined) : undefined;

  return {
    id: tour.slug || tour.id,
    title: tour.title,
    description: tour.overview || "",
    shortDescription: tour.overview ? tour.overview.substring(0, 120) + "…" : "",
    image: tour.feature_image || "/placeholder.svg",
    price,
    originalPrice,
    rating: 4.8,
    reviewCount: 0,
    duration: tour.duration ? `${tour.duration} ${tour.duration_unit || "hours"}` : "Flexible",
    location: tour.category || "Dubai",
    category: tour.category || "Attractions",
    tags: tour.meta_keyword ? tour.meta_keyword.split(",").map((t) => t.trim()).slice(0, 3) : [],
    openingHours: "Daily",
    instantConfirmation: true,
    bestTime: "",
    whatToExpect: Array.isArray(tour.why_go)
      ? (tour.why_go as { text: string }[]).map((i) => (typeof i === "string" ? i : i.text || ""))
      : [],
    inclusions,
    exclusions: [],
    dressCode: "",
    ageRequirements: tour.child_policy || "",
    cancellationPolicy: tour.cancellation_policy || "Free cancellation up to 24 hours before",
    timeSlots: tour.pickup_time ? [tour.pickup_time] : [],
    // Extra DB fields for detail page
    _dbTour: tour,
  };
}

export function useTours() {
  return useQuery({
    queryKey: ["tours"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tours")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useTour(idOrSlug: string) {
  return useQuery({
    queryKey: ["tour", idOrSlug],
    queryFn: async () => {
      // Try slug first, then id
      let { data, error } = await supabase
        .from("tours")
        .select("*")
        .eq("slug", idOrSlug)
        .eq("status", "published")
        .maybeSingle();

      if (!data && !error) {
        ({ data, error } = await supabase
          .from("tours")
          .select("*")
          .eq("id", idOrSlug)
          .eq("status", "published")
          .maybeSingle());
      }

      if (error) throw error;
      return data;
    },
    enabled: !!idOrSlug,
  });
}

export function useMergedActivities(): { activities: DbActivity[]; isLoading: boolean } {
  const { data: dbTours, isLoading } = useTours();

  if (dbTours && dbTours.length > 0) {
    return { activities: dbTours.map(mapTourToActivity), isLoading };
  }

  // Fallback to static data when no DB tours exist
  return { activities: staticActivities, isLoading };
}

export function useFeaturedTours() {
  return useQuery({
    queryKey: ["tours", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tours")
        .select("*")
        .eq("status", "published")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) throw error;
      return data;
    },
  });
}
