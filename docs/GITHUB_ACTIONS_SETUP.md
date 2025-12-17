# GitHub Actions Build Automation Setup Guide

This guide will help you set up automated iOS and Android builds using GitHub Actions.

## Overview

Once configured, GitHub Actions will:
- ✅ Build iOS app automatically on every push to `main`, `release`, or feature branches
- ✅ Build Android app automatically on every push to `main`, `release`, or feature branches
- ✅ Run builds in the cloud (no local machine needed)
- ✅ Store built apps as downloadable artifacts
- ✅ Provide build status on pull requests

## Prerequisites

Before you start, you need:

1. **Apple Developer Account** ($99/year)
   - For iOS code signing
   
2. **Google Play Console Account** ($25 one-time)
   - For Android app publishing
   
3. **Mac computer** (for initial certificate setup only)

4. **Admin access** to GitHub repository settings

## Part 1: iOS Code Signing Setup (30 minutes)

### Step 1: Create Distribution Certificate

1. Open **Xcode** on your Mac
2. Go to **Xcode → Preferences → Accounts**
3. Click **+** to add your Apple ID (if not already added)
4. Select your Apple ID → Select your team → Click **Manage Certificates**
5. Click **+** → Select **Apple Distribution**
6. Certificate is now created

### Step 2: Export Distribution Certificate

