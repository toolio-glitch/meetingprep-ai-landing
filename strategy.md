# MeetingPrep AI - Master Strategy & Blueprint

**Single source of truth for product status, strategy, and technical reference.**

---

## Current Status (Updated March 25, 2026)

### Key Metrics:
- **Total Installs:** ~207 (Nov 2025 - Mar 23, 2026), Chrome Store shows 4 current users
- **Daily Install Rate:** ~2.2 installs/day in March (up from ~1.3/day)
- **Total Sign-Ups:** 2 real users (lhaovogo@gmail.com, webdevwarsaw@gmail.com) -- both inactive since Nov 2025
- **Sign-Up Conversion:** ~1% (2/207) -- critically low
- **Uninstalls:** 8 total, 1 in March (96% retention rate)
- **Real Usage:** 1 anonymous user generated a brief on Mar 16 -- first real non-test usage
- **API Costs:** ~$0.00/month. Budget: $120/mo
- **Revenue:** $0

### Geography & Platform:
- **~50% United States**, **~50% Germany** (March 2026)
- Germany shifted from one-time spike to persistent ~1 install/day since early March
- **ChromeOS ~50%** (US users), **"Other" OS ~50%** (Germany -- likely Linux)

### Germany: From Spike to Steady Source
- **Feb 23-25 spike:** 19 installs over 3 days (7→4→1→...), all "Other" OS
- **March 1-23:** ~1 install/day from Germany (26 total), now matching US volume
- **Zero uninstalls from Germany ever** -- 100% retention
- No public trace found (Reddit, Twitter, blogs) -- likely word-of-mouth or private share
- All Germany users were on v1.3.0/v1.4.0 during the spike period

### Critical Problems:
1. **Activation gap:** ~207 installs, only 1 real user has ever opened the popup and used it (Mar 16)
2. **Onboarding:** Users install but don't know to click the extension icon on Google Calendar
3. **v1.5.0 deployed today (Mar 25)** with notification nudges to address this

### Analytics Data (from Supabase, via `node view-analytics.js`):
- 12 unique extension IDs have opened the popup (mostly test/dev)
- 73 popup_opened events total (mostly test)
- 20 brief_generated events (mostly test)
- **1 real external user:** anonymous, Mar 16 -- opened popup + generated a brief
- Conclusion: the product works, but almost nobody discovers how to use it

### Version History & Recent Changes:
- **v1.3.0 (Live Jan 30, 2026):** Prominent "No Meeting Selected" warning + one-click Calendar button
- **v1.4.0 (Live Feb 25, 2026):** Reliability + UX fixes: retry logic, keep-alive, attendee filtering, brief summary, dedup, removed fake test data
- **v1.5.0 (Live Mar 25, 2026):** Onboarding notifications -- Chrome notification on install + 1h and 24h reminders if user hasn't generated a brief yet

### Fixes Deployed (cumulative):
- Supabase resumed (was paused ~Dec 14, 2025 - Feb 10, 2026)
- Analytics table confirmed working
- Next.js updated 15.5.3 → 15.5.12 (CVE fix)
- `/api/health` endpoint + Vercel cron every 12h (prevents future Supabase pause)
- All API calls retry with backoff + user-friendly error messages
- Removed dead "Watch how it works" link
- Removed hardcoded test meeting fallback
- Fixed attendee parsing
- Shortened popup brief to summary (click through to full viewer)
- Deduplicated All Briefs page
- Onboarding notification on install + follow-up reminders (v1.5.0)
- Cleaned up dead code in background.js

---

## Version History

- **v1.0.0:** Initial launch (Nov 2025)
- **v1.1.0:** Analytics tracking added (Nov 23, 2025) -- table never created in DB
- **v1.2.0:** Try before signup - 10 free briefs without auth (Dec 5, 2025)
- **v1.3.0:** Prominent no-meeting warning + one-click Calendar button (Jan 30, 2026)
- **v1.4.0:** Reliability + UX fixes: retry logic, keep-alive, attendee filtering, brief summary, dedup (Feb 25, 2026)
- **v1.5.0:** Onboarding notifications: install nudge + 1h/24h reminders (Mar 25, 2026)

---

## Install Trend (from Chrome Web Store CSV)

| Month | Installs | Avg/Day | Notes |
|-------|----------|---------|-------|
| Nov 2025 (from 10th) | 29 | 1.4 | US only |
| Dec 2025 | 46 | 1.5 | US only |
| Jan 2026 | 37 | 1.2 | US + 2 Germany |
| Feb 2026 | 45 | 1.6 | Germany spike Feb 23-25 (19 installs) |
| Mar 2026 (to 23rd) | 50 | 2.2 | ~50/50 US/Germany, steady growth |

Notable: Install rate nearly doubled in March. Germany now a persistent ~1/day source.

---

## What's Working

- **Organic growth:** 2.2 installs/day in March with zero marketing spend (up from 1.3)
- **Chrome Store SEO:** People are finding and installing it
- **Retention:** 96% keep it installed (8 uninstalls out of 207)
- **Germany traction:** Persistent ~1/day from Germany, zero uninstalls ever
- **Product works:** The 1 real user who opened it successfully generated a brief
- **Economics:** Negligible API costs, high margin potential

## What's Broken

- **Activation:** ~207 installs but only 1 real user has opened the popup
- **Onboarding:** Users don't know to click the extension icon → v1.5.0 adds notifications (just deployed)
- ~~**Backend reliability:** Supabase free tier pauses after inactivity~~ → FIXED: keep-alive cron
- ~~**Analytics:** Never had working usage tracking~~ → FIXED: table logging events
- ~~**No retry/error handling:**~~ → FIXED: retry with backoff in v1.4.0

---

## Next Steps (March 25, 2026)

### v1.5.0 just deployed with onboarding notifications. Wait for data.

### Check back: ~April 1-2, 2026

**When returning, do these 3 things:**
1. Run `node view-analytics.js` in `meeting-prep-landing/` and review the output
2. Export latest install CSV from Chrome Web Store Developer Dashboard
3. Check Supabase dashboard → confirm project hasn't paused again

### Decision Point (based on 1 week of v1.5.0 data):

**Look at `popup_opened` events from new users (after Mar 25):**
- If popup_opened events increase significantly → notifications are working. Monitor brief generation next.
- If still almost no popup_opened events → notifications aren't enough. Consider more aggressive onboarding (e.g. auto-open popup on first Calendar visit, or a content script overlay on Google Calendar).
- If popup opens increase but no briefs generated → UX issue inside the popup. Investigate.

**Marketing sequence (don't skip ahead):**
1. Confirm v1.5.0 notifications move the activation needle
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
- **Current Version:** v1.5.0 (live Mar 25, 2026)

### Stack:
- Next.js 15.5.12 + Tailwind CSS v4
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
- `extension_analytics` -- usage event tracking (live, confirmed working)

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

*Updated: March 25, 2026*
*Next Review: April 1-2, 2026*

**Current Focus:** v1.5.0 live with onboarding notifications. Install rate doubled to 2.2/day. Germany now 50% of installs. Waiting 1 week to see if notifications improve activation. Do NOT launch Product Hunt until activation is proven.
