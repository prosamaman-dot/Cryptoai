# 🧪 Test Authentication - Step by Step

## ✅ How to Test

### Step 1: Clear Everything
Open browser console (F12) and run:
```javascript
localStorage.clear()
```
Then refresh the page (Ctrl+R)

### Step 2: Sign Up
1. Click **"Sign Up"** button
2. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: Test123456!
   - Confirm: Test123456!
3. Click **"Create Account"**

### Step 3: Check Console
You should see:
```
📊 Loaded users database: 1 users
✅ User registered: test@example.com
💾 Users database saved: 1 users
📦 Auto-backup created
✅ Registration complete. User logged in: Test User
```

### Step 4: Refresh Page (F5)
After refresh, check console:
```
📊 Loaded users database: 1 users
🔑 Initializing authentication...
🔐 Session: User: user_xxxxx
👥 Database has 1 users
✅ Session valid! Logging in: Test User
✅ User restored: Test User
🎯 Auth initialized. Logged in: true
```

### Step 5: Verify UI
- ✅ Header shows: "Welcome, Test User!"
- ✅ Avatar shows: "TU"
- ✅ Login/Sign Up buttons are **HIDDEN**

---

## 📊 View Your Database

### In Browser Console:
```javascript
// View all users
JSON.parse(localStorage.getItem('samcrypto_users'))

// View current session
JSON.parse(localStorage.getItem('samcrypto_session'))

// View auto-backup
JSON.parse(localStorage.getItem('samcrypto_backup'))
```

---

## 💾 Export/Import Database (Like SQL)

### Export Database to data.json
```javascript
window.samCrypto.userManager.exportDatabase()
```
This downloads: `samcrypto_database_2025-10-18.json`

### Import Database from JSON
1. Open DevTools Console
2. Run:
```javascript
// Read your data.json file content and paste here:
const jsonData = `{
  "version": "1.0",
  "timestamp": "...",
  "users": {...}
}`;

window.samCrypto.userManager.importDatabase(jsonData)
```

---

## 🔧 Debug Commands

### Check if logged in:
```javascript
console.log('Logged in:', window.samCrypto.userManager.isLoggedIn())
console.log('Current user:', window.samCrypto.userManager.getCurrentUser())
```

### Force UI sync:
```javascript
window.samCrypto.userManager.syncAuthUI()
```

### Manual login test:
```javascript
window.samCrypto.userManager.login('test@example.com', 'Test123456!', true)
```

---

## ❌ If Still Logging Out

### Check these in console:
1. **Users loaded?**
```javascript
Object.keys(JSON.parse(localStorage.getItem('samcrypto_users') || '{}')).length
```
Should show: `1` (or more)

2. **Session exists?**
```javascript
localStorage.getItem('samcrypto_session')
```
Should show JSON with userId

3. **Body class set?**
```javascript
document.body.classList.contains('logged-in')
```
Should show: `true`

4. **Buttons hidden?**
```javascript
document.getElementById('authButtons').style.display
```
Should show: `"none"`

---

## 🎯 Expected Behavior

### After Signup:
- ✅ User saved to localStorage (like SQL INSERT)
- ✅ Session created (30 days expiry)
- ✅ Auto-backup created
- ✅ UI updated (buttons hidden, name shown)
- ✅ Body class added: `logged-in`

### After Refresh:
- ✅ Users loaded from localStorage (like SQL SELECT)
- ✅ Session checked and validated
- ✅ User restored from database
- ✅ UI synced automatically
- ✅ Stay logged in!

### After Login:
- ✅ Password verified
- ✅ Last login updated in database (like SQL UPDATE)
- ✅ Session created
- ✅ UI updated immediately

---

## 📁 Database Structure

Your data is stored in localStorage like this:

### `samcrypto_users` (Main Database)
```json
{
  "user_1729XXX_abc123": {
    "id": "user_1729XXX_abc123",
    "name": "Test User",
    "email": "test@example.com",
    "password": "hashedXXX",
    "createdAt": 1729XXX,
    "lastLogin": 1729XXX,
    "preferences": {...},
    "portfolio": {...},
    "alerts": [],
    "chatHistory": [],
    "stats": {...}
  }
}
```

### `samcrypto_session` (Active Session)
```json
{
  "userId": "user_1729XXX_abc123",
  "loginTime": 1729XXX,
  "expiresAt": 1729XXX + (30 days),
  "rememberMe": true
}
```

### `samcrypto_backup` (Auto-Backup)
```json
{
  "version": "1.0",
  "timestamp": "2025-10-18T20:30:00.000Z",
  "users": {...},
  "totalUsers": 1
}
```

---

## 🚀 This Works Like SQL

| SQL Command | localStorage Equivalent |
|-------------|------------------------|
| `CREATE DATABASE` | Initialize `samcrypto_users` |
| `INSERT INTO users` | `users[userId] = newUser; saveUsers()` |
| `SELECT * FROM users` | `loadUsers()` |
| `UPDATE users` | `users[userId] = updatedUser; saveUsers()` |
| `DELETE FROM users` | `delete users[userId]; saveUsers()` |
| `BACKUP DATABASE` | `exportDatabase()` to JSON |
| `RESTORE DATABASE` | `importDatabase(jsonData)` |

---

## ✅ Success Criteria

After refresh, you should see:
1. ✅ Console: "✅ User restored: [Your Name]"
2. ✅ Header: "Welcome, [Your Name]!"  
3. ✅ No Login/Sign Up buttons visible
4. ✅ User avatar with initials
5. ✅ `body.logged-in` class exists

**If you see all 5, authentication is working perfectly!**
