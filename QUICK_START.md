# Quick Start Guide - Connecting Supabase

## 🚀 5-Minute Setup

### 1. Get Supabase Credentials (2 minutes)

1. Go to https://supabase.com/dashboard
2. Click on your project (or create one if you don't have it)
3. Click **Settings** → **API**
4. Copy these two values:
   - **Project URL**
   - **anon public key**

### 2. Update config.js (1 minute)

Open `config.js` and replace:

```javascript
url: 'YOUR_SUPABASE_URL'  // Paste your Project URL here
anonKey: 'YOUR_SUPABASE_ANON_KEY'  // Paste your anon key here
```

### 3. Create Database Tables (2 minutes)

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy/paste the SQL code from `SUPABASE_SETUP.md` (Section "Step 2")
4. Click **Run**

### 4. Create Storage Bucket (1 minute)

1. Go to **Storage** in Supabase
2. Click **Create a new bucket**
3. Name: `design-uploads`
4. Make it **Public**
5. Click **Create**

### 5. Refresh Your Site

Reload `index.html` and you're done!

## ✨ What You Can Do Now

✅ **Save Designs** - Enter a name and click "Save Configuration"
✅ **Load Designs** - Click "Load Saved Designs" to see all saved configs
✅ **Upload Images** - Images are now saved to Supabase cloud storage
✅ **Share** - Your designs are stored in the cloud and accessible anywhere

## 🎯 Testing It

1. Adjust some body measurements
2. Change colors
3. Enter a name like "My First Design"
4. Click "💾 Save Configuration"
5. Click "📂 Load Saved Designs" to see it!

## ⚠️ Troubleshooting

**"Supabase not configured" error?**
- Check that you updated `config.js` with real credentials

**Can't save configurations?**
- Make sure you ran the SQL code to create tables

**Image upload fails?**
- Check that you created the `design-uploads` storage bucket

## 📚 Full Documentation

See `SUPABASE_SETUP.md` for detailed instructions.

---

Need help? Check the browser console (F12) for error messages!
