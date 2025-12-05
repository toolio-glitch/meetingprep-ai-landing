# Testing v1.2.0 Locally - Step by Step

## 🔧 Load Extension in Chrome (Developer Mode)

1. **Open Chrome** and go to: `chrome://extensions/`

2. **Enable Developer Mode** (toggle in top-right corner)

3. **Click "Load unpacked"**

4. **Select folder:** `C:\meeting-prep-AI\meeting-prep-landing\meetingprep-extension\`

5. Extension should now appear in your extensions list ✅

6. **Important:** Pin the extension to your toolbar for easy access

---

## ✅ Test 1: Anonymous User - First Install Experience

### Expected: No login required, immediate access

**Steps:**
1. Click the extension icon
2. **✅ VERIFY:** Popup opens showing main section (NOT login screen)
3. **✅ VERIFY:** Footer shows "10 free briefs left"
4. **✅ VERIFY:** No login/signup screen appears

**If you see login screen instead:**
- ❌ Something's wrong - the auth gate didn't get removed
- Check browser console for errors (F12)

---

## ✅ Test 2: Generate Anonymous Brief

### Expected: Brief generates without login

**Steps:**
1. Open Google Calendar: https://calendar.google.com
2. Click on any meeting/event (or create a test one)
3. Click the MeetingPrep AI extension icon
4. **✅ VERIFY:** Meeting details appear in popup
5. Click "Generate Meeting Brief" button
6. **✅ VERIFY:** Brief generates successfully
7. **✅ VERIFY:** Footer now shows "9 free briefs left"

**If brief generation fails:**
- Check browser console (F12) for errors
- Check Network tab for API call to `/api/extension/generate-brief`
- Verify the request includes `extensionId` as `userId`

---

## ✅ Test 3: Usage Counter & Warnings

### Expected: Counter decrements, warning at 8 briefs

**Steps:**
1. Generate 7 more briefs (you should be at 8 total)
2. **✅ VERIFY:** Footer shows "2 free briefs left"
3. **✅ VERIFY:** Blue info message appears: "Only 2 free briefs left! Sign up to get 20/month"
4. Generate 2 more briefs (now at 10 total)
5. **✅ VERIFY:** Footer shows "0 free briefs left"

---

## ✅ Test 4: Upgrade Prompt (Limit Reached)

### Expected: Signup prompt after 10th brief

**Steps:**
1. Try to generate 11th brief
2. **✅ VERIFY:** Upgrade screen appears with:
   - "🎉 You've used all 10 free briefs!"
   - "Sign up to get 20 AI briefs per month for free"
   - "Create Free Account" button
   - "Already have an account? Sign in" link

3. Click "Create Free Account" button
4. **✅ VERIFY:** Opens signup page in new tab

---

## ✅ Test 5: Login Flow (For Existing Users)

### Expected: Logged-in users bypass the limit

**Steps:**
1. In the upgrade prompt, click "Sign in" link
2. **✅ VERIFY:** Shows login screen
3. Enter your credentials and log in
4. **✅ VERIFY:** After login:
   - Footer shows your email (NOT "X briefs left")
   - "Sign Out" link appears
   - "View All Briefs" button visible
5. Generate a brief
6. **✅ VERIFY:** Brief generates without any limit warnings

---

## ✅ Test 6: Logout Returns to Free Trial

### Expected: After logout, you can't generate more (already used 10)

**Steps:**
1. Click "Sign Out" in footer
2. **✅ VERIFY:** Returns to upgrade prompt immediately (since you already used 10 free briefs)
3. Footer should show "0 free briefs left"

---

## 🔄 Test 7: Reset & Fresh Start

### Expected: Clearing data resets the counter

**Steps:**
1. Go to `chrome://extensions/`
2. Find MeetingPrep AI
3. Click "Remove" to uninstall
4. Reload the unpacked extension again
5. **✅ VERIFY:** Counter resets to "10 free briefs left"
6. Generate 1 brief
7. **✅ VERIFY:** Counter shows "9 free briefs left"

---

## 🐛 Common Issues & Fixes

### Issue: Login screen still shows on first open
**Fix:** Check popup.js line 55-68 - `checkAuthStatus()` should call `showMainSection()` unconditionally

### Issue: Brief generation fails with auth error
**Fix:** Check popup.js line 262-273 - should use `extensionId` as `userId` for anonymous users

### Issue: Counter doesn't decrement
**Fix:** Check popup.js line 276-279 - should increment `briefsGenerated` and save to local storage

### Issue: No upgrade prompt after 10 briefs
**Fix:** Check popup.js line 251-254 - should check `!this.user && this.briefsGenerated >= 10`

---

## 📊 Check Browser Console

After each test, check for:
- ✅ No red errors in console
- ✅ Analytics events tracked: `popup_opened`, `brief_generated`
- ✅ localStorage shows: `extensionId`, `briefsGenerated`

**View localStorage:**
```javascript
// Paste in browser console (F12) while on extension popup:
chrome.storage.local.get(null, (result) => console.log(result));
```

---

## 🎯 Success Criteria

Before submitting to Chrome Web Store, verify:
- [ ] Extension loads without errors
- [ ] No login required on first open
- [ ] Anonymous briefs generate successfully
- [ ] Counter displays and decrements correctly
- [ ] Warning shows at 8th brief
- [ ] Upgrade prompt appears at 11th brief attempt
- [ ] Signup button opens signup page
- [ ] Login works and bypasses limits
- [ ] Logout returns to anonymous mode
- [ ] No console errors

---

## 📝 What to Test First (Priority Order)

1. **Test 1** - No login screen (most critical change)
2. **Test 2** - Anonymous brief generation (core feature)
3. **Test 3** - Counter works (validation)
4. **Test 4** - Upgrade prompt (conversion funnel)

If these 4 work, the rest should be fine. 🚀

