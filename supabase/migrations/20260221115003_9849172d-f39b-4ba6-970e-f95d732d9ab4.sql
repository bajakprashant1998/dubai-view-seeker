
-- Add new tour fields for comprehensive tour management
ALTER TABLE public.tours
  ADD COLUMN IF NOT EXISTS exclusions jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS meeting_point text,
  ADD COLUMN IF NOT EXISTS map_link text,
  ADD COLUMN IF NOT EXISTS languages text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS guide_type text DEFAULT 'live',
  ADD COLUMN IF NOT EXISTS tour_type text DEFAULT 'group',
  ADD COLUMN IF NOT EXISTS difficulty_level text DEFAULT 'easy',
  ADD COLUMN IF NOT EXISTS accessibility_info text,
  ADD COLUMN IF NOT EXISTS what_to_bring jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS dress_code text,
  ADD COLUMN IF NOT EXISTS available_days text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS seasonal_availability text,
  ADD COLUMN IF NOT EXISTS blackout_dates text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS confirmation_type text DEFAULT 'instant',
  ADD COLUMN IF NOT EXISTS voucher_type text DEFAULT 'mobile',
  ADD COLUMN IF NOT EXISTS min_age integer,
  ADD COLUMN IF NOT EXISTS wheelchair_accessible boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS max_group_size integer;
