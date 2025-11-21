# How to Get a New Plant.id API Key

## 🌿 Plant.id API Key Guide

**One API key works for BOTH:**
- ✅ Leaf Identification
- ✅ Disease Detection

---

## 📝 Step-by-Step: Get Your API Key

### Step 1: Visit Plant.id Website

**Go to:** https://web.plant.id/

### Step 2: Sign Up / Log In

1. Click **"Sign Up"** (if new user) or **"Log In"** (if existing)
2. Create account with:
   - Email address
   - Password
   - Or sign up with Google/GitHub

### Step 3: Get Your API Key

1. After logging in, go to **"API"** section or **"Dashboard"**
2. Look for **"API Keys"** or **"Generate API Key"**
3. Click **"Create New API Key"** or **"Generate"**
4. **Copy your API key** (it will look like: `X4w0EbWlXCsJQ855ymnb5rAcceZxazDaJawMJj35mev4XDdXw4`)

### Step 4: Check Your API Credits

- Free tier usually includes: **500 requests/month**
- Check your dashboard for available credits
- You can upgrade if needed

---

## 🔧 Step 5: Update Your Backend

### Update `.env` File

**Location:** `C:\Users\kirti\OneDrive\Desktop\Agrochain_2.0\backend_agro\.env`

**Replace the old key with your new key:**

```env
PORT=4001
MODE=mock
PLANT_ID_KEY=YOUR_NEW_API_KEY_HERE
```

**Example:**
```env
PORT=4001
MODE=mock
PLANT_ID_KEY=abc123xyz456newkey789
```

### Step 6: Restart Backend Server

**IMPORTANT:** You must restart the backend after updating the key!

```bash
# Stop current server (Ctrl+C)
# Then restart:
cd C:\Users\kirti\OneDrive\Desktop\Agrochain_2.0\backend_agro
npm start
```

**Verify it loaded:**
- Console should show: `PLANT_ID_KEY set=true`
- Should NOT show warning about missing key

---

## 🧪 Step 7: Test Your New API Key

**Run the test script:**

```bash
cd C:\Users\kirti\OneDrive\Desktop\Agrochain_2.0\backend_agro
node test-plant-id-api.js
```

**You should see:**
```
🔑 API Key found: abc123xyz4...
🧪 Testing Plant.id API...

✅ API is working!
Response status: 200
Suggestions count: 1

🎉 Your Plant.id API is configured correctly!
```

---

## ✅ What This API Key Does

**One key works for:**

1. **Leaf Identification** (`/api/images/upload`)
   - Identifies plant species
   - Shows plant name, scientific name
   - Provides plant details

2. **Disease Detection** (`/api/disease/detect`)
   - Identifies plant diseases
   - Shows health status (healthy/diseased)
   - Provides disease information
   - Suggests treatments

**Both use the same endpoint:** `https://api.plant.id/v2/identify`

---

## 🆓 Free Tier Limits

- **500 API requests per month** (free tier)
- Each image upload = 1 request
- Each disease detection = 1 request

**To check your usage:**
- Log into Plant.id dashboard
- Check "Usage" or "API Calls" section

---

## 🔑 Alternative: If You Can't Find API Key Section

1. **Check Account Settings:**
   - Go to your profile/account settings
   - Look for "API" or "Developer" section

2. **Check Documentation:**
   - Visit: https://web.plant.id/api-docs
   - Look for "Getting Started" or "API Keys"

3. **Contact Support:**
   - Email: support@plant.id
   - Or use their contact form

---

## ⚠️ Important Notes

1. **Keep your API key secret!**
   - Don't share it publicly
   - Don't commit it to GitHub
   - Only use it in `.env` file (which is in `.gitignore`)

2. **API Key Format:**
   - Usually 40-50 characters long
   - Mix of letters and numbers
   - Example: `X4w0EbWlXCsJQ855ymnb5rAcceZxazDaJawMJj35mev4XDdXw4`

3. **If Key Doesn't Work:**
   - Check if you copied it completely
   - Make sure no extra spaces
   - Verify it's active in Plant.id dashboard
   - Check if you have API credits remaining

---

## 🎯 Quick Checklist

- [ ] Signed up/Logged into Plant.id
- [ ] Generated new API key
- [ ] Copied the key
- [ ] Updated `.env` file with new key
- [ ] Restarted backend server
- [ ] Tested with `node test-plant-id-api.js`
- [ ] Verified: `PLANT_ID_KEY set=true` in console

---

## 🚀 After Setup

Your new API key will work for:
- ✅ Leaf Identification
- ✅ Disease Detection

**Both features use the same key automatically!**

---

**Need help?** Check Plant.id documentation: https://web.plant.id/api-docs














