# MeetingPrep AI - Marketing & Product Strategy

## 🎯 Current Status (Updated Nov 27, 2025)

### Key Metrics:
- **Total Installs:** 23 (up from 11 on Nov 21)
- **Real Active Users:** 1 (lhaovogo@gmail.com - generated 1 brief on Nov 17)
- **Signup Conversion:** 22% (5 signups / 23 installs)
- **Extension Versions:**
  - **Live:** v1.1.0 (with analytics tracking)
  - **In Review:** v1.1.1 (welcome page on install) - Submitted Nov 27
  - **Planned:** v1.2.0 (10 free briefs without signup) - Build after v1.1.1 launches

### 🚨 CRITICAL INSIGHT DISCOVERED:
**Signup is the main barrier - 78% of installers never even open the extension!**
- 23 Chrome installs
- Only 5 people signed up (22%)
- 18 people (78%) installed but NEVER opened popup
- Root cause: Signup friction before seeing value

### Analytics (Operational as of Nov 23):
- **Tracks:** popup_opened, signup_clicked, login_success, brief_generated
- **View data:** Run `node view-analytics.js`
- **Key finding:** Only 1 user (test account) has opened popup since v1.1.0 launched
- **Conclusion:** 78% of users install but never open extension = onboarding problem

### Active Marketing:
1. **LinkedIn Sales Playbook!** (67K members)
   - Post submitted Nov 27 - pending admin approval
   - Expected: 10-15 installs when approved
2. **Reddit r/chrome_extensions** (33K members)
   - Post live Nov 23 - drove 2 installs in first 2 hours
   - Spirited-Tower3314 collaboration opportunity (complementary tools)
3. **User Outreach:**
   - lhaovogo@gmail.com emailed Nov 21 (only real active user)

### Goals (Nov 27 - Dec 7):
- ✅ v1.1.1 submitted (welcome page) - awaiting approval
- ⏳ LinkedIn post approval → 10-15 new installs
- ⏳ Measure v1.1.1 impact on signup conversion
- 🎯 Build v1.2.0 (10 free briefs, no signup) - deploy Dec 5
- 🎯 Target: 40-50 installs by Dec 7

---

## 🚀 Product Roadmap

### v1.1.1 - Welcome Page (Submitted Nov 27)
**Status:** In Chrome review (expect approval in 1-2 days)

**What it does:**
- Opens welcome page automatically on install
- Shows 3-step onboarding: Pin extension → Open Calendar → Click meeting → Generate brief
- Clear instructions to reduce "never opened popup" problem

**Expected impact:**
- Current: 22% of installers open popup
- Target: 40-50% of installers open popup

---

### v1.2.0 - Try Before Signup (Build after v1.1.1 launches)
**Status:** Planned for Dec 2-5

**🎯 Core Strategy: Remove Signup Barrier**

**Current Problem:**
```
23 installs → 5 signups (22%) → 1 active user (4% total activation)
Barrier: Users must sign up BEFORE seeing any value
```

**v1.2.0 Solution:**
```
Install → Open popup → Generate 10 briefs WITHOUT signup ✅
After 10th brief → "Sign up to get 20 more/month"
Expected: 60-80% signup rate (users already see value)
```

**Implementation:**
- Store usage count in browser local storage (no backend needed)
- Generate briefs anonymously using extension ID as identifier
- After 10 briefs used: Show signup prompt with Google Sign-In
- After signup: Migrate their usage history to account

**Why 10 free briefs:**
- Industry data: 10-15 free uses = 25-30% conversion (optimal)
- Covers 2-3 weeks of testing (habit formation period)
- 50% of paid tier (20/month) - standard freemium ratio
- Proven by: Loom (25 videos), Calendly (similar model)

**Development timeline:**
- Dec 2-3: Build local storage system + anonymous brief generation
- Dec 4: Test thoroughly
- Dec 5: Submit v1.2.0 to Chrome Store
- Dec 7: Expected approval

**Expected impact:**
- Current activation: 4% (1/23)
- With v1.2.0: 30-40% activation (12-16 active users out of 40 installs)

---

## 📊 SEO Strategy (Do After 50+ Installs)
1. Blog posts: "How to Prep for Sales Calls", "AI Meeting Tools"
2. Schema.org SoftwareApplication markup
3. Submit to: AlternativeTo.net, Capterra, Product Hunt
4. Optimize title tags and meta descriptions

**Note:** SEO takes 3-6 months. Focus on LinkedIn/Reddit first.

---

## 📧 Outreach Templates & Guidelines

### LinkedIn Post for Sales Playbook! (SUBMITTED - Pending Approval)
```
I'm a family doctor who built a meeting prep tool. Not sure if salespeople need it, but figured I'd ask.

The story: I got tired of spending 30 min before every meeting researching attendees and writing notes. So I built a Chrome extension that does it automatically using AI.

You connect it to Google Calendar, it pulls meeting details, generates a brief in 30 seconds. That's it.

I use it for my consultant/pharma meetings, but I'm thinking sales teams who do 5-10+ calls a day might get more value from it than I do.

It's free - Chrome Web Store, search "MeetingPrep AI"

Honest question for this group: is meeting prep actually a pain point for you, or have you already solved this a different way?
```

---

## 📝 LinkedIn Sales Contacts (For Future Outreach)

