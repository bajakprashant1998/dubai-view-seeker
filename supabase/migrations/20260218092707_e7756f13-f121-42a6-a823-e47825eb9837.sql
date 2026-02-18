
-- Create combo_deals table
CREATE TABLE public.combo_deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tour_ids UUID[] NOT NULL DEFAULT '{}',
  total_original_price NUMERIC NOT NULL DEFAULT 0,
  combo_price NUMERIC NOT NULL DEFAULT 0,
  savings NUMERIC NOT NULL DEFAULT 0,
  savings_percent INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  duration TEXT,
  highlights TEXT[] DEFAULT '{}',
  best_for TEXT[] DEFAULT '{}',
  valid_until DATE,
  popular BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft',
  slug TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.combo_deals ENABLE ROW LEVEL SECURITY;

-- Public can view published combo deals
CREATE POLICY "Anyone can view published combo deals"
  ON public.combo_deals
  FOR SELECT
  USING (status = 'published');

-- Admins can manage combo deals
CREATE POLICY "Admins can manage combo deals"
  ON public.combo_deals
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_combo_deals_updated_at
  BEFORE UPDATE ON public.combo_deals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
