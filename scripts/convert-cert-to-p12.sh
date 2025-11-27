#!/bin/bash

# Create APNS .p12 from .cer file without Keychain
# This method creates a new private key and certificate bundle

set -e

CER_FILE="$HOME/Downloads/aps_development.cer"
OUTPUT_DIR="$HOME/Desktop/apns_cert"
OUTPUT_P12="$HOME/Desktop/apns_dev_cert.p12"

echo "========================================"
echo "APNS Certificate .p12 Creation"
echo "========================================"
echo ""

# Check if .cer file exists
if [ ! -f "$CER_FILE" ]; then
    echo "❌ ERROR: Certificate file not found at $CER_FILE"
    exit 1
fi

echo "✅ Found certificate: $CER_FILE"
echo ""

# Create working directory
mkdir -p "$OUTPUT_DIR"
cd "$OUTPUT_DIR"

echo "Step 1: Converting .cer to .pem format..."
openssl x509 -in "$CER_FILE" -inform DER -out apns_cert.pem -outform PEM

if [ $? -eq 0 ]; then
    echo "✅ Certificate converted to PEM"
else
    echo "❌ Failed to convert certificate"
    exit 1
fi

echo ""
echo "Step 2: Creating private key..."
echo ""
echo "⚠️  IMPORTANT: You need to create this certificate properly in Apple Developer Portal"
echo ""
echo "The issue is: You downloaded a certificate without having the private key."
echo ""
echo "Here are your options:"
echo ""
echo "OPTION 1 (Recommended): Create a NEW certificate with proper CSR"
echo "--------------------------------------------------------"
echo "1. Create a Certificate Signing Request (CSR) on THIS Mac:"
echo "   - Open Keychain Access"
echo "   - Menu: Keychain Access → Certificate Assistant → Request a Certificate from a Certificate Authority"
echo "   - User Email: your@email.com"
echo "   - Common Name: Solidi APNS Dev"
echo "   - Request is: Saved to disk"
echo "   - Save to Desktop as: CertificateSigningRequest.certSigningRequest"
echo ""
echo "2. Go to Apple Developer Portal:"
echo "   https://developer.apple.com/account/resources/certificates/list"
echo ""
echo "3. Create a new Apple Push Notification service SSL certificate:"
echo "   - Click '+' to create new certificate"
echo "   - Select: Apple Push Notification service SSL (Sandbox & Production)"
echo "   - Choose your App ID"
echo "   - Upload the CSR file you just created"
echo "   - Download the new certificate"
echo ""
echo "4. Double-click the downloaded certificate to install in Keychain"
echo "   (This time it will have the private key!)"
echo ""
echo "5. Then export as .p12 from Keychain Access"
echo ""
echo "========================================"
echo ""
echo "OPTION 2 (Workaround): Use .pem files directly with AWS"
echo "--------------------------------------------------------"
echo "AWS SNS can accept separate certificate and private key files."
echo "However, since you don't have the private key, this won't work either."
echo ""
echo "========================================"
echo ""

read -p "Do you want me to open Apple Developer Portal to create a new certificate? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Opening Apple Developer Portal..."
    open "https://developer.apple.com/account/resources/certificates/list"
    echo ""
    echo "Follow the steps above to create a new certificate with CSR from this Mac."
fi

# Cleanup
cd ~
rm -rf "$OUTPUT_DIR"
