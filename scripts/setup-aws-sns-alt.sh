#!/bin/bash

# Alternative AWS SNS Setup using PEM format
# Converts .p12 to separate certificate and private key PEM files

set -e

P12_FILE="$HOME/Downloads/apns_dev_cert.p12"
WORK_DIR="$HOME/Desktop/apns_setup"
AWS_REGION="${1:-us-east-1}"

echo "========================================"
echo "AWS SNS Setup (Alternative Method)"
echo "========================================"
echo ""

# Check if .p12 file exists
if [ ! -f "$P12_FILE" ]; then
    echo "❌ ERROR: .p12 file not found at $P12_FILE"
    exit 1
fi

echo "✅ Found .p12 file: $P12_FILE"
echo ""

# Create working directory
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

echo "Step 1: Converting .p12 to PEM format..."
echo ""

# Try without password first
echo "Attempting conversion without password..."
openssl pkcs12 -in "$P12_FILE" -out cert.pem -clcerts -nokeys -passin pass: 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Certificate extracted"
    openssl pkcs12 -in "$P12_FILE" -out key.pem -nocerts -nodes -passin pass: 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Private key extracted"
    else
        echo "❌ Failed to extract private key"
        echo ""
        echo "The .p12 file may have a password. Please enter it:"
        read -s P12_PASS
        echo ""
        
        openssl pkcs12 -in "$P12_FILE" -out cert.pem -clcerts -nokeys -passin pass:"$P12_PASS"
        openssl pkcs12 -in "$P12_FILE" -out key.pem -nocerts -nodes -passin pass:"$P12_PASS"
    fi
else
    echo "Password required. Please enter the .p12 password:"
    read -s P12_PASS
    echo ""
    
    openssl pkcs12 -in "$P12_FILE" -out cert.pem -clcerts -nokeys -passin pass:"$P12_PASS"
    if [ $? -ne 0 ]; then
        echo "❌ Failed to extract certificate. Wrong password?"
        exit 1
    fi
    
    openssl pkcs12 -in "$P12_FILE" -out key.pem -nocerts -nodes -passin pass:"$P12_PASS"
    if [ $? -ne 0 ]; then
        echo "❌ Failed to extract private key"
        exit 1
    fi
    
    echo "✅ Certificate and key extracted"
fi

echo ""
echo "Step 2: Creating AWS SNS Platform Application..."
echo ""

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ ERROR: AWS credentials not configured"
    exit 1
fi

# Read certificate and key
CERT_CONTENT=$(cat cert.pem)
KEY_CONTENT=$(cat key.pem)

# Create SNS Platform Application using AWS CLI
PLATFORM_ARN=$(aws sns create-platform-application \
  --name solidi-mobile-apns-dev \
  --platform APNS_SANDBOX \
  --attributes "PlatformCredential=$CERT_CONTENT,PlatformPrincipal=$KEY_CONTENT" \
  --region "$AWS_REGION" \
  --query 'PlatformApplicationArn' \
  --output text 2>&1)

if [ $? -eq 0 ]; then
    echo "✅ SUCCESS! Platform Application created"
    echo ""
    echo "========================================"
    echo "PLATFORM ARN:"
    echo "========================================"
    echo "$PLATFORM_ARN"
    echo "========================================"
    echo ""
    
    # Save to file
    cd /Users/henry/Solidi/SolidiMobileApp4
    mkdir -p infrastructure
    echo "$PLATFORM_ARN" > infrastructure/apns-platform-arn.txt
    echo "✅ ARN saved to: infrastructure/apns-platform-arn.txt"
    echo ""
    
    # Cleanup
    rm -rf "$WORK_DIR"
    
    echo "Next step: Deploy AWS Infrastructure"
    echo "Run: ./scripts/deploy-push-notifications.sh dev $AWS_REGION"
else
    echo "❌ ERROR: Failed to create platform application"
    echo ""
    echo "Error details:"
    echo "$PLATFORM_ARN"
    echo ""
    
    # Check if it already exists
    echo "Checking if platform application already exists..."
    EXISTING_ARN=$(aws sns list-platform-applications \
      --region "$AWS_REGION" \
      --query "PlatformApplications[?contains(PlatformApplicationArn, 'solidi-mobile-apns-dev')].PlatformApplicationArn" \
      --output text)
    
    if [ -n "$EXISTING_ARN" ]; then
        echo ""
        echo "✅ Platform application already exists:"
        echo "$EXISTING_ARN"
        echo ""
        cd /Users/henry/Solidi/SolidiMobileApp4
        mkdir -p infrastructure
        echo "$EXISTING_ARN" > infrastructure/apns-platform-arn.txt
        echo "✅ ARN saved to: infrastructure/apns-platform-arn.txt"
        echo ""
        rm -rf "$WORK_DIR"
        echo "You can proceed to the next step:"
        echo "Run: ./scripts/deploy-push-notifications.sh dev $AWS_REGION"
    else
        echo ""
        echo "PEM files saved in: $WORK_DIR"
        echo "You can manually create the platform application in AWS Console"
        exit 1
    fi
fi
