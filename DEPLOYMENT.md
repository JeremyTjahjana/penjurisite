# Deployment Guide

## Quick Deploy to Vercel

1. **Push your code to GitHub:**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New Project"
   - Import your GitHub repository
   - Click "Deploy" (Vercel auto-detects Next.js settings)

3. **Your site will be live at:** `https://your-project-name.vercel.app`

---

## Visitor Tracking

### Current Implementation (Development)

The visitor counter currently uses **localStorage** which:

- ✅ Works immediately (no setup needed)
- ✅ Good for development/testing
- ❌ Only tracks local browser sessions
- ❌ Resets if user clears browser data
- ❌ Doesn't track unique visitors across devices

### Upgrade Options for Production

#### Option 1: Vercel Analytics (Recommended)

**Best for:** Professional analytics, page views, unique visitors

1. Install Vercel Analytics:

   ```bash
   npm install @vercel/analytics
   ```

2. Add to `app/layout.tsx`:

   ```tsx
   import { Analytics } from "@vercel/analytics/react";

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

3. View analytics at: `https://vercel.com/your-project/analytics`

**Pricing:** Free tier includes 2,500 events/month

---

#### Option 2: Real Visitor Counter with Database

**For a real persistent counter, you need a database:**

##### A. Using Vercel KV (Redis)

1. Enable Vercel KV in your project dashboard
2. Install package:

   ```bash
   npm install @vercel/kv
   ```

3. Create API route `app/api/visitors/route.ts`:

   ```typescript
   import { kv } from "@vercel/kv";
   import { NextResponse } from "next/server";

   export async function GET() {
     const count = await kv.incr("visitor_count");
     return NextResponse.json({ count });
   }
   ```

4. Update homepage to fetch from API:
   ```tsx
   useEffect(() => {
     fetch("/api/visitors")
       .then((res) => res.json())
       .then((data) => setVisitorCount(data.count));
   }, []);
   ```

**Pricing:** Free tier includes 30,000 commands/month

##### B. Using Free Counter API

Use a third-party service like CountAPI:

```tsx
useEffect(() => {
  fetch("https://api.countapi.xyz/hit/yoursite.com/visits")
    .then((res) => res.json())
    .then((data) => setVisitorCount(data.value));
}, []);
```

---

#### Option 3: Google Analytics

**Best for:** Comprehensive analytics (not just a counter)

1. Create Google Analytics account
2. Install next package:

   ```bash
   npm install @next/third-parties
   ```

3. Add to `app/layout.tsx`:

   ```tsx
   import { GoogleAnalytics } from "@next/third-parties/google";

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <GoogleAnalytics gaId="G-XXXXXXXXXX" />
         </body>
       </html>
     );
   }
   ```

---

## Recommendation

**For your use case:**

1. **Now:** Keep current localStorage implementation for immediate deployment
2. **After deployment:** Enable Vercel Analytics (free, easy, professional)
3. **If you need a counter widget:** Use Vercel KV or CountAPI

**Deploy now** and upgrade analytics later – the current implementation works fine for getting started!

---

## Build Commands (Auto-detected by Vercel)

- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Development Command:** `npm run dev`
