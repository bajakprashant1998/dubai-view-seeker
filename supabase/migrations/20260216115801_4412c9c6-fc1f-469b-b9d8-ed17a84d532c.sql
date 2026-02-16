
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Tours table with all fields from reference
CREATE TABLE public.tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  overview TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured BOOLEAN DEFAULT false,
  category TEXT,
  
  -- Media
  feature_image TEXT,
  banner_image TEXT,
  gallery TEXT[] DEFAULT '{}',
  youtube_link TEXT,
  
  -- Duration & Times
  duration TEXT,
  duration_unit TEXT DEFAULT 'hours',
  pickup_time TEXT,
  dropback_time TEXT,
  
  -- Pricing
  adult_price NUMERIC(10,2) DEFAULT 0,
  adult_sale_price NUMERIC(10,2),
  child_price NUMERIC(10,2) DEFAULT 0,
  child_sale_price NUMERIC(10,2),
  infant_price NUMERIC(10,2) DEFAULT 0,
  private_transfer_price NUMERIC(10,2),
  sharing_transfer_price NUMERIC(10,2),
  pricing_type TEXT DEFAULT 'normal',
  
  -- Quantity
  min_quantity INT DEFAULT 1,
  max_quantity INT DEFAULT 20,
  min_people INT,
  max_people INT,
  
  -- Service fee
  service_fee_enabled BOOLEAN DEFAULT false,
  service_fee NUMERIC(10,2),
  extra_fee_enabled BOOLEAN DEFAULT false,
  extra_fee NUMERIC(10,2),
  
  -- Information sections (JSONB for flexible content)
  inclusions JSONB DEFAULT '[]',
  why_go JSONB DEFAULT '[]',
  advantage JSONB DEFAULT '[]',
  important_info JSONB DEFAULT '[]',
  additional_info JSONB DEFAULT '[]',
  operating_hours JSONB DEFAULT '[]',
  
  -- Policies
  booking_policy TEXT,
  cancellation_policy TEXT,
  child_policy TEXT,
  
  -- Activity timing & location
  activity_timing_location JSONB DEFAULT '[]',
  
  -- FAQs
  faqs_enabled BOOLEAN DEFAULT false,
  faqs JSONB DEFAULT '[]',
  
  -- Age config
  adult_age_label TEXT DEFAULT 'Adult',
  child_age_label TEXT DEFAULT 'Child',
  infant_age_label TEXT DEFAULT 'Infant',
  
  -- SEO
  meta_title TEXT,
  meta_keyword TEXT,
  meta_description TEXT,
  meta_tag TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;

-- Public can read published tours
CREATE POLICY "Anyone can view published tours" ON public.tours FOR SELECT USING (status = 'published');
-- Admins can do everything
CREATE POLICY "Admins can manage tours" ON public.tours FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_tours_updated_at BEFORE UPDATE ON public.tours FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