1. Open **Keychain Access** app
2. Select **My Certificates** in the sidebar
3. Find your "Apple Distribution" certificate
4. Right-click → **Export "Apple Distribution..."**
5. Save as `solidi-distribution.p12`
6. **Set a strong password** (you'll need this later)
7. Save the file securely

### Step 3: Get Provisioning Profile

1. Go to [Apple Developer Portal](https://developer.apple.com/account)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Profiles** in sidebar
4. Click **+** to create new profile
5. Select **App Store** distribution
6. Select your App ID (e.g., `com.solidifx.app`)
7. Select the distribution certificate you just created
8. Name it (e.g., "Solidi App Store Profile")
9. Download the `.mobileprovision` file

### Step 4: Convert to Base64

Open **Terminal** and run:

```bash
# Convert certificate to base64
base64 -i ~/Downloads/solidi-distribution.p12 | pbcopy
# Now paste into a text file as IOS_CERTIFICATE

# Convert provisioning profile to base64
base64 -i ~/Downloads/Solidi_App_Store_Profile.mobileprovision | pbcopy
# Now paste into a text file as IOS_PROVISIONING_PROFILE
```

### Step 5: Add iOS Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these 4 secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `IOS_CERTIFICATE` | Base64 string from Step 4 | Distribution certificate |
| `IOS_CERTIFICATE_PASSWORD` | Your p12 password | Certificate password |
| `IOS_PROVISIONING_PROFILE` | Base64 string from Step 4 | Provisioning profile |
| `KEYCHAIN_PASSWORD` | Any secure password | Temporary keychain password |

## Part 2: Android Keystore Setup (15 minutes)

### Step 1: Create Release Keystore

Open **Terminal** and run:

```bash
cd ~/Desktop
keytool -genkeypair -v -storetype PKCS12 \
  -keystore solidi-release.keystore \
  -alias solidi-release-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

You'll be asked for:
- **Keystore password** - Choose a strong password (save it!)
- **Key password** - Can be same as keystore password
- **Name, Organization, etc.** - Fill in your details

**⚠️ CRITICAL**: Save this keystore and passwords securely! You'll need them for all future updates.

### Step 2: Convert Keystore to Base64

```bash
base64 -i ~/Desktop/solidi-release.keystore | pbcopy
# Now paste into a text file as ANDROID_KEYSTORE
```

### Step 3: Add Android Secrets to GitHub

Add these 4 secrets in **GitHub → Settings → Secrets and variables → Actions**:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `ANDROID_KEYSTORE` | Base64 string from Step 2 | (long base64 string) |
| `ANDROID_KEYSTORE_PASSWORD` | Your keystore password | MyStr0ngP@ssw0rd |
| `ANDROID_KEY_ALIAS` | Key alias | solidi-release-key |
| `ANDROID_KEY_PASSWORD` | Your key password | MyStr0ngP@ssw0rd |

## Part 3: Update iOS Export Options (5 minutes)

Edit `ios/ExportOptions.plist`:

1. Find your **Team ID**:
   - Open Xcode → Preferences → Accounts
   - Select your Apple ID → Select team
   - Team ID is shown (e.g., "ABC123DEF4")

2. Find your **Bundle Identifier**:
   - Open `ios/SolidiMobileApp4.xcworkspace` in Xcode
   - Select project → Select target → General tab
   - Bundle Identifier is shown (e.g., "com.solidifx.app")

3. Update `ExportOptions.plist`:
   ```xml
   <key>teamID</key>
   <string>ABC123DEF4</string>  <!-- Your Team ID -->
   
   <key>provisioningProfiles</key>
   <dict>
       <key>com.solidifx.app</key>  <!-- Your Bundle ID -->
       <string>Solidi App Store Profile</string>  <!-- Profile name from Part 1 -->
   </dict>
   ```

## Part 4: Test the Automation (10 minutes)

### Test iOS Build

1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Add GitHub Actions build automation"
   git push origin feature/issue-112-github-actions-build
   ```

2. Go to **GitHub → Actions** tab
3. Watch the "Build iOS App" workflow run
4. Wait ~15-20 minutes for build to complete

### Test Android Build

1. Watch the "Build Android App" workflow (runs in parallel)
2. Wait ~10-15 minutes for build to complete

### Download Built Apps

1. In GitHub Actions, click on your completed workflow run
2. Scroll to **Artifacts** section
3. Download:
   - `ios-app-{sha}` - Contains `.ipa` file
   - `android-release-aab-{sha}` - Contains `.aab` bundle
   - `android-release-apk-{sha}` - Contains `.apk` file

## Part 5: Verify Builds Work

### Test iOS App

1. Download the `.ipa` file
2. Upload to TestFlight:
   - Go to [App Store Connect](https://appstoreconnect.apple.com)
   - Select your app → TestFlight
   - Click **+** → Upload new build
   - Select the `.ipa` file
3. Install on your iPhone via TestFlight

### Test Android App

1. Download the `.apk` file
2. Transfer to Android device
3. Enable "Install from unknown sources"
4. Install and test

## Troubleshooting

### iOS Build Fails: "No matching provisioning profiles found"

**Solution:**
- Verify Bundle ID in `ExportOptions.plist` matches your app
- Check Team ID is correct
- Ensure provisioning profile includes the distribution certificate

### iOS Build Fails: "User interaction is not allowed"

**Solution:**
- Check `IOS_CERTIFICATE_PASSWORD` secret is correct
- Verify certificate hasn't expired

### Android Build Fails: "Keystore was tampered with, or password was incorrect"

**Solution:**
- Verify `ANDROID_KEYSTORE_PASSWORD` matches the password you used when creating keystore
- Check `ANDROID_KEY_PASSWORD` is correct

### Build Times Out

**Solution:**
- Free tier has 6-hour timeout (should be enough)
- Check build logs for hung processes

### Can't Find Artifacts

**Solution:**
- Artifacts only created for `main` and `release` branch builds
- Feature branches create debug builds without artifacts
- Check workflow completed successfully

## Automatic Builds

Now, every time you push to `main` or `release`, GitHub will automatically:

1. ✅ Build iOS app
2. ✅ Build Android app
3. ✅ Create downloadable artifacts
4. ✅ Email you if build fails

No local machine needed! 🎉

## Monthly Costs

- **GitHub Actions**: FREE (2,000 minutes/month for private repos)
- **Apple Developer**: $99/year
- **Google Play**: $25 one-time

Each build uses ~15-20 minutes, so you can do ~100 builds/month for free.

## Next Steps

1. Add status badges to README.md
2. Set up automatic deployment to TestFlight
3. Set up automatic deployment to Play Store Internal Testing
4. Configure build notifications

## Support

If you encounter issues:
1. Check workflow logs in GitHub Actions tab
2. Review secret values are correct
3. Verify certificates haven't expired
4. Check this guide's troubleshooting section

## Security Notes

⚠️ **Never commit these files to Git:**
- `.p12` certificate files
- `.keystore` files
- Passwords or API keys
- Provisioning profiles

✅ **Only store in GitHub Secrets (encrypted)**

---

**Setup Complete!** You now have automated builds running in the cloud. 🚀
