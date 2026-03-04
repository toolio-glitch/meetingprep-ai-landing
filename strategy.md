# MeetingPrep AI - Master Strategy & Blueprint

**Single source of truth for product status, strategy, and technical reference.**

---

## Current Status (Updated Feb 25, 2026)

### Key Metrics:
- **Total Installs:** ~160 (Aug 2025 - Mar 2, 2026), Chrome Store shows 5 current users
- **Daily Install Rate:** ~1.3 installs/day organic (US baseline)
- **Total Sign-Ups:** 2 real users (lhaovogo@gmail.com, webdevwarsaw@gmail.com)
- **Sign-Up Conversion:** 1.4% (2/160) -- critically low
- **Uninstalls:** 7 total, 0 in Feb 2026 (94% retention rate)
- **API Costs:** $0.00/month (OpenAI: 2 requests, 674 tokens in Feb). Budget: $120/mo
- **Revenue:** $0

### Geography & Platform:
- **71% United States** (Feb 2026)
- **27% Germany** (Feb 2026 -- spike event, see below)
- **69% ChromeOS**, **29% "Other" OS** (Mac/Linux from Germany spike)

### Germany Spike (Feb 23-25, 2026):
- 12 installs from Germany over 3 days (7→4→1), all "Other" OS (Mac/Linux)
- Zero uninstalls -- they kept it
- Zero analytics events -- none opened the popup (Supabase was still coming back up)
- No public trace found (Reddit, Twitter, blogs) -- likely a private Slack/Discord share
- v1.4.0 wasn't live yet, so they were on v1.3.0 with broken analytics

### Critical Problems:
1. **1.4% install-to-signup conversion** -- 158 out of 160 installers never signed up
2. **Supabase was paused** ~Dec 14, 2025 - Feb 10, 2026 (~2 months of dead backend)
3. **Analytics now working** -- table confirmed with data from Dec 5-14 + Feb 25
4. **Both real users last active in November 2025** -- zero retention
5. **Zero non-test usage recorded since analytics went live** -- no real users have opened the popup

### Recent Changes:
- **v1.3.0 (Live Jan 30, 2026):** Prominent "No Meeting Selected" warning + one-click Calendar button
- **v1.4.0 (Submitted Feb 25, 2026):** Removed fake test meeting fallback, fixed attendee parsing, shortened popup brief to summary, deduplicated All Briefs, added retry logic + error handling, added keep-alive cron to prevent Supabase pause

### Fixes Deployed (Feb 25, 2026):
- Supabase resumed (was paused ~Dec 14, 2025 - Feb 10, 2026)
- Analytics table confirmed working (had data from Dec 5-14 before pause)
- Next.js updated 15.5.3 → 15.5.12 (CVE fix)
- `/api/health` endpoint + Vercel cron every 12h (prevents future Supabase pause)
- All API calls now retry with backoff + user-friendly error messages
- Removed dead "Watch how it works" link
- Removed hardcoded test meeting fallback (was showing fake data to users)
- Fixed attendee parsing (filtered out "Google Meetmeet", "Conference Room", etc.)
- Shortened popup brief to summary (users click through to full viewer)
- Deduplicated All Briefs page
- Consolidated BLUEPRINT.md into this file
- **v1.4.0 published and live on Chrome Web Store (Feb 25, 2026)**

---

## Version History

- **v1.0.0:** Initial launch (Nov 2025)
- **v1.1.0:** Analytics tracking added (Nov 23, 2025) -- table never created in DB
- **v1.2.0:** Try before signup - 10 free briefs without auth (Dec 5, 2025)
- **v1.3.0:** Prominent no-meeting warning + one-click Calendar button (Jan 30, 2026)
- **v1.4.0:** Reliability + UX fixes: retry logic, keep-alive, attendee filtering, brief summary, dedup (Feb 25, 2026 - published)

---

## Install Trend (from Chrome Web Store CSV)

| Month | Installs | Avg/Day |
|-------|----------|---------|
| Nov 2025 (from 10th) | 29 | 1.4 |
| Dec 2025 | 46 | 1.5 |
| Jan 2026 | 37 | 1.2 |
| Feb 2026 (to 23rd) | 32 | 1.4 |

Notable: Feb 23 had a spike of 9 installs (biggest single day).

---

## What's Working

- **Organic growth:** Consistent ~1.3 installs/day with zero marketing spend
- **Chrome Store SEO:** People are finding and installing it
- **Retention:** 94% keep it installed (only 7 uninstalls)
- **US market fit:** 92% from United States
- **Economics:** Negligible API costs, high margin potential

## What's Broken

- **Activation:** Almost nobody converts from install to actual usage
- **Backend reliability:** Supabase free tier pauses after inactivity, silently breaking the product
- **Analytics:** Never had working usage tracking -- flying blind
- **No retry/error handling:** Users who hit a down backend just see errors and leave

---

## Next Steps (Feb 25, 2026)

### All infrastructure fixes deployed. Now wait for data.

### Check back: ~March 11, 2026

