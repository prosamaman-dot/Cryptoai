# 🎤 Voice Input - Mobile Permission Guide

## Problem: Voice Not Working on Mobile App

When you use SamCrypto AI as a PWA (Progressive Web App) on mobile, you need to grant microphone permission for voice input to work.

---

## ✅ How to Enable Microphone Permission

### 📱 **For Android (Chrome/Edge/Samsung Internet)**

#### Method 1: During First Use
1. Click the **microphone button** (🎤)
2. A popup appears: **"Allow [site] to use your microphone?"**
3. Tap **"Allow"** ✅

#### Method 2: In Browser Settings
If you accidentally denied permission:

**Chrome:**
1. Open Chrome
2. Go to `chrome://settings/content/microphone`
3. Find **SamCrypto AI** in blocked list
4. Tap it → Select **"Allow"**

**Or manually:**
1. Open Chrome → Three dots (⋮) → **Settings**
2. **Site settings** → **Microphone**
3. Find your site → Change to **"Allow"**

#### Method 3: Android System Settings
1. Go to **Settings** → **Apps**
2. Find **Chrome** (or your browser)
3. **Permissions** → **Microphone** → **Allow**

---

### 🍎 **For iPhone/iPad (Safari)**

#### Method 1: During First Use
1. Click the **microphone button** (🎤)
2. A popup appears: **"Would Like to Access the Microphone"**
3. Tap **"Allow"** ✅

#### Method 2: iOS Settings
If you denied permission or it's not working:

1. Open **Settings** app
2. Scroll down to **Safari**
3. Tap **Microphone**
4. Select **"Allow"** or **"Ask"**

#### Method 3: Per-Site Settings (iOS 15+)
1. Open **Settings** → **Safari**
2. Scroll to **Settings for Websites**
3. Tap **Microphone**
4. Find your site → Select **"Allow"**

#### For Installed PWA (Home Screen App):
1. **Settings** → scroll to your app name
2. Enable **Microphone** toggle

---

### 💻 **For Desktop (Windows/Mac)**

#### Chrome/Edge:
1. Click the **🎤 icon** in address bar (right side)
2. **Microphone** → Change to **"Allow"**
3. Or go to `chrome://settings/content/microphone`

#### Firefox:
1. Click the **🔒 lock icon** in address bar
2. **Permissions** → **Microphone** → **Allow**

#### Safari (Mac):
1. **Safari** menu → **Settings for This Website**
2. **Microphone** → **Allow**

---

## 🔧 Troubleshooting

### Voice button does nothing when clicked:

**Check 1: Permission Status**
- Open browser console (F12)
- You should see: `✅ Microphone permission granted`
- If you see `❌ Microphone permission denied`, follow steps above

**Check 2: Browser Support**
- ✅ Chrome (desktop & mobile)
- ✅ Edge (desktop & mobile)
- ✅ Safari (iOS 14.5+)
- ❌ Firefox (not supported yet)

**Check 3: HTTPS Required**
- Voice input only works on **HTTPS** websites (secure)
- If testing locally, use `localhost` or `127.0.0.1`

**Check 4: Microphone Hardware**
- Ensure your device has a working microphone
- Test with another app (Voice Recorder, etc.)

---

## 📱 PWA Installation (For Full App Experience)

### Android:
1. Open the site in **Chrome**
2. Tap **Menu (⋮)** → **Install app** or **Add to Home Screen**
3. App icon appears on home screen
4. Grant microphone permission when prompted

### iOS:
1. Open the site in **Safari**
2. Tap **Share button** (📤)
3. Scroll and tap **Add to Home Screen**
4. Grant microphone permission in Settings

---

## 🎯 Testing Voice Input

### Step 1: Click Microphone Button
- Button should turn **red** and **pulse**
- You should see: **"🎤 Listening..."**

### Step 2: Speak Clearly
Say: **"Tell me about Bitcoin"**

### Step 3: Check Results
- Text appears in input box
- Status shows: **"✓ Speech captured"**
- Click **Send** button

---

## 📞 Still Not Working?

### Check Console Logs:
1. Open DevTools (F12 or long-press on mobile)
2. Go to **Console** tab
3. Look for messages:
   - `🎤 Requesting microphone permission...` ← Should appear
   - `✅ Microphone permission granted` ← Good!
   - `❌ Microphone permission denied` ← Need to fix permissions

### Common Error Messages:

| Error | Solution |
|-------|----------|
| "Speech recognition not supported" | Use Chrome or Safari (not Firefox) |
| "Microphone access denied" | Follow permission steps above |
| "No microphone found" | Check hardware or plug in mic |
| "Not allowed" | Enable HTTPS or use localhost |

---

## 🔒 Privacy & Security

**Your Voice Data:**
- Voice is processed **locally** by your browser
- Speech recognition uses **Google/Apple APIs** (built into browser)
- No audio is recorded or stored on servers
- Only the **text transcript** is sent to the chat

**Permissions:**
- You can **revoke** microphone access anytime in settings
- The app will ask again next time you use voice input

---

## ✅ Success Checklist

- [ ] Microphone permission is **"Allow"** (not "Ask" or "Block")
- [ ] Using a **supported browser** (Chrome/Safari)
- [ ] Site is accessed via **HTTPS** (or localhost)
- [ ] Device microphone is **working** (test with other apps)
- [ ] PWA is **installed** (optional but recommended)
- [ ] No ad blockers blocking microphone access

---

## 🎉 Once Working

You'll see:
1. **Red pulsing mic button** when recording
2. **"🎤 Listening..."** status message
3. **Real-time text** appearing in input box
4. **"✓ Speech captured"** when done

Now you can ask questions using your voice! 🎤🚀

---

**Need More Help?**

If voice input still doesn't work after following this guide, open the browser console (F12) and take a screenshot of any errors. This will help diagnose the specific issue.