### Priority Contacts Added
- Pierce Griswold — SDR at Gong (San Francisco Bay Area)
- Zara S. — SDR at Fastmarkets (London)
- Albert van Rooyen — Digital Lead Manager at JifJaff MyBotGP (London)
- Ayo Olamousi — SDR at LEAP Legal Software UK (London)
- Dayo Ojo — Global SDR at Bandwidth (London)
- Alexander Belding — Managing SDR at circle.cloud (Chelmsford)
- Ciarán W. — SDR at Doctify (London)
- Samuel Lloyd — SDR at Convera (London)
- Mirad Sterkaj — Sales and Support Rep at Persyst (London)
- Thomas (Bret) Lewis — Business Development Manager at Office Pride (Cape Coral)
- Zulekha Zaman — SDR EMEA at Achievers (London)
- Sarah Maxwell — Sales Executive at Lumon (UK)
- Jordan Carvalho — SDR at Flourish (London)

### LinkedIn DM Guidelines
- Reference recent achievement from their profile
- Keep to 2 sentences, conversational tone
- Spell out numbers (avoid symbols)
- No em dashes
- Share Chrome Store link only after they accept connection

## Monetization Targets
- Hit 100 total installs (baseline traction) with at least 30 weekly active users generating briefs.
  - **PROGRESS: 17 installs as of Nov 23 (17% toward goal)**
  - **REALITY CHECK: Only 1 real active user (lhaovogo@gmail.com) has generated briefs**
  - **CONVERSION ISSUE: 29% signup rate (5/17), 20% activation rate (1/5)**
  - **MILESTONE: First installs Nov 10, biggest spike Nov 17 (3 installs from r/SideProject)**
- Collect 10 qualitative feedback notes or testimonials from active users.
  - **PROGRESS: 0/10 - Emailed lhaovogo@gmail.com Nov 21, waiting for response**
- Secure 5 warm leads who explicitly ask about premium features or higher limits.
  - **PROGRESS: 1/5 (lawszs from r/ProductManagement showed interest)**
- Maintain a 4.5+ Chrome Web Store rating once reviews start coming in.
  - **PROGRESS: No reviews yet (need 5+ active users first)**
- Once the above are met, move into Stripe integration and paid tier rollout.
  - **CURRENT FOCUS: Fix 70% signup drop-off before adding monetization**

---

## 📈 What's Working (Validated Channels)

### Reddit (Proven - 6 installs from 2 posts)
- **r/SideProject** (Nov 15) → 3 installs on Nov 17
- **r/chrome_extensions** (Nov 23) → 2 installs within 2 hours
- **Best practice:** Technical, authentic posts. Lead with learning/building story.
- **Spirited-Tower3314 collaboration:** Potential cross-promotion (their tool = focus during, ours = prep before)

### LinkedIn (Testing - Pending)
- **Sales Playbook!** post submitted Nov 27 (67K members)
- Awaiting admin approval
- Expected: 10-15 installs when live

### Email Outreach (Limited data)
- lhaovogo@gmail.com contacted Nov 21
- Only real active user (1 brief generated Nov 17)
- Awaiting response

---

## 🎯 Next Actions (Priority Order)

### This Week (Nov 27-30):
1. ⏳ **Wait for LinkedIn post approval** - Check daily
2. ⏳ **Wait for v1.1.1 Chrome approval** - Expected by Nov 29
3. 📊 **Monitor analytics** - Run `node view-analytics.js` to see if v1.1.1 welcome page helps
4. 📧 **Follow up with lhaovogo@gmail.com** if no response by Nov 29

### Next Week (Dec 2-7):
5. **Measure v1.1.1 impact:**
   - How many new users opened popup?
   - Did welcome page improve signup rate?
   - LinkedIn post conversion rate?
6. **Build v1.2.0** (10 free briefs, no signup):
   - Dec 2-3: Development
   - Dec 4: Testing
   - Dec 5: Submit to Chrome Store
7. **Target:** 40-50 total installs by Dec 7

---

## 📊 User Data (As of Nov 27)

### Chrome Web Store:
- **23 installs total**
- **1 uninstall** (96% retention)
- **22 active installs**

### Supabase Database:
- **5 signups** (22% of installs)
- **1 real user:** lhaovogo@gmail.com (generated 1 brief Nov 17)
- **4 test accounts:** Your testing

### The Gap:
- **18 people** (78%) installed but NEVER opened popup
- **Root cause:** No onboarding + signup required before seeing value
- **Solution:** v1.1.1 (welcome page) + v1.2.0 (try before signup)

---

---

## 💬 Active Opportunities

### Potential Partnerships:
- **Spirited-Tower3314** (r/chrome_extensions): Building focus-during-meetings tool
  - Complementary products (prep before + focus during)
  - Awaiting their beta link to test and provide feedback
  - Potential: Cross-promotion in Chrome Store listings

### LinkedIn Contacts:
- **Albert van Rooyen** (JifJaff MyBotGP): Sent Chrome Store link via LinkedIn + email
  - Email: Albertv@jifjaff.co.uk
  - Status: Awaiting response
  - Next: Schedule call if positive response

---

## 🔧 Technical Resources

**View Analytics:**
```bash
cd C:\meeting-prep-AI\meeting-prep-landing
node view-analytics.js
```

**Get User Emails:**
```bash
cd C:\meeting-prep-AI\meeting-prep-landing
node get-user-emails.js
```

**Chrome Web Store:**
- ID: hpbljjdfjeimheogmjcklnohlmpgjlcj
- Dashboard: https://chrome.google.com/webstore/devconsole

**Key Files:**
- Extension: `meetingprep-extension/`
- Latest version: `meetingprep-ai-v1.1.1-welcome.zip`
- Analytics table SQL: `create-analytics-table.sql`
- Email template: `email-to-existing-users.md`

