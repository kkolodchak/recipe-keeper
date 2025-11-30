# Vercel Environment Variables

## Required Environment Variables

Set these in your Vercel project settings (Settings → Environment Variables):

1. **SUPABASE_URL**
   - Your Supabase project URL
   - Example: `https://your-project.supabase.co`

2. **SUPABASE_ANON_KEY**
   - Your Supabase anonymous/public key
   - Found in Supabase Dashboard → Settings → API

## How to Set Environment Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable for:
   - **Production** environment
   - **Preview** environment (optional)
   - **Development** environment (optional)
4. Redeploy your application after adding variables

## Additional Notes

- For CORS configuration, update the `origin` array in `index.js` to include your Vercel deployment URL(s)
- The server will automatically use these environment variables when deployed to Vercel
- Make sure to add your frontend domain to the CORS allowed origins

