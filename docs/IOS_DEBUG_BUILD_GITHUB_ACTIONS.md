# iOS Debug Build Setup for GitHub Actions

This guide will help you set up GitHub Actions to build Debug versions of your iOS app that can be installed on your iPhone.

## Prerequisites

1. **Apple Developer Account** (already have this)
2. **Your iPhone's UDID**
3. **Development Certificate and Provisioning Profile**
4. **Mac with Xcode** (for initial setup and installation)

---

## Step 1: Get Your iPhone's UDID

### Method 1: Using Finder (macOS Catalina or later)
1. Connect your iPhone to your Mac
2. Open **Finder**
3. Select your iPhone from the sidebar 
4. Click on the device information below the iPhone name
5. Your UDID will be displayed (it's a 40-character string)
6. Right-click and copy the UDID
UDID: 00008030-000669240A91402E

### Method 2: Using Xcode
1. Connect your iPhone to your Mac
2. Open Xcode → Window → **Devices and Simulators**
3. Select your iPhone
4. The **Identifier** field shows your UDID
5. Right-click and copy

---

## Step 2: Register Your Device in Apple Developer Portal

1. Go to [Apple Developer - Devices](https://developer.apple.com/account/resources/devices/list)
2. Click **+** to add a new device
3. Enter:
   - **Platform**: iOS
   - **Device Name**: "My iPhone" (or any name you prefer)
   - **Device ID (UDID)**: Paste the UDID you copied
4. Click **Continue** → **Register**

---

## Step 3: Create Development Certificate (if you don't have one)

1. Go to [Apple Developer - Certificates](https://developer.apple.com/account/resources/certificates/list)
2. Click **+** to create a new certificate
3. Select **Apple Development** (under Development)
4. Click **Continue**
5. Create a Certificate Signing Request (CSR):
   - On your Mac: Open **Keychain Access**
   - Menu: **Keychain Access** → **Certificate Assistant** → **Request a Certificate from a Certificate Authority**
   - Enter your email address
   - Select "Saved to disk"
   - Click **Continue** and save the file
6. Upload the CSR file to Apple Developer Portal
7. Download the certificate (e.g., `development.cer`)
8. Double-click to install it in Keychain Access

---

## Step 4: Export Development Certificate as P12

1. Open **Keychain Access**
2. Find your "Apple Development" certificate
3. Expand the certificate to show the private key
4. Select **both** the certificate and private key
5. Right-click → **Export 2 items...**
6. Save as: `dev-certificate.p12`
7. **Set a password** (you'll need this for GitHub Secrets)
8. Save the file

---

## Step 5: Create Development Provisioning Profile

1. Go to [Apple Developer - Profiles](https://developer.apple.com/account/resources/profiles/list)
2. Click **+** to create a new profile
3. Select **iOS App Development** (under Development)
4. Click **Continue**
5. Select your **App ID** (e.g., `com.solidifx.app`)
6. Click **Continue**
7. Select your **Development Certificate**
8. Click **Continue**
9. **Select your iPhone** from the list of devices
10. Click **Continue**
11. Enter a profile name: "SolidiMobileApp4 Development"
12. Click **Generate**
13. **Download** the profile (e.g., `SolidiMobileApp4_Development.mobileprovision`)

---

## Step 6: Convert Certificate and Profile to Base64

Open **Terminal** and run:

```bash
# Convert development certificate to base64
base64 -i ~/Downloads/dev-certificate.p12 | pbcopy
# Now paste this into a text file and save as: IOS_DEV_CERTIFICATE

# Convert provisioning profile to base64
base64 -i ~/Downloads/SolidiMobileApp4_Development.mobileprovision | pbcopy
# Now paste into a text file and save as: IOS_DEV_PROVISIONING_PROFILE
```

---

## Step 7: Get Your Team ID

1. Go to [Apple Developer - Membership](https://developer.apple.com/account/#!/membership/)
2. Find your **Team ID** (10-character alphanumeric string)
3. Copy it - you'll need it for the workflow

---

## Step 8: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `IOS_DEV_CERTIFICATE` | Base64 string from Step 6 | Development certificate |
| `IOS_DEV_CERTIFICATE_PASSWORD` | Your p12 password | Certificate password |
| `IOS_DEV_PROVISIONING_PROFILE` | Base64 string from Step 6 | Provisioning profile |
| `KEYCHAIN_PASSWORD` | Any secure password | Temporary keychain password |

---

## Step 9: Update the Workflow File

Edit `.github/workflows/build-ios-debug.yml` and replace `YOUR_TEAM_ID` with your actual Team ID:

```yaml
<key>teamID</key>
<string>ABC123XYZ0</string>  # Replace with your Team ID
```

---

## Step 10: Trigger the Build

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **Build iOS Debug for Device** workflow
4. Click **Run workflow**
5. Select the branch (e.g., `fix/issue-120-dropdown-arrows`)
6. Optionally enter your device name
7. Click **Run workflow**

The build will take about 10-15 minutes.

---

## Step 11: Download and Install the IPA

### After the workflow completes:

1. Go to the workflow run page
2. Scroll down to **Artifacts**
3. Download:
   - `ios-debug-ipa-xxxxx` (the IPA file)
   - `installation-instructions-xxxxx` (installation guide)

### Install via Xcode:

1. Connect your iPhone to your Mac
2. Unzip the downloaded artifact
3. Open Xcode → **Window** → **Devices and Simulators**
4. Select your iPhone
5. Click **+** under "Installed Apps"
6. Select the `.ipa` file
7. The app will be installed on your iPhone

### Install via Apple Configurator 2:

1. Download **Apple Configurator 2** from Mac App Store
2. Connect your iPhone
3. Select your device
4. Click **Add** → **Apps**
5. Select the `.ipa` file

---

## Troubleshooting

### "Untrusted Developer" Error
1. On your iPhone: **Settings** → **General** → **VPN & Device Management**
2. Find your developer certificate
3. Tap **Trust**

### Build Fails with Code Signing Error
- Verify your Team ID is correct in the workflow file
- Ensure your iPhone's UDID is in the provisioning profile
- Check that certificates haven't expired

### "Unable to Install"
- Ensure the provisioning profile includes your device's UDID
- Verify the Bundle ID matches your app

---

## Alternative: Over-the-Air Installation

For easier distribution without connecting to a Mac, you can use services like:

- **Diawi** (https://www.diawi.com/) - Free, simple
- **TestFlight** (requires App Store Connect setup)
- **Self-hosted** with a web server and manifest.plist

---

## Next Steps

Once you've tested the app and verified the fix works:

1. Push your changes to the remote branch
2. Create a Pull Request to merge into `main` or `release`
3. After merging, you can create a Release build for TestFlight or App Store

---

## Notes

- Debug builds expire when the provisioning profile expires (typically 1 year)
- You need to reinstall when the profile expires
- For production, use the Release build workflow with App Store provisioning
