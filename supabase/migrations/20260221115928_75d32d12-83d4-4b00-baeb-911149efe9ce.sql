
-- Hotel Information
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS hotel_info jsonb DEFAULT '{}';

-- Hourly Rentals (jet ski, yacht, ATV etc with multiple duration/price tiers)
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS hourly_rentals jsonb DEFAULT '[]';

-- Transfer Options (private, shared, hotel pickup, airport etc)
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS transfer_options jsonb DEFAULT '[]';

-- Add-ons / Extras (photography, meals, VIP upgrade etc)
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS addons jsonb DEFAULT '[]';

-- Itinerary (step-by-step timeline)
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS itinerary jsonb DEFAULT '[]';

-- Safety & Requirements
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS safety_requirements jsonb DEFAULT '{}';

-- Seasonal Pricing (different prices for peak/off-peak)
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS seasonal_pricing jsonb DEFAULT '[]';

-- Capacity Management
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS capacity jsonb DEFAULT '{}';
