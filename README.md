# Smart Bookmark App

Built by: Karunesh Kumar Pandey

Live Demo:
https://smart-bookmark-pfa4.vercel.app

Built by: Karunesh Kr Padney

## Features

- Google OAuth login (Supabase Auth)
- Private bookmarks per user
- Real-time bookmark updates across tabs
- Add & delete bookmarks
- Logout support
- Deployed on Vercel

## Tech Stack

- Next.js (App Router)
- Supabase (Auth + Database + Realtime)
- Tailwind CSS
- Vercel

## Problems I faced & how I solved them

1. Google OAuth redirect loop  
Solved by correctly configuring Supabase redirect URLs and Vercel environment variables.

2. Supabase Realtime not working initially  
Solved by enabling realtime on bookmarks table and using Supabase channel subscriptions.

3. Next.js App Router auth issues  
Solved by removing deprecated auth helpers and switching to supabase-js client directly.

4. Environment variables missing on Vercel  
Solved by adding NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel project settings.

## What I learned from this project

- How OAuth authentication works end-to-end using Supabase.
- Handling client-side auth state properly in Next.js App Router.
- Debugging redirect loops and session issues.
- Deploying full-stack apps on Vercel with environment variables.
- Designing responsive UI using Tailwind CSS.
- Structuring real-world CRUD apps with authentication.

This project helped me understand real production issues like auth flow, deployment bugs, and database integration.

## How to run locally

```bash
npm install
npm run dev
