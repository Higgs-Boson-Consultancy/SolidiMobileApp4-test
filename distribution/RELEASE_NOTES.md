# Solidi Mobile App - Internal Testing Release
**Version:** 1.2.0  
**Build Date:** November 8, 2025  
**Platform:** Android  
**Build Type:** Release (Unsigned)

---

## 📦 Package Information

### APK Details
- **Filename:** `SolidiMobileApp-v1.2.0-release-20251108.apk`
- **Size:** 25 MB
- **Package Name:** `com.solidimobileapp4test`
- **Min Android Version:** Android 5.0 (API 21)
- **Target Android Version:** Android 14 (API 34)
- **Architecture:** Universal (ARM, ARM64, x86, x86_64)

### What's Included
✅ Production-optimized JavaScript bundle  
✅ 70+ native libraries (React Native, Hermes, etc.)  
✅ 17 asset files  
✅ All required permissions and features  
✅ Hermes engine for optimized performance  

---

## 📱 Installation Instructions

### Method 1: Direct Installation (Recommended for Testing)
1. **Enable Unknown Sources:**
   - Go to `Settings` → `Security` → Enable `Install unknown apps`
   - Allow installation from your file manager or browser

2. **Transfer APK to Device:**
   - Email the APK to yourself
   - Use Google Drive, Dropbox, or similar
   - Transfer via USB cable

3. **Install:**
   - Tap the APK file on your device
   - Tap `Install`
   - Tap `Open` when installation completes

### Method 2: ADB Installation (For Developers)
```bash
# Install via ADB
adb install SolidiMobileApp-v1.2.0-release-20251108.apk

# Or if already installed, reinstall
adb install -r SolidiMobileApp-v1.2.0-release-20251108.apk
```

### Method 3: Google Play Internal Testing
1. Upload to Google Play Console
2. Create Internal Testing release
3. Add testers via email
4. Share testing link with testers

---

## 🧪 Testing Information

### Test Environment
- **API Server:** t2.solidi.co (Development)
- **App Mode:** Development mode with production optimization
- **Logging:** Enabled for debugging

### Test Credentials
Use your existing Solidi account credentials:
- Username/Email: [Your test account]
- Password: [Your test password]

### Known Configuration
- **Domain:** t2.solidi.co
- **App Tier:** dev
- **Persistent Login:** Enabled
- **Biometric Auth:** Available (if device supports)

---

## ✅ Testing Checklist

### Critical Functionality
- [ ] **App Installation** - APK installs without errors
- [ ] **App Launch** - App opens without crashing
- [ ] **Login** - User can log in with credentials
- [ ] **Dashboard** - Main dashboard displays correctly
- [ ] **Navigation** - All menu items accessible
- [ ] **Trading** - Buy/Sell functionality works
- [ ] **Wallet** - Balance displays correctly
- [ ] **Transactions** - History loads properly
- [ ] **Settings** - Settings accessible and functional

### Android-Specific Features
- [ ] **Biometric Auth** - Fingerprint/Face unlock works
- [ ] **Notifications** - Push notifications received
- [ ] **Back Button** - Android back button navigates correctly
- [ ] **App Switching** - App resumes correctly after background
- [ ] **Orientation** - Portrait/Landscape handling
- [ ] **Permissions** - Camera, storage permissions work

### Performance Testing
- [ ] **Launch Time** - App launches in < 5 seconds
- [ ] **Responsiveness** - UI responds quickly to touch
- [ ] **Memory Usage** - No memory leaks during extended use
- [ ] **Network** - API calls complete successfully
- [ ] **Offline** - App handles offline mode gracefully

### Device Compatibility
- [ ] **Phone** - Works on various screen sizes
- [ ] **Tablet** - Tablet layout acceptable
- [ ] **Android 5-8** - Older Android versions
- [ ] **Android 9-11** - Mid-range versions
- [ ] **Android 12-14** - Latest Android versions

---

## 🐛 Bug Reporting

### How to Report Issues
Please report any bugs with the following information:

**Required Information:**
- Device model (e.g., Google Pixel 6a)
- Android version (e.g., Android 14)
- App version (1.2.0)
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/screen recording (if applicable)

