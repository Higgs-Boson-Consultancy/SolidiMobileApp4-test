# GitHub Actions Workflows

This directory contains automated build workflows for the Solidi Mobile App.

## Workflows

### 1. `build-ios.yml` - iOS Build Pipeline
Automatically builds iOS app when code is pushed to `main`, `release`, or feature branches.

**Triggers:**
- Push to `main`, `release`, or `feature/**` branches
- Pull requests to `main` or `release`
- Manual trigger via GitHub Actions UI

**Build Types:**
- **Debug builds**: For PRs and feature branches (no code signing required)
- **Release builds**: For `main` and `release` branches (requires code signing)

**Outputs:**
- `.ipa` file (release builds only)
- Build logs (on failure)

### 2. `build-android.yml` - Android Build Pipeline
Automatically builds Android app when code is pushed to `main`, `release`, or feature branches.

**Triggers:**
- Push to `main`, `release`, or `feature/**` branches
- Pull requests to `main` or `release`
- Manual trigger via GitHub Actions UI

**Build Types:**
- **Debug APK**: For PRs and feature branches
- **Release AAB + APK**: For `main` and `release` branches (requires keystore)

**Outputs:**
- `.apk` file (debug or release)
- `.aab` file (release builds only - for Play Store)
- Build logs (on failure)

## Setup Required

### iOS Code Signing Secrets

Add these secrets in **GitHub Repository Settings → Secrets and variables → Actions**:

1. `IOS_CERTIFICATE` - Base64 encoded .p12 distribution certificate
   ```bash
   base64 -i YourCertificate.p12 | pbcopy
   ```

2. `IOS_CERTIFICATE_PASSWORD` - Password for the .p12 certificate

3. `IOS_PROVISIONING_PROFILE` - Base64 encoded provisioning profile
   ```bash
   base64 -i YourProfile.mobileprovision | pbcopy
   ```

4. `KEYCHAIN_PASSWORD` - Any secure password for temporary keychain

### Android Signing Secrets

Add these secrets in **GitHub Repository Settings → Secrets and variables → Actions**:

1. `ANDROID_KEYSTORE` - Base64 encoded keystore file
   ```bash
   base64 -i your-release-key.keystore | pbcopy
   ```

2. `ANDROID_KEYSTORE_PASSWORD` - Keystore password

3. `ANDROID_KEY_ALIAS` - Key alias from keystore

4. `ANDROID_KEY_PASSWORD` - Key password

### Creating iOS Certificates (One-Time Setup)

1. **Open Xcode** on your Mac
2. Go to **Preferences → Accounts**
3. Add your Apple Developer account
4. Select your team → **Manage Certificates**
5. Click **+** → **Apple Distribution**
6. Export certificate:
   - Open **Keychain Access**
   - Find your distribution certificate
   - Right-click → **Export**
   - Save as `.p12` file with password
7. Get provisioning profile from [Apple Developer Portal](https://developer.apple.com/account)

### Creating Android Keystore (One-Time Setup)

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore \
  -alias solidi-release-key \
  -keyalg RSA -keysize 2048 -validity 10000
```

## How to Use

### Manual Trigger

1. Go to **GitHub → Actions**
2. Select workflow (`Build iOS App` or `Build Android App`)
3. Click **Run workflow**
4. Select branch
5. Click **Run workflow**

### Automatic Trigger

Just push code to monitored branches:
```bash
git push origin main
# or
git push origin release
# or
git push origin feature/your-feature
```

### Download Built Apps

1. Go to **GitHub → Actions**
2. Click on your workflow run
3. Scroll to **Artifacts** section
4. Download:
   - `ios-app-{sha}` - iOS .ipa file
   - `android-release-aab-{sha}` - Android .aab bundle
   - `android-release-apk-{sha}` - Android .apk file

## Build Status

You can see build status on:
- GitHub repository main page (badges)
- Pull request checks
- Actions tab

## Troubleshooting

### iOS Build Fails
- Check code signing certificates are valid
- Verify provisioning profile matches app identifier
- Check Xcode version compatibility (using Xcode 16 on macOS 14)

### Android Build Fails
- Verify keystore secrets are correct
- Check Java version (using Java 17)
- Review Gradle build logs in artifacts

### Missing Secrets
If you see errors about missing secrets, ensure all required secrets are added in:
**GitHub Repository → Settings → Secrets and variables → Actions**

## Cost Estimate

GitHub Actions free tier includes:
- **2,000 minutes/month** for private repositories
- **Unlimited minutes** for public repositories

Build times:
- iOS: ~15-20 minutes per build
- Android: ~10-15 minutes per build

## Next Steps

After setting up secrets:
1. Push code to trigger first build
2. Monitor build in Actions tab
3. Download artifacts to test
4. Optionally add deployment steps (TestFlight, Play Store)

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Xcode Build Settings](https://developer.apple.com/documentation/xcode)
- [Android Build Configuration](https://developer.android.com/studio/build)
