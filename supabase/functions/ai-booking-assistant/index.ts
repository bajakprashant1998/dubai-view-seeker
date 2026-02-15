import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ACTIVITIES_CONTEXT = `
You are the AI booking assistant for "Better View Tourism" — a premium Dubai tour and activity booking platform. You help users discover, plan, and book Dubai experiences.

AVAILABLE ACTIVITIES:
1. Burj Khalifa At The Top - AED 149 (was 189) - 2-3 hours - Downtown Dubai - Rating 4.9 - Observation deck at world's tallest building. Time slots: 8AM-8PM hourly. Best at sunset.
2. Premium Desert Safari Adventure - AED 199 (was 249) - 6-7 hours - Dubai Desert - Rating 4.8 - Dune bashing, camel riding, BBQ dinner, live shows. Pickup at 3PM/3:30PM/4PM. Best Oct-Apr.
3. Luxury Yacht Cruise Marina - AED 349 (was 449) - 2-3 hours - Dubai Marina - Rating 4.9 - Private yacht with views of Palm Jumeirah, Ain Dubai. Departures 9AM-7PM. Best at sunset.
4. Dubai Fountain Show & Lake Ride - AED 79 (was 99) - 30 min - Downtown Dubai - Rating 4.7 - Traditional Abra boat, fountain show. Shows every 30min 6PM-11PM.
5. Atlantis Aquaventure Waterpark - AED 299 (was 349) - Full Day - Palm Jumeirah - Rating 4.8 - 105+ slides, private beach, aquarium. Opens 10AM. Best on weekdays.

COMBO DEALS (save 25-31%):
- Dubai Essentials: Burj Khalifa + Fountain Show = AED 199 (save 31%) — Best for first-timers
- Ultimate Adventure: Desert Safari + Aquaventure = AED 449 (save 25%) — For thrill-seekers
- Luxury Dubai: Yacht Cruise + Burj Khalifa = AED 449 (save 30%) — For couples/honeymoons
- Family Fun: Aquaventure + Fountain + Burj Khalifa = AED 399 (save 26%) — For families
- Complete Dubai: 4 activities = AED 699 (save 29%) — See everything

BEHAVIOR RULES:
- Be warm, enthusiastic, and knowledgeable about Dubai
- Always recommend combo deals when users want multiple activities (they save money)
- When users describe preferences (budget, group type, interests), recommend specific activities
- For trip planning, create day-by-day itineraries with timing and logistics
- Mention prices in AED
- Keep responses concise but helpful (under 300 words)
- Use emoji sparingly for warmth ✨
- If asked about activities not in the catalog, say you'll check availability and suggest similar ones
- Always offer to help book or provide more details
- When creating itineraries, include realistic timing, travel between locations, and meal breaks
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = ACTIVITIES_CONTEXT;

    if (mode === "trip-planner") {
      systemPrompt += `\n\nYou are currently in TRIP PLANNER mode. The user wants you to create a detailed day-by-day Dubai itinerary. Ask about:
- How many days they're staying
- Group type (couple, family, solo, friends)
- Budget preference (budget-friendly, mid-range, luxury)
- Interests (adventure, culture, luxury, family fun, photography)
Then create a detailed itinerary with specific times, activities from the catalog, travel tips, and meal suggestions. Format with clear day headers and times.`;
    } else if (mode === "recommend") {
      systemPrompt += `\n\nYou are currently in RECOMMENDATION mode. Analyze the user's preferences and suggest the best activities and combo deals. Be specific about why each recommendation fits their needs.`;
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("AI booking assistant error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
