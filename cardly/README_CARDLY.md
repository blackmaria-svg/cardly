# Cardly — Complete Setup Guide

You have all the files. Follow these steps exactly. ~10 minutes total.

## STEP 1 — Copy files into your project

Copy everything from this `cardly` folder into your existing project at:
`C:\Users\HP\Documents\cardly`

Overwrite when asked. The files go in matching folders:
- `src/app/...`         → your src/app
- `src/components/...`   → your src/components
- `src/lib/...`          → your src/lib

The fastest way: open both folders side by side in File Explorer, drag and drop, click "Replace files".

## STEP 2 — Run the database setup

1. Open: https://supabase.com/dashboard/project/tdpqnvqevhzetqnkxqnw/sql/new
2. Open `SUPABASE_SETUP.sql`, copy ALL of it, paste into the SQL editor
3. Click RUN
4. Should say "Success"

## STEP 3 — Turn on Google login

1. Open: https://supabase.com/dashboard/project/tdpqnvqevhzetqnkxqnw/auth/providers
2. Find **Google**, toggle it ON
3. You need a Google Client ID + Secret:
   - Go to https://console.cloud.google.com/apis/credentials
   - Create Project → Create Credentials → OAuth Client ID → Web application
   - Authorized redirect URI: `https://tdpqnvqevhzetqnkxqnw.supabase.co/auth/v1/callback`
   - Copy the Client ID and Client Secret into Supabase, click Save

(If you skip Google, email login still works fine.)

## STEP 4 — Set your live URL in Supabase

1. Open: https://supabase.com/dashboard/project/tdpqnvqevhzetqnkxqnw/auth/url-configuration
2. Site URL: `https://cardly-blackmaria.vercel.app`
3. Redirect URLs → add: `https://cardly-blackmaria.vercel.app/**`
4. Save

## STEP 5 — Deploy

Open CMD in your project folder and run these one by one:

```
cd C:\Users\HP\Documents\cardly
npm run build
```

If build succeeds (no red errors), deploy:

```
git add .
git commit -m "complete cardly v2"
git push origin master:main --force
```

Vercel auto-deploys in ~1 minute. Done!

## STEP 6 — Test it

1. Go to https://cardly-blackmaria.vercel.app
2. Click "Get your card" → sign in with Google or email
3. Fill your profile, pick business type (barber/food/generic)
4. Add services/slots (barber) or menu/QR (food)
5. Click "Preview →" to see your live card
6. Share the link: cardly-blackmaria.vercel.app/u/YOUR_USERNAME

## How each business type works

- **Barber**: card shows services + bookable time slots. Customer picks a slot, enters name+phone, confirms.
- **Food**: card shows menu by category + cart. Customer adds items, taps "View order", scans your QR to pay.
- **Generic**: card shows socials, contact, location. Pure digital business card.
