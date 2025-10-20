# 📥📤 Export / Import Data Guide

## ✨ New Feature: Backup & Restore Your Data!

You can now **export** your portfolio data to a JSON file and **import** it back anytime. Perfect for:
- ✅ Backing up your data
- ✅ Transferring between devices
- ✅ Keeping multiple portfolios
- ✅ Restoring after browser clear

---

## 📥 How to Export Data

### Step 1: Login
Make sure you're logged in to your account.

### Step 2: Open Features
Click the **Features** button (☰ icon) in the top right.

### Step 3: Click "Export Data"
Click on the **"Export Data"** card.

### Step 4: Download
A JSON file will automatically download:
```
samcrypto_data_YourName_2025-10-19.json
```

### What's Included:
- ✅ Your portfolio (all holdings)
- ✅ USDT balance
- ✅ Price alerts
- ✅ Conversation history
- ✅ User preferences
- ✅ Trading history

---

## 📤 How to Import Data

### Step 1: Login
Make sure you're logged in to your account.

### Step 2: Open Features
Click the **Features** button (☰ icon) in the top right.

### Step 3: Click "Import Data"
Click on the **"Import Data"** card.

### Step 4: Select File
A file picker will open. Select your exported `.json` file.

### Step 5: Confirm
You'll see a preview:
```
Import data from 10/19/2025?

This will replace your current data:
- Portfolio: 3 holdings
- USDT Balance: $10,000.00
- Alerts: 2 active
- Conversations: 15 saved

Current data will be backed up first.
```

Click **OK** to import, or **Cancel** to abort.

### Step 6: Done!
Your data is imported and the page will reload automatically.

---

## 🛡️ Safety Features

### Automatic Backup
When you import data, your **current data is automatically backed up** to:
```
localStorage: samcrypto_backup_youremail@example.com
```

### Data Validation
The import process checks:
- ✅ Valid JSON format
- ✅ Correct data structure
- ✅ Version compatibility

### Keeps Your Login
Your **email and password** are never changed during import. Only your portfolio data is updated.

---

## 📋 Use Cases

### 1. **Regular Backups**
Export your data weekly to keep backups:
```
samcrypto_data_YourName_2025-10-12.json
samcrypto_data_YourName_2025-10-19.json
samcrypto_data_YourName_2025-10-26.json
```

### 2. **Device Transfer**
Moving to a new device or browser:
1. Export from old device
2. Login on new device
3. Import the file

### 3. **Multiple Portfolios**
Test different strategies:
1. Export your main portfolio → `main_portfolio.json`
2. Make changes and test
3. Import `main_portfolio.json` to restore

### 4. **Share with Others**
You can share your portfolio setup (be careful with personal data!):
1. Export your data
2. Remove sensitive info if needed
3. Share the JSON file

---

## 🔧 Technical Details

### Export File Format
```json
{
  "user": {
    "name": "Your Name",
    "email": "your@email.com",
    "portfolio": {
      "usdtBalance": 10000,
      "holdings": [...],
      "totalValue": 15234.56
    },
    "alerts": [...],
    "conversationHistory": [...],
    "preferences": {...}
  },
  "exportDate": "2025-10-19T08:29:00.000Z",
  "version": "1.0"
}
```

### Storage Location
Data is stored in browser's `localStorage`:
- Users: `samcrypto_users`
- Current user: `samcrypto_current_user`
- Backups: `samcrypto_backup_email@example.com`

---

## ⚠️ Important Notes

### Data Privacy
- ✅ All data stays **local** (in your browser)
- ✅ No data sent to servers
- ✅ You control your JSON files

### File Location
The exported JSON file downloads to your browser's default **Downloads** folder.

### Import Overwrites
Importing **replaces** your current data. Make sure to:
1. Export current data first (if you want to keep it)
2. Confirm you're importing the correct file

### Browser Clear Warning
If you clear your browser data/cookies, you'll lose your portfolio. **Export regularly** to prevent data loss!

---

## 🆘 Troubleshooting

### "Failed to import data"
- ✅ Check the file is a valid JSON
- ✅ Make sure it's a SamCrypto export file
- ✅ Try exporting again and re-importing

### "Please login first"
- ✅ You must be logged in to import/export
- ✅ Login and try again

### File won't download
- ✅ Check browser permissions
- ✅ Allow downloads from the site
- ✅ Check Downloads folder

---

## 📱 Works Everywhere

Export/Import works on:
- ✅ Desktop browsers (Chrome, Firefox, Edge, Safari)
- ✅ Mobile browsers (Chrome, Safari, Samsung Internet)
- ✅ PWA (Progressive Web App mode)

---

## 🎯 Quick Start

**Backup your data right now:**
1. Click **Features** ☰
2. Click **Export Data**
3. Save the file somewhere safe (Google Drive, Dropbox, USB drive)

**Done!** You now have a backup of your portfolio. 🎉

---

## 💡 Pro Tips

### 1. Regular Backups
Set a reminder to export your data weekly.

### 2. Name Your Files
Rename files to track them:
```
main_portfolio_before_bitcoin_trade.json
test_strategy_altcoins.json
backup_2025_10_19.json
```

### 3. Cloud Storage
Upload your JSON backups to cloud storage (Google Drive, Dropbox, OneDrive).

### 4. Version Control
Keep old exports to track your portfolio history over time.

---

**You're all set! Your data is now portable and safe.** 🚀📥📤
