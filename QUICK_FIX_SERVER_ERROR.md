# Quick Fix: Disease Detection Server Error

## 🚨 Most Common Issue: Backend Server Not Running

### Step 1: Start Your Backend Server

**Open a NEW terminal window and run:**
```bash
cd C:\Users\kirti\OneDrive\Desktop\Agrochain_2.0\backend_agro
npm start
```

**You should see:**
```
AgroChain backend listening on http://0.0.0.0:4001
MODE=mock; PLANT_ID_KEY set=true
```

**Keep this terminal open!** The server must be running.

---

### Step 2: Check Your IP Address

**In PowerShell, run:**
```bash
ipconfig
```

**Look for your IPv4 Address** (e.g., `10.24.203.176`)

---

### Step 3: Update Backend URL (if needed)

**Open:** `constants/backend.ts`

**Make sure it matches your IP:**
```typescript
const LAN_IP = "10.24.203.176"; // <-- Your actual IP from Step 2
export const BACKEND_BASE = `http://${LAN_IP}:4001`;
```

**Important:**
- **Android Emulator:** Use `http://10.0.2.2:4001`
- **Real Device:** Use `http://YOUR_IP:4001` (your computer's IP)
- **iOS Simulator:** Use `http://localhost:4001`

---

### Step 4: Test the Connection

**In your app:**
1. Open Disease Detection page
2. Select an image
3. Click "Analyze"
4. **Check the console logs** - you should see:
   ```
   Sending request to: http://10.24.203.176:4001/api/disease/detect
   ```

**In backend terminal, you should see:**
```
Disease detection request received
File received: photo.jpg 123456 bytes
Calling Plant.id API...
Plant.id API response status: 200
```

---

## 🔍 What the Error Messages Mean

### "Network request failed" or "Cannot connect"
→ **Backend server is not running** or wrong IP address

### "Error 400: No file uploaded"
→ Image wasn't selected before clicking Analyze

### "Error 401" or "Invalid API key"
→ Plant.id API key issue - check `.env` file

### "Error 500: Server error"
→ Check backend console for detailed error

---

## ✅ Quick Checklist

- [ ] Backend server is running (`npm start` in `backend_agro` folder)
- [ ] Backend shows: `PLANT_ID_KEY set=true`
- [ ] IP address in `constants/backend.ts` is correct
- [ ] Phone/emulator is on same WiFi network as computer
- [ ] Image is selected before clicking "Analyze"
- [ ] Check both frontend and backend console logs

---

## 🧪 Test Backend Directly

**Open browser and visit:**
```
http://localhost:4001/health
```

**Should return:**
```json
{"ok":true,"now":1234567890}
```

If this doesn't work, your backend is not running!

---

## 📱 Still Not Working?

1. **Check Windows Firewall:**
   - Allow Node.js through firewall
   - Allow port 4001

2. **Check Network:**
   - Phone and computer must be on same WiFi
   - Try disabling VPN if you have one

3. **Check Console Logs:**
   - Frontend: Look for "Sending request to..." message
   - Backend: Look for "Disease detection request received" message

4. **Try Different IP:**
   - If using emulator, try `10.0.2.2:4001`
   - If using real device, make sure IP is correct

---

## 🎯 Most Likely Solution

**99% of the time, the issue is:**
1. Backend server is not running → Start it with `npm start`
2. Wrong IP address → Update `constants/backend.ts`

**After fixing, restart your app and try again!**














