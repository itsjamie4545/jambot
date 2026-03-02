# Supabase Setup Instructions for Jacque Jeme

## Step 1: Get Your Supabase Credentials

1. Go to https://supabase.com/dashboard
2. Select your project (or create a new one)
3. Click on the **Settings** icon (gear icon) in the left sidebar
4. Click on **API** in the settings menu
5. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (a long string starting with `eyJ...`)

## Step 2: Create Your Database Tables

1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste this SQL code:

```sql
-- Create table for storing model configurations
CREATE TABLE IF NOT EXISTS model_configurations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id TEXT,
  gender TEXT NOT NULL,
  pose TEXT NOT NULL,
  measurements JSONB NOT NULL,
  colors JSONB NOT NULL,
  texture TEXT,
  name TEXT,
  thumbnail_url TEXT
);

-- Create table for storing uploaded images
CREATE TABLE IF NOT EXISTS uploaded_designs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id TEXT,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE model_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_designs ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (you can modify these later for auth)
CREATE POLICY "Allow public read access" ON model_configurations
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON model_configurations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON model_configurations
  FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on designs" ON uploaded_designs
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on designs" ON uploaded_designs
  FOR INSERT WITH CHECK (true);
```

4. Click **Run** to execute the query

## Step 3: Set Up Storage Bucket

1. Click on **Storage** in the left sidebar
2. Click **Create a new bucket**
3. Name it: `design-uploads`
4. Make it **Public** (so images can be accessed)
5. Click **Create bucket**

## Step 4: Configure Your App

1. Open the file `config.js` in your jacque-jeme folder
2. Replace `YOUR_SUPABASE_URL` with your Project URL
3. Replace `YOUR_SUPABASE_ANON_KEY` with your anon/public key

## Step 5: Refresh Your Website

1. Reload your `index.html` page
2. Your app is now connected to Supabase!

## Features Now Available:

✅ **Save Configurations** - Save your model settings to the cloud
✅ **Load Configurations** - Load previously saved designs
✅ **Upload Images** - Upload design files to Supabase Storage
✅ **Share Designs** - Get shareable links to your configurations

## Security Note:

The current setup allows public access. For production, you should:
- Enable Supabase Authentication
- Update RLS policies to require authentication
- Add user-specific access controls
