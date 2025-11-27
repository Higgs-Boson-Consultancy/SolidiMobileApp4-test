# Firebase FCM Setup Guide

## Step-by-Step Instructions to Get FCM Credentials

### Prerequisites
- A Google account (Gmail or company email)
- Package name: `com.solidimobileapp4test`

---

## Part 1: Create Firebase Project

### 1. Go to Firebase Console
- Open [https://console.firebase.google.com/](https://console.firebase.google.com/)
- Sign in with your Google account

### 2. Create New Project
1. Click **"Add project"** or **"Create a project"**
2. Enter project name: `Solidi Mobile App` (or your preferred name)
3. Click **Continue**
4. **Disable** Google Analytics (optional, not needed for FCM)
5. Click **Create project**
6. Wait for project creation (~30 seconds)
7. Click **Continue**

---

## Part 2: Add Android App to Project

### 1. Add Android App
1. On the project overview page, click the **Android icon** (robot icon)
2. Or click **Project settings** (gear icon) → **General** → **Add app** → **Android**

### 2. Register App
Fill in the registration form:

**Android package name** (required):
```
com.solidimobileapp4test
```

**App nickname** (optional):
```
Solidi Mobile App
```

**Debug signing certificate SHA-1** (optional, skip for now):
```
Leave blank
```

Click **Register app**

### 3. Download Configuration File
1. Click **Download google-services.json**
2. Save the file to your computer
3. **Important**: You'll need to place this file at:
   ```
   /Users/henry/Solidi/SolidiMobileApp4/android/app/google-services.json
   ```
4. Click **Next**
5. Click **Next** again (skip SDK setup instructions)
6. Click **Continue to console**

---

## Part 3: Get FCM Server Key (for AWS SNS)

### 1. Open Project Settings
1. Click the **gear icon** (⚙️) next to "Project Overview"
2. Select **Project settings**

### 2. Navigate to Cloud Messaging
1. Click the **Cloud Messaging** tab at the top
2. Scroll down to the **Cloud Messaging API (Legacy)** section

### 3. Enable Cloud Messaging API (if needed)
If you see a message saying "Cloud Messaging API is disabled":
1. Click the **⋮** (three dots) menu
2. Click **Manage API in Google Cloud Console**
3. Click **Enable** button
4. Wait for API to enable (~30 seconds)
5. Go back to Firebase Console

### 4. Copy Server Key
1. Find **Server key** in the Cloud Messaging API (Legacy) section
2. Click the **copy icon** next to the server key
3. **Save this key** - you'll need it for AWS SNS configuration
AIzaSyAN3GH2Nn7_xHEfnNaQhC0acNOrLYMx3G0
**Example format** (yours will be different):
```
AAAAxxxxxxx:APA91bFxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 5. Copy Sender ID
1. Still in the Cloud Messaging tab
2. Find **Sender ID** (also called Project Number)
3. Copy this number
4. **Save this ID** - you'll need it in the Android app configuration
752370325718

**Example format**:
```
123456789012
```

---

## Part 4: What You Should Have Now

After completing these steps, you should have:

✅ **Firebase project created**
✅ **Android app registered** with package name `com.solidimobileapp4test`
✅ **google-services.json file** downloaded
✅ **FCM Server Key** (starts with `AAAA...`)
✅ **Sender ID** (12-digit number)

---

## Part 5: File Placement

### Place google-services.json
Move the downloaded file to:
```bash
/Users/henry/Solidi/SolidiMobileApp4/android/app/google-services.json
```

You can do this via:
- Drag and drop in Finder
- Or use terminal:
  ```bash
  mv ~/Downloads/google-services.json /Users/henry/Solidi/SolidiMobileApp4/android/app/
  ```

---

## Part 6: Provide Credentials

Once you have the credentials, provide them:

1. **FCM Server Key**: For AWS SNS configuration
2. **Sender ID**: For Android app configuration
3. **google-services.json**: Place in `android/app/` directory

---

## Troubleshooting

### Can't find Server Key?
- Make sure you're in the **Cloud Messaging** tab
- Look for **Cloud Messaging API (Legacy)** section
- If not visible, you may need to enable the Cloud Messaging API first

### google-services.json not downloading?
- Try a different browser
- Check your Downloads folder
- You can re-download it anytime from Project Settings → General → Your apps

### Need to regenerate keys?
- You can regenerate the Server Key from the Cloud Messaging settings
- **Warning**: Regenerating will invalidate the old key

---

## Security Notes

⚠️ **Keep these credentials secure:**
- FCM Server Key is sensitive - don't commit to public repositories
- Add `google-services.json` to `.gitignore`
- Only share with authorized team members

---

## Next Steps

After getting the credentials:
1. Place `google-services.json` in the correct location
2. Provide FCM Server Key for AWS SNS setup
3. Continue with Android push notification implementation

---

## Questions?

If you encounter any issues during this process, note:
- Which step you're stuck on
- Any error messages you see
- Screenshots can be helpful
