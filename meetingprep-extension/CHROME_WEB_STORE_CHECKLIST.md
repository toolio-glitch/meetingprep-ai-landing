# Chrome Web Store Submission Checklist

## ✅ Completed
- [x] Removed all localhost references
- [x] Updated to production URLs (https://meetingprep.ai)
- [x] Icons section added to manifest.json

## 🚧 Required Before Submission

### 1. Icons (CRITICAL)
- [ ] Create/download icon16.png (16x16 pixels)
- [ ] Create/download icon48.png (48x48 pixels)
- [ ] Create/download icon128.png (128x128 pixels)
- [ ] Save all 3 files to: `meetingprep-extension/icons/` folder
- [ ] Verify icons load in manifest.json

**Quick options:**
- Use ChatGPT/DALL-E with the prompt in `icons/CHATGPT_PROMPT.md`
- Use https://favicon.io/ to generate icons
- Use any image editor to create simple PNGs

### 2. Production Backend
- [ ] Deploy Next.js app to Vercel (meetingprep.ai domain)
- [ ] Verify API endpoints work: `/api/auth/login`, `/api/extension/generate-brief`
- [ ] Test extension with production backend

### 3. Extension Package
- [ ] Create ZIP file of entire `meetingprep-extension` folder
- [ ] Test ZIP loads correctly in Chrome (chrome://extensions/ → Load unpacked)
- [ ] Verify no errors in extension console

### 4. Chrome Web Store Listing
- [ ] **Screenshots** (required):
  - 1 small promotional tile (440x280px)
  - At least 1-5 screenshots (1280x800px or 640x400px)
  - Show: Extension popup, Google Calendar integration, Brief viewer
  
- [ ] **Description** (prepare):
  - Short description (132 chars max)
  - Detailed description highlighting:
    - Pre-meeting preparation focus (vs post-meeting tools)
    - Automatic calendar integration
    - AI-powered brief generation
    - Time savings (15-30 min per meeting)
  
- [ ] **Category**: Productivity or Workflow
- [ ] **Privacy Policy**: You already have `/privacy` page
- [ ] **Support URL**: Your website contact page

## 📋 Chrome Web Store Requirements

1. **Developer Account**: $5 one-time fee (pay via Chrome Web Store Developer Dashboard)
2. **Icons**: 16x16, 48x48, 128x128 PNG (you have section in manifest)
3. **Screenshots**: At least 1 required, 5 recommended
4. **Privacy Policy**: Must be publicly accessible URL (you have this)
5. **Single Purpose**: Extension should have one clear purpose ✅
6. **Permissions Justification**: Must explain why each permission is needed ✅

## 🎯 Submission Steps

1. Go to https://chrome.google.com/webstore/devconsole
2. Pay $5 developer registration fee (one-time)
3. Click "New Item" → Upload your ZIP file
4. Fill in:
   - Name: MeetingPrep AI
   - Description: [Your prepared description]
   - Category: Productivity
   - Screenshots: [Upload 3-5 screenshots]
   - Privacy Policy URL: https://meetingprep.ai/privacy
5. Submit for review (typically 1-3 days)

## ⚠️ Common Rejection Reasons
- Missing icons (you'll fix this)
- Permissions not justified (should be fine - you need calendar access)
- Privacy policy issues (you have one)
- Broken functionality (test thoroughly)
- Screenshots don't match actual extension

## 🚀 Quick Start (If You Have Icons Ready)

1. Test extension locally one more time
2. Create ZIP: Select all files in `meetingprep-extension` folder → Right-click → Send to → Compressed folder
3. Rename ZIP to something like `meetingprep-ai-v1.0.0.zip`
4. Upload to Chrome Web Store



