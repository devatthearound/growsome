-- Create Supabase Blog Tables
-- Run this in your Supabase SQL Editor

-- 1. Blog Categories Table
CREATE TABLE IF NOT EXISTS blog_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  parent_id INTEGER REFERENCES blog_categories(id),
  color VARCHAR(7) DEFAULT '#514FE4',
  icon VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID,
  category_id INTEGER REFERENCES blog_categories(id),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  seo_title VARCHAR(500),
  seo_description TEXT,
  meta_keywords TEXT[],
  view_count INTEGER DEFAULT 0,
  reading_time INTEGER,
  tags TEXT[],
  featured BOOLEAN DEFAULT false,
  allow_comments BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Blog Comments Table (optional)
CREATE TABLE IF NOT EXISTS blog_comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  author_id UUID,
  parent_id INTEGER REFERENCES blog_comments(id),
  author_name VARCHAR(255),
  author_email VARCHAR(255),
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);

-- 5. Insert some sample categories
INSERT INTO blog_categories (name, slug, description, color, sort_order) VALUES
('Technology', 'technology', 'Posts about technology and programming', '#3B82F6', 1),
('Business', 'business', 'Business insights and strategies', '#10B981', 2),
('Lifestyle', 'lifestyle', 'Lifestyle and personal development', '#F59E0B', 3),
('News', 'news', 'Latest news and updates', '#EF4444', 4)
ON CONFLICT (slug) DO NOTHING;

-- 6. Insert a sample blog post
INSERT INTO blog_posts (
  title, 
  slug, 
  content, 
  excerpt, 
  category_id, 
  status, 
  published_at,
  tags,
  featured
) VALUES (
  'Welcome to Our Blog',
  'welcome-to-our-blog',
  '# Welcome to Our Blog

This is our first blog post! We''re excited to share our thoughts and insights with you.

## What You Can Expect

- Regular updates on technology
- Business insights
- Lifestyle tips
- And much more!

Stay tuned for more amazing content.',
  'Welcome to our new blog! Read about what you can expect from our upcoming posts.',
  (SELECT id FROM blog_categories WHERE slug = 'news' LIMIT 1),
  'published',
  NOW(),
  ARRAY['welcome', 'announcement'],
  true
) ON CONFLICT (slug) DO NOTHING;

-- 7. Update timestamps trigger (optional but recommended)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE
    ON blog_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE
    ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_comments_updated_at BEFORE UPDATE
    ON blog_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