**Where to Report:**
- GitHub Issues: [Your repo URL]
- Email: [Your support email]
- Slack/Discord: [Your channel]

### Log Collection
To help debug issues, collect logs:

```bash
# Connect device via USB
adb logcat -d > app_logs.txt

# Or use Android's built-in bug report
# Settings → System → Developer Options → Bug Report
```

---

## 📊 Build Information

### Build Configuration
- **Gradle Version:** 8.5
- **Build Tools:** 34.0.0
- **Kotlin Version:** 1.8.0
- **React Native:** 0.74.1
- **Hermes:** Enabled
- **ProGuard/R8:** Enabled (minification)

### JavaScript Bundle
- **Bundle Size:** Optimized for production
- **Source Maps:** Generated (for debugging)
- **Minification:** Enabled
- **Dead Code Elimination:** Enabled

### Native Libraries Included
- React Native Core
- Hermes JavaScript Engine
- React Native Biometrics
- React Native Keychain
- React Native SVG
- React Native Vector Icons
- React Native WebView
- React Native Permissions
- React Native FS
- React Native Image Picker
- React Native Document Picker
- And more... (70+ libraries)

---

## ⚠️ Important Notes

### Security Warning
**This is an unsigned release APK for internal testing only.**
- Not suitable for production distribution
- No Google Play security scanning
- Install only from trusted sources
- For production, use a signed APK from Play Store

### Limitations
- No automatic updates (manual APK installation required)
- Some features may require Google Play Services
- Push notifications may be limited
- In-app purchases not available in test builds

### Data & Privacy
- This app connects to development servers (t2.solidi.co)
- Test data may be reset without notice
- Do not use real financial data for testing
- Credentials are stored securely in Android Keychain

---

## 🚀 Distribution Options

### Option 1: Internal Testing (Recommended)
**Advantages:**
- Easy to distribute via link
- Automatic updates
- Analytics and crash reports
- No need to enable unknown sources

**Steps:**
1. Upload to Google Play Console
2. Create Internal Testing track
3. Add tester emails
4. Share testing opt-in link

### Option 2: Firebase App Distribution
**Advantages:**
- Quick distribution to testers
- Crash reporting via Firebase Crashlytics
- Release notes for each build
- Tester management

**Steps:**
1. Upload to Firebase Console
2. Add tester groups
3. Testers receive email with download link

### Option 3: Direct APK Distribution
**Advantages:**
- No additional setup required
- Immediate distribution
- Works without internet

**Disadvantages:**
- Manual installation required
- No automatic updates
- Requires enabling unknown sources

---

## 📞 Support

### Getting Help
- **Documentation:** See CODE_LOGIC_DOCUMENTATION.md
- **Testing Guide:** See ANDROID_TESTING_SESSION.md
- **API Documentation:** See API_DOCUMENTATION.md

### Development Team Contact
- **GitHub:** SolidiFX/SolidiMobileApp4
- **Branch:** feature/api-check-development

---

## 📋 Version History

### v1.2.0 (November 8, 2025)
- ✅ Complete API documentation
- ✅ Code cleanup (unused files moved to backup)
- ✅ Code logic analysis and documentation
- ✅ Fixed import errors
- ✅ Android build optimized
- ✅ Persistent login enabled
- ✅ Enhanced error handling
- ✅ Production bundle optimization

---

## 🔐 Digital Signature Information

**Note:** This APK is currently **unsigned** for internal testing.

For production release, you'll need to:
1. Generate a keystore file
2. Sign the APK with your release key
3. Align the APK with zipalign
4. Upload to Google Play Store

### To Sign This APK (For Production):
```bash
# Generate keystore (one-time)
keytool -genkey -v -keystore my-release-key.keystore \
  -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Sign the APK
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore my-release-key.keystore \
  SolidiMobileApp-v1.2.0-release-20251108.apk my-key-alias

# Align the APK
zipalign -v 4 SolidiMobileApp-v1.2.0-release-20251108.apk \
  SolidiMobileApp-v1.2.0-signed-aligned.apk
```

---

**Happy Testing! 🎉**

For questions or issues, please contact the development team.
