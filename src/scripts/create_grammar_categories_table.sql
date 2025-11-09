-- Create grammar_categories table
CREATE TABLE IF NOT EXISTS public.grammar_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text DEFAULT '📚',
  color text DEFAULT '#3b82f6',
  order_index integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT grammar_categories_pkey PRIMARY KEY (id)
);

-- Add index for slug lookups
CREATE INDEX IF NOT EXISTS idx_grammar_categories_slug ON public.grammar_categories(slug);
CREATE INDEX IF NOT EXISTS idx_grammar_categories_order ON public.grammar_categories(order_index);
CREATE INDEX IF NOT EXISTS idx_grammar_categories_active ON public.grammar_categories(is_active);

-- Modify grammar_topics table to use category_id instead of category text
ALTER TABLE public.grammar_topics 
  DROP CONSTRAINT IF EXISTS grammar_topics_category_check,
  ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.grammar_categories(id) ON DELETE CASCADE;

-- Create index for category_id
CREATE INDEX IF NOT EXISTS idx_grammar_topics_category_id ON public.grammar_topics(category_id);

-- Enable RLS
ALTER TABLE public.grammar_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for grammar_categories
CREATE POLICY "Anyone can view active grammar categories"
  ON public.grammar_categories
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Only authenticated users can view all grammar categories"
  ON public.grammar_categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only authenticated users can insert grammar categories"
  ON public.grammar_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update grammar categories"
  ON public.grammar_categories
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Only authenticated users can delete grammar categories"
  ON public.grammar_categories
  FOR DELETE
  TO authenticated
  USING (true);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_grammar_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER grammar_categories_updated_at
  BEFORE UPDATE ON public.grammar_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_grammar_categories_updated_at();
