import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ComboDeal, comboDeals as staticComboDeals, getActivityById } from "@/data/activities";
import { useMergedActivities } from "@/hooks/use-tours";
import type { DbActivity } from "@/hooks/use-tours";

interface DbComboDeal {
  id: string;
  title: string;
  description: string | null;
  tour_ids: string[];
  total_original_price: number;
  combo_price: number;
  savings: number;
  savings_percent: number;
  image: string | null;
  duration: string | null;
  highlights: string[];
  best_for: string[];
  valid_until: string | null;
  popular: boolean | null;
  status: string;
  slug: string | null;
  created_at: string;
  updated_at: string;
}

function mapDbComboToComboDeal(row: DbComboDeal): ComboDeal {
  return {
    id: row.slug || row.id,
    title: row.title,
    description: row.description || "",
    activities: row.tour_ids, // These are UUIDs referencing tours
    totalOriginalPrice: Number(row.total_original_price),
    comboPrice: Number(row.combo_price),
    savings: Number(row.savings),
    savingsPercent: row.savings_percent,
    image: row.image || "/placeholder.svg",
    duration: row.duration || "",
    highlights: row.highlights || [],
    bestFor: row.best_for || [],
    validUntil: row.valid_until || "",
    popular: row.popular ?? false,
  };
}

export function useComboDeals() {
  return useQuery({
    queryKey: ["combo-deals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("combo_deals")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as unknown as DbComboDeal[];
    },
  });
}

export function useComboDeal(idOrSlug: string) {
  return useQuery({
    queryKey: ["combo-deal", idOrSlug],
    queryFn: async () => {
      let { data, error } = await supabase
        .from("combo_deals")
        .select("*")
        .eq("slug", idOrSlug)
        .eq("status", "published")
        .maybeSingle();

      if (!data && !error) {
        ({ data, error } = await supabase
          .from("combo_deals")
          .select("*")
          .eq("id", idOrSlug)
          .eq("status", "published")
          .maybeSingle());
      }

      if (error) throw error;
      return data as unknown as DbComboDeal | null;
    },
    enabled: !!idOrSlug,
  });
}

export function useMergedComboDeals(): { comboDeals: ComboDeal[]; isLoading: boolean } {
  const { data: dbCombos, isLoading } = useComboDeals();

  if (dbCombos && dbCombos.length > 0) {
    return { comboDeals: dbCombos.map(mapDbComboToComboDeal), isLoading };
  }

  return { comboDeals: staticComboDeals, isLoading };
}

/**
 * For a DB combo deal, its `activities` array contains tour UUIDs/slugs.
 * We resolve them against the merged activities list.
 */
export function useComboActivities(combo: ComboDeal | undefined, allActivities: DbActivity[]) {
  if (!combo) return [];

  // Try matching by id (could be UUID or slug)
  return combo.activities
    .map((actId) => {
      // Match against DB activities by id or slug, or static activities
      return (
        allActivities.find((a) => a.id === actId || a._dbTour?.id === actId || a._dbTour?.slug === actId) ||
        getActivityById(actId)
      );
    })
    .filter(Boolean) as DbActivity[];
}
