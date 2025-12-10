# Vercel Environment Variables Setup

## ⚠️ IMPORTANT: Add These in Vercel Dashboard

The deployment is failing because environment variables are missing in Vercel.

### Steps to Add Environment Variables:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `smart-agriculture-and-water-management-cloud-platform`

2. **Navigate to Settings**
   - Click on **Settings** tab
   - Click on **Environment Variables** in the sidebar

3. **Add Environment Variables**

   Click **Add New** and add these two variables:

   **Variable 1:**
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://wfdbpbatlyqcrhidxqbi.supabase.co` (your actual Supabase project URL)
   - **Environments**: Check all three (Production, Preview, Development)

   **Variable 2:**
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase anon key (get from Supabase dashboard → Settings → API)
   - **Environments**: Check all three (Production, Preview, Development)

4. **Save and Redeploy**
   - Click **Save**
   - Go back to your GitHub Actions and **Re-run failed jobs**
   - Or push a new commit to trigger deployment

### Where to Find Your Supabase Keys:

1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
2. Copy:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **anon/public key** → Use for `VITE_SUPABASE_ANON_KEY`

### Security Note:

- These are **public keys** safe to expose in frontend code
- The `anon` key has RLS protection - users can only access their own data
- Never commit these values to git (they're in `.gitignore`)

## After Adding Variables:

Your Vercel deployment will work automatically on next push to `dev` branch! 🚀