**When returning, do these 3 things:**
1. Run `node view-analytics.js` in `meeting-prep-landing/` and review the output
2. Export latest install CSV from Chrome Web Store Developer Dashboard
3. Check Supabase dashboard → confirm project hasn't paused again

### Decision Point (based on 2 weeks of analytics data):

**Look at `popup_opened` events:**
- If popup_opened events are coming in but nobody generates a brief → Calendar integration / content script is broken for most users. Fix that.
- If almost no popup_opened events → people install and forget. Need an onboarding nudge (e.g. notification after install).
- If briefs are being generated → product works. Push marketing.

**Marketing sequence (don't skip ahead):**
1. Fix whatever the analytics data reveals
2. Soft launch on Reddit (r/SideProject, r/chrome_extensions) to test conversion
3. If Reddit converts at >10% activation → launch on Product Hunt
4. Product Hunt is a one-shot accelerant, not an experiment. Don't waste it on a broken funnel.

---

## Marketing (On Hold Until Activation Fixed)

### Validated Channels:
- **Chrome Store SEO:** 1.3 installs/day organic (working)
- **Reddit:** r/SideProject, r/chrome_extensions (5 installs historically)
- **Product Hunt:** Assets prepared, waiting for >30% activation

### Target Users:
Sales professionals, account executives, consultants, recruiters

---

## Monetization (POSTPONED)

**Status:** No Stripe -- need 100+ active users first

**Current:** Free (10 briefs no signup, 20/month after signup)

**Future Pricing:**
- Free: 5 briefs/month
- Pro ($19/mo): Unlimited + LinkedIn
- Pro+ ($39/mo): Email context + advanced AI
- Team ($49/mo): Shared briefs + CRM

---

## Technical Reference

### Production:
- **Website:** https://meetingprep-ai-vercel.vercel.app
- **Chrome Store:** https://chromewebstore.google.com/detail/meetingprep-ai/hpbljjdfjeimheogmjcklnohlmpgjlcj
- **GitHub:** toolio-glitch/meetingprep-ai-landing
- **Current Version:** v1.3.0 (live)

### Stack:
- Next.js 15.5.3 + Tailwind CSS v4
- Supabase (PostgreSQL + Auth) -- FREE tier
- OpenAI GPT-4o-mini
- Chrome Extension Manifest v3
- Deployed on Vercel (free tier)

### Architecture:
```
Chrome Extension → Next.js API (Vercel) → Supabase DB
                        ↓
                  OpenAI GPT-4o-mini
```

### Database Tables:
- `meetings` -- calendar meeting data
- `briefs` -- AI-generated briefs
- `user_subscriptions` -- usage tracking & billing
- `extension_analytics` -- usage event tracking (NEEDS CREATION)

### API Endpoints:
- `POST /api/auth/login` -- user authentication
- `POST /api/extension/generate-brief` -- AI brief generation
- `GET /api/extension/get-meetings` -- fetch user meetings
- `DELETE /api/extension/delete-meeting` -- delete meeting
- `POST /api/extension/analytics` -- log usage events
- `GET /api/health` -- health check (keep-alive target)

### Environment Variables (Vercel):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

### Analytics:
```bash
node view-analytics.js
```

### Project Structure:
```
meeting-prep-AI/
├── meeting-prep-landing/
│   ├── src/app/              # Next.js App Router
│   │   ├── api/              # Backend API routes
│   │   ├── dashboard/        # Web dashboard
│   │   ├── login/signup/     # Auth pages
│   │   └── page.tsx          # Landing page
│   ├── src/lib/              # Supabase clients & services
│   ├── meetingprep-extension/ # Chrome extension
│   │   ├── popup.html/js     # Extension UI
│   │   ├── content-script.js # Calendar integration
│   │   ├── background.js     # Service worker
│   │   ├── brief-viewer.*    # Full brief display
│   │   └── all-briefs.*      # All briefs viewer
│   ├── vercel.json           # Cron config (keep-alive)
│   ├── create-analytics-table.sql
│   ├── supabase-schema.sql
│   └── view-analytics.js
└── strategy.md               # This file
```

---

## Roadmap

**Phase 1: Fix Activation (Now - Mar 2026)**
- Get analytics working
- Prevent Supabase from pausing
- Understand why 98.6% of installers never sign up
- Fix the biggest drop-off point

**Phase 2: Scale Traffic (Mar-Apr 2026)**
- Product Hunt launch when activation >20%
- Target: 200-400 active users

**Phase 3: Monetization (Apr-May 2026)**
- Stripe integration after 100+ active users

**Phase 4: Premium Features (May-Aug 2026)**
- LinkedIn integration
- Email context (Gmail/Outlook)
- Team collaboration

**Phase 5: Enterprise (Aug-Dec 2026)**
- Outlook Calendar support
- Mobile app
- White-label solutions

---

*Updated: February 25, 2026*
*Next Review: March 11, 2026*

**Current Focus:** v1.4.0 submitted. All infrastructure fixes deployed. Waiting 2 weeks for analytics data before deciding next move. Do NOT launch Product Hunt until activation is proven.
