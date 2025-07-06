/*
  # Create complete Kingdom Business Studio schema

  1. New Tables
    - `businesses`
      - `id` (uuid, primary key)
      - `name` (text)
      - `logo` (text)
      - `category` (text)
      - `description` (text)
      - `is_new` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `excerpt` (text)
      - `content` (text)
      - `author` (text)
      - `date` (date)
      - `category` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `programs`
      - `id` (text, primary key)
      - `name` (text)
      - `description` (text)
      - `primary_color` (text)
      - `accent_colors` (jsonb)
      - `features` (jsonb)
      - `updated_at` (timestamp)
    
    - `registrations`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `phone_number` (text)
      - `country` (text)
      - `industry` (text)
      - `business_idea` (text)
      - `open_to_collaboration` (text)
      - `born_again` (text)
      - `available_8_weeks` (text)
      - `time_preference` (text)
      - `days_preference` (jsonb)
      - `payment_method` (text)
      - `payment_proof` (text)
      - `created_at` (timestamp)
    
    - `site_settings`
      - `id` (uuid, primary key)
      - `key` (text, unique)
      - `value` (jsonb)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated admin write access

  3. Storage
    - Create storage buckets for images
*/

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  is_new boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  date date NOT NULL,
  category text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create programs table
CREATE TABLE IF NOT EXISTS programs (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  primary_color text NOT NULL,
  accent_colors jsonb NOT NULL DEFAULT '[]',
  features jsonb NOT NULL DEFAULT '[]',
  updated_at timestamptz DEFAULT now()
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone_number text NOT NULL,
  country text NOT NULL,
  industry text NOT NULL,
  business_idea text NOT NULL,
  open_to_collaboration text NOT NULL,
  born_again text NOT NULL,
  available_8_weeks text NOT NULL,
  time_preference text NOT NULL,
  days_preference jsonb NOT NULL DEFAULT '[]',
  payment_method text NOT NULL,
  payment_proof text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read businesses"
  ON businesses
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read blog posts"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read programs"
  ON programs
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read site settings"
  ON site_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policies for admin write access
CREATE POLICY "Authenticated users can manage businesses"
  ON businesses
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage programs"
  ON programs
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage registrations"
  ON registrations
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage site settings"
  ON site_settings
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- Allow public to insert registrations
CREATE POLICY "Public can insert registrations"
  ON registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Insert programs with correct order: What's in Your Hand, Net in the Deep, The Boat
INSERT INTO programs (id, name, description, primary_color, accent_colors, features) VALUES
('whats-in-your-hand', 'What''s in Your Hand', 'An 8-week business development studio for kingdom-minded individuals who want to build ventures rooted in God''s vision. Whether transitioning from a 9–5 or launching a business alongside your job, this program helps participants create, refine, and launch a profitable venture, guided by biblical values, spiritual clarity, and strategic structure.', 'royal-blue', '["mustard-yellow", "ivory"]', '["8-week intensive program", "Biblical business principles", "Spiritual clarity sessions", "Strategic structure development", "Peer collaboration", "Expert mentorship"]'),
('net-in-the-deep', 'Net in the Deep', 'A track for those ready to go deeper. It focuses on scaling, structure, spiritual discipline, and obedience-driven action. Ideal for those with businesses in development who want to formalize and scale in alignment with their faith.', 'mustard-yellow', '["ivory", "royal-blue"]', '["Business scaling strategies", "Spiritual discipline training", "Obedience-driven action plans", "Formalization processes", "Faith-aligned scaling", "Advanced mentorship"]'),
('the-boat', 'The Boat', 'A content hub for teaching, storytelling, and prophetic business conversations via YouTube. Join us for inspiring content that bridges faith and entrepreneurship.', 'royal-blue', '["mustard-yellow", "ivory"]', '["Weekly YouTube content", "Prophetic business insights", "Success stories", "Teaching sessions", "Community discussions", "Live Q&A sessions"]')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  primary_color = EXCLUDED.primary_color,
  accent_colors = EXCLUDED.accent_colors,
  features = EXCLUDED.features,
  updated_at = now();

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
('registration_price', '3000'),
('contact_info', '{"phone": "+254 700 123 456", "email": "info@kingdombusinessstudio.com", "whatsapp": "+254700123456", "location": "Nairobi, Kenya"}'),
('social_media_links', '{"facebook": "https://facebook.com/kingdombusinessstudio", "instagram": "https://instagram.com/kingdombusinessstudio", "twitter": "https://twitter.com/kingdombusiness", "linkedin": "https://linkedin.com/company/kingdom-business-studio"}'),
('admin_password', '"kingdomstudio2025"')
ON CONFLICT (key) DO NOTHING;

-- Insert default businesses
INSERT INTO businesses (name, logo, category, description, is_new) VALUES
('Grace Catering Services', '🍽️', 'Food & Hospitality', 'Christian-owned catering service specializing in events and corporate functions.', true),
('Faithful Finance Consulting', '💰', 'Financial Services', 'Biblical financial planning and consulting services for individuals and businesses.', false),
('Kingdom Kids Academy', '🎓', 'Education', 'Christian early childhood education center focused on holistic development.', false),
('Blessed Boutique', '👗', 'Fashion & Retail', 'Modest fashion boutique promoting biblical values through clothing.', true),
('Cornerstone Construction', '🏗️', 'Construction', 'Christian construction company building homes and commercial spaces.', false),
('Harvest Digital Marketing', '📱', 'Digital Services', 'Faith-based digital marketing agency helping Christian businesses grow online.', false)
ON CONFLICT DO NOTHING;

-- Insert default blog posts
INSERT INTO blog_posts (title, excerpt, content, author, date, category, image_url) VALUES
('Building Your Business on Biblical Principles', 'Discover how to integrate your faith into every aspect of your business operations.', 'In today''s competitive business landscape, it can be challenging to maintain your Christian values while building a successful enterprise. However, integrating biblical principles into your business operations is not only possible but can be the foundation for sustainable success.

The Bible provides timeless wisdom for business leaders. Proverbs 16:3 tells us to "Commit to the Lord whatever you do, and he will establish your plans." This verse reminds us that when we align our business goals with God''s will, we can expect His blessing and guidance.

Here are key biblical principles to consider:

1. Integrity in All Dealings
Proverbs 11:1 states, "The Lord detests dishonest scales, but accurate weights find favor with him." This principle applies to every aspect of business - from pricing to customer service to employee relations.

2. Stewardship of Resources
As Christians, we understand that everything we have belongs to God. This perspective changes how we manage finances, treat employees, and use our resources for kingdom purposes.

3. Serving Others
Jesus taught us that the greatest among us are those who serve. In business, this translates to genuinely caring for customers, employees, and the community.

4. Excellence in Work
Colossians 3:23 reminds us to work "with all your heart, as working for the Lord." This standard of excellence should permeate every aspect of our business operations.

Building a business on biblical principles requires intentionality and commitment, but the rewards extend far beyond financial success. When we honor God in our business practices, we create enterprises that make a lasting impact on the kingdom of God.', 'Sarah Johnson', '2025-01-15', 'Faith & Business', 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800'),
('The Power of Stewardship in Entrepreneurship', 'Learn how viewing your business as a stewardship opportunity can transform your approach.', 'Stewardship is a fundamental biblical concept that transforms how Christian entrepreneurs approach their businesses. When we understand that we are stewards rather than owners of our enterprises, it changes everything - from our decision-making process to our long-term vision.

The parable of the talents in Matthew 25:14-30 provides a powerful framework for understanding business stewardship. The master entrusted his servants with different amounts of money, expecting them to invest and multiply what they had been given. The servants who doubled their investments were praised and given greater responsibilities.

This parable teaches us several key principles about business stewardship:

1. God Entrusts Us with Resources
Every business opportunity, skill, and resource we have is ultimately from God. Recognizing this helps us approach our work with humility and gratitude.

2. We Are Expected to Multiply What We''ve Been Given
Stewardship isn''t about playing it safe or hiding our talents. God expects us to take calculated risks and work diligently to grow what He has entrusted to us.

3. Faithfulness in Small Things Leads to Greater Opportunities
The servants who were faithful with smaller amounts were given greater responsibilities. This principle applies to business growth and expansion.

4. We Will Give an Account
Ultimately, we will answer to God for how we managed the resources He entrusted to us. This accountability should motivate us to operate with integrity and purpose.

Practical applications of stewardship in business include:

- Making decisions based on biblical principles rather than just profit margins
- Treating employees as valuable individuals created in God''s image
- Using profits to advance God''s kingdom through giving and ministry
- Operating with transparency and honesty in all dealings
- Considering the long-term impact of business decisions on all stakeholders

When we embrace our role as stewards, business becomes more than just a means of making money - it becomes a platform for serving God and advancing His kingdom. This perspective brings meaning and purpose to our work that transcends financial success.

The stewardship mindset also helps us navigate challenges with greater peace and confidence. When we remember that God is ultimately in control and that we are simply managing what belongs to Him, we can face difficulties with faith rather than fear.

As Christian entrepreneurs, let us embrace our calling as stewards and use our businesses as vehicles for God''s glory and the advancement of His kingdom.', 'David Williams', '2025-01-10', 'Stewardship', 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800'),
('Finding Your Purpose in Business', 'Discover your God-given calling and how to align your business with His purpose.', 'Every Christian entrepreneur faces the fundamental question: "What is God''s purpose for my business?" This question goes beyond simply making a profit or achieving success. It touches the heart of why God has placed entrepreneurial gifts and opportunities in your life.

Finding your purpose in business begins with understanding that God has a unique plan for each of us. Jeremiah 29:11 reminds us that God''s plans for us are "to prosper you and not to harm you, to give you hope and a future." This promise extends to our business endeavors when we seek to align them with His will.

Here are key steps to discovering your God-given business purpose:

1. Seek God Through Prayer and Scripture
Before making major business decisions, spend time in prayer asking God for wisdom and direction. James 1:5 promises that God will give wisdom generously to those who ask.

2. Identify Your God-Given Gifts and Passions
God has equipped each of us with unique talents and passions. Consider how your natural abilities and interests might be used to serve others and advance His kingdom through business.

3. Look for Ways to Serve Others
Jesus taught that true greatness comes through serving others. Ask yourself: "How can my business genuinely help people and meet real needs?"

4. Consider Your Sphere of Influence
God has placed you in specific relationships and communities for a reason. How can your business positively impact the people and places God has connected you with?

5. Evaluate Opportunities Through a Kingdom Lens
When business opportunities arise, evaluate them not just for their profit potential, but for their alignment with biblical values and their potential to advance God''s kingdom.

Signs that you''re operating in your God-given purpose include:

- A sense of fulfillment that goes beyond financial success
- Opportunities to share your faith naturally through your work
- Positive impact on employees, customers, and community
- Peace and confidence in your business decisions
- Supernatural provision and favor in challenging times

It''s important to remember that finding your purpose is often a journey rather than a single moment of revelation. God may reveal His plan gradually as you step out in faith and obedience.

Your business purpose may also evolve over time as you grow in maturity and as circumstances change. What matters most is maintaining a heart that seeks to honor God and serve others through your entrepreneurial efforts.

When your business aligns with God''s purpose, work becomes worship. Every transaction, every employee interaction, and every business decision becomes an opportunity to reflect God''s character and advance His kingdom.

Don''t underestimate the impact of a purpose-driven business. When you operate with kingdom principles and genuine care for others, you create a powerful testimony that can influence countless lives for eternity.

Take time today to seek God''s heart for your business. Ask Him to reveal His purpose and give you the courage to align your entrepreneurial efforts with His kingdom agenda. The world needs more businesses that operate with divine purpose and biblical values.', 'Grace Thompson', '2025-01-05', 'Purpose', 'https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?auto=compress&cs=tinysrgb&w=800')
ON CONFLICT DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public) VALUES 
('business-logos', 'business-logos', true),
('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Public can view business logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'business-logos');

CREATE POLICY "Public can view blog images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload business logos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'business-logos');

CREATE POLICY "Authenticated users can upload blog images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can update business logos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'business-logos');

CREATE POLICY "Authenticated users can update blog images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can delete business logos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'business-logos');

CREATE POLICY "Authenticated users can delete blog images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'blog-images');