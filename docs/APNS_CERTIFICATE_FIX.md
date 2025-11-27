# APNS Certificate Setup - Missing Private Key Fix

## Problem
You cannot export the certificate as `.p12` because the **private key is missing** from your Keychain. This happens when:
- The certificate was created on a different computer
- The certificate was downloaded without creating a CSR first on this Mac

## Solution: Create a New Certificate (15 minutes)

Follow these steps to create a proper certificate with the private key:

---

### Step 1: Create Certificate Signing Request (CSR)

1. Open **Keychain Access** app
2. Menu: **Keychain Access** → **Certificate Assistant** → **Request a Certificate from a Certificate Authority**
3. Fill in the form:
   - **User Email Address:** your@email.com
   - **Common Name:** Solidi APNS Development
   - **CA Email Address:** (leave empty)
   - **Request is:** ✅ **Saved to disk**
   - **Let me specify key pair information:** (leave unchecked)
4. Click **Continue**
5. Save as: `CertificateSigningRequest.certSigningRequest`
6. Location: **Desktop**
7. Click **Save**

✅ You should now have a file on your Desktop: `CertificateSigningRequest.certSigningRequest`

---

### Step 2: Create New APNS Certificate in Apple Developer Portal

1. Open: https://developer.apple.com/account/resources/certificates/list

2. Click the **"+"** button (top right)

3. Select certificate type:
   - ✅ **Apple Push Notification service SSL (Sandbox & Production)**
   - Click **Continue**

4. Select your App ID:
   - Choose: **co.solidi.mobile.test** (or your bundle ID)
   - Click **Continue**

5. Upload CSR:
   - Click **Choose File**
   - Select the `CertificateSigningRequest.certSigningRequest` from your Desktop
   - Click **Continue**

6. Download the certificate:
   - Click **Download**
   - Save as: `aps_development.cer` (or it may auto-name it)
   - Save to: **Desktop**

---

### Step 3: Install Certificate in Keychain

1. Find the downloaded certificate on your Desktop (usually `aps_development.cer` or `aps.cer`)

2. **Double-click** the certificate file

3. It will open Keychain Access and import the certificate

4. **Verify it has a private key:**
   - In Keychain Access, select **"login"** keychain
   - Select **"My Certificates"** category
   - Find: **"Apple Push Services: co.solidi.mobile.test"**
   - Click the **▶** arrow to expand it
   - ✅ You should see a **private key** underneath (🔑 icon)

---

### Step 4: Export as .p12

1. In Keychain Access, select the certificate (not the private key)

2. Right-click → **"Export [certificate name]..."**

3. Settings:
   - **File Format:** Personal Information Exchange (.p12)
   - **Save As:** `apns_dev_cert.p12`
   - **Where:** Desktop

4. Click **Save**

5. **Create a password** when prompted (remember it, but you won't need it for AWS)

6. Enter your **Mac password** to allow the export

✅ You should now have: `~/Desktop/apns_dev_cert.p12`

---

### Step 5: Verify the .p12 File

Run this command to verify:
```bash
ls -lh ~/Desktop/apns_dev_cert.p12
```

You should see a file around 2-3 KB in size.

---

## Next Steps

Once you have the `.p12` file, run:
```bash
cd /Users/henry/Solidi/SolidiMobileApp4
./scripts/setup-aws-sns.sh us-east-1
```

---

## Alternative: If You Have Access to the Original Mac

If you created the original certificate on a different Mac and have access to it:

1. On that Mac, open Keychain Access
2. Export the certificate with private key as .p12
3. Transfer the .p12 file to this Mac (via AirDrop, email, etc.)
4. Use that .p12 file

---

## Quick Reference Commands

```bash
# Check if private key exists
security find-identity -v -p codesigning ~/Library/Keychains/login.keychain-db | grep -i "push"

# Verify .p12 file
openssl pkcs12 -in ~/Desktop/apns_dev_cert.p12 -info -noout

# List certificates in Keychain
security find-certificate -a -p ~/Library/Keychains/login.keychain-db | openssl x509 -noout -subject
```
