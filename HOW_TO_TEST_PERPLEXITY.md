# 🧪 How to Test Perplexity Integration

## 📍 Where is the Test File?

**File Name:** `test-perplexity.html`
**Location:** Root folder of your project (same folder as `index.html`)

---

## 🚀 How to Use It

### **Method 1: Direct Open** (Easiest)
1. Find `test-perplexity.html` in your project folder
2. **Double-click** it
3. It will open in your browser
4. Click **"Run All Tests"**

### **Method 2: With Local Server**
```bash
# Start server
python -m http.server 8000

# Then open in browser:
http://localhost:8000/test-perplexity.html
```

---

## 🎯 What It Does

The test file checks 4 things:

### ✅ **Test 1: Code Configuration**
- Checks if Perplexity API is configured in `js/script.js`
- Verifies API key is present
- Confirms hybrid mode is enabled

### ✅ **Test 2: Method Detection**
- Checks if `shouldUsePerplexity()` method exists
- Checks if `fetchPerplexityInsights()` method exists
- Verifies methods are properly integrated

### ✅ **Test 3: Trigger Keywords**
- Tests if the right queries trigger Perplexity
- Examples: "latest news", "sentiment", "predictions"

### ✅ **Test 4: Live API Connection**
- Makes a real call to Perplexity API
- Verifies your API key works
- Uses 1 request from your quota

---

## 📊 How to Read Results

### **Green (✅) = PASS**
```
✅ Test 1: Code Configuration
   All configuration is correct!
```
**Meaning:** That part is working correctly!

### **Red (❌) = FAIL**
```
❌ Test 1: Code Configuration
   Some configuration is missing
```
**Meaning:** Something needs to be fixed!

---

## 🔧 What to Do After Testing

### **If ALL Tests Pass (4/4)** ✅

1. **Clear your browser cache:**
   - Press `Ctrl + Shift + Delete` (Windows)
   - Press `Cmd + Shift + Delete` (Mac)
   - Select "Cached images and files"
   - Click "Clear data"

2. **Hard refresh your main app:**
   - Press `Ctrl + F5` (Windows)
   - Press `Cmd + Shift + R` (Mac)

3. **Test in your main app:**
   - Open `index.html`
   - Press `F12` to open console
   - Type: `"What's the latest Bitcoin news?"`
   - Look for: `🌐 Using Perplexity AI...` in console

4. **Success looks like this in console:**
   ```
   🌐 Using Perplexity AI for real-time insights...
   ✅ Perplexity insights received
   📚 Citations: 3
   ```

### **If Some Tests Fail** ❌

Read the error messages in each test result. They will tell you exactly what's wrong and how to fix it!

**Common Issues:**

1. **Test 1 fails** → Code not saved properly
   - Solution: Re-save `js/script.js`

2. **Test 2 fails** → Methods missing
   - Solution: Check if all code was added

3. **Test 3 fails** → Trigger logic issue
   - Solution: Usually OK, try Test 4

4. **Test 4 fails** → API key problem
   - Solution: Check API key in Perplexity account

---

## 💡 Quick Troubleshooting

### **Issue: "Could not load script.js"**
**Fix:** Make sure you're in the right folder (same folder as index.html)

### **Issue: "API Key Error (401/403)"**
**Fix:** API key may be invalid. Check your Perplexity account.

### **Issue: "Rate Limit (429)"**
**Fix:** Too many requests. Wait 1 minute and try again.

### **Issue: "Network Error"**
**Fix:** Check your internet connection.

---

## 🎯 The Key Thing to Look For

After testing, when you use your main app:

**✅ Perplexity IS Working:**
```
Console shows: 🌐 Using Perplexity AI...
Response includes: Real-time news with citations
```

**❌ Perplexity is NOT Working:**
```
Console shows: Only Gemini API messages
Response has: No citations or web insights
AI says: "I'm trained by Google"
```

---

## 📝 Test Queries for Main App

After the test passes, try these in your main app:

```
✅ "What's the latest Bitcoin news?"
✅ "Recent Ethereum updates today"  
✅ "What's the market sentiment?"
✅ "Bitcoin predictions for 2025"
✅ "What's happening with crypto?"
```

---

## 🚨 Still Not Working?

If tests pass but Perplexity still doesn't work in main app:

1. **Clear cache again** (browsers cache aggressively!)
2. **Close browser completely** and reopen
3. **Check console** (F12) for any JavaScript errors
4. **Try private/incognito mode** (no cache)

---

## 📸 What Success Looks Like

**Test File:**
```
✅ Test 1: Code Configuration - PASS
✅ Test 2: Method Detection - PASS  
✅ Test 3: Trigger Keywords - PASS
✅ Test 4: Live API Connection - PASS

🎉 All tests passed! (4/4)
```

**Main App Console:**
```
🌐 Using Perplexity AI for real-time insights...
🌐 Querying Perplexity AI: What's the latest Bitcoin news?
✅ Perplexity insights received
📚 Citations: 3
```

**Main App Response:**
```
🌐 REAL-TIME WEB INSIGHTS (PERPLEXITY AI)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ LATEST MARKET INTELLIGENCE FROM THE WEB:
[Real-time news]

📚 SOURCES & CITATIONS:
1. coindesk.com/...
2. bloomberg.com/...
```

---

## ⚡ Quick Reference

| File | Purpose | How to Open |
|------|---------|-------------|
| `test-perplexity.html` | Test Perplexity integration | Double-click |
| `index.html` | Your main crypto AI app | Double-click |
| `js/script.js` | Contains Perplexity code | Edit with code editor |

---

**File Location:** `test-perplexity.html` is in your project root folder! 📁

**Quick Test:** Just double-click it and click "Run All Tests"! 🚀



