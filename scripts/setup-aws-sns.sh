#!/bin/bash

# AWS SNS Setup Script
# Creates SNS Platform Application for iOS push notifications

echo "========================================"
echo "AWS SNS Platform Application Setup"
echo "========================================"
echo ""

# Check for .p12 file in multiple locations
P12_FILE=""
if [ -f ~/Desktop/apns_dev_cert.p12 ]; then
    P12_FILE=~/Desktop/apns_dev_cert.p12
elif [ -f ~/Downloads/apns_dev_cert.p12 ]; then
    P12_FILE=~/Downloads/apns_dev_cert.p12
else
    echo "❌ ERROR: apns_dev_cert.p12 not found"
    echo "Searched in:"
    echo "  - ~/Desktop/apns_dev_cert.p12"
    echo "  - ~/Downloads/apns_dev_cert.p12"
    echo ""
    echo "Please ensure the .p12 file is in one of these locations"
    exit 1
fi

echo "✅ Found APNS certificate: $P12_FILE"
echo ""

# Get AWS region
AWS_REGION="${1:-us-east-1}"
echo "Using AWS Region: $AWS_REGION"
echo ""

# Check AWS credentials
echo "Checking AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ ERROR: AWS credentials not configured"
    echo "Run: aws configure"
    exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "✅ AWS Account: $ACCOUNT_ID"
echo ""

# Convert .p12 to base64
echo "Converting certificate to base64..."
CERT_BASE64=$(cat "$P12_FILE" | base64)

if [ -z "$CERT_BASE64" ]; then
    echo "❌ ERROR: Failed to convert certificate to base64"
    exit 1
fi

echo "✅ Certificate converted (${#CERT_BASE64} bytes)"
echo ""

# Prompt for password (the one used when exporting .p12)
echo "Enter the password you set when exporting the .p12 file (press Enter if no password):"
read -s P12_PASSWORD
echo ""

# If no password provided, use empty string
if [ -z "$P12_PASSWORD" ]; then
    echo "ℹ️  Using empty password"
    P12_PASSWORD=""
fi

# Create SNS Platform Application
echo "Creating AWS SNS Platform Application..."
echo ""

PLATFORM_ARN=$(aws sns create-platform-application \
  --name solidi-mobile-apns-dev \
  --platform APNS_SANDBOX \
  --attributes PlatformCredential="$CERT_BASE64",PlatformPrincipal="$P12_PASSWORD" \
  --region "$AWS_REGION" \
  --query 'PlatformApplicationArn' \
  --output text 2>&1)

if [ $? -eq 0 ]; then
    echo "✅ SUCCESS! Platform Application created"
    echo ""
    echo "========================================"
    echo "PLATFORM ARN (save this):"
    echo "========================================"
    echo "$PLATFORM_ARN"
    echo "========================================"
    echo ""
    
    # Save to file
    mkdir -p infrastructure
    echo "$PLATFORM_ARN" > infrastructure/apns-platform-arn.txt
    echo "✅ ARN saved to: infrastructure/apns-platform-arn.txt"
    echo ""
    
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
        echo "$EXISTING_ARN" > infrastructure/apns-platform-arn.txt
        echo "✅ ARN saved to: infrastructure/apns-platform-arn.txt"
        echo ""
        echo "You can proceed to the next step:"
        echo "Run: ./scripts/deploy-push-notifications.sh dev $AWS_REGION"
    else
        exit 1
    fi
fi
