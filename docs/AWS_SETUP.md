# AWS Setup Instructions

## Quick Setup

Open your terminal and run these commands:

### 1. Configure AWS CLI

```bash
export PATH="/opt/homebrew/bin:$PATH"
aws configure
```

When prompted, enter:
- **AWS Access Key ID:** [your access key]
- **AWS Secret Access Key:** [your secret key]  
- **Default region name:** `us-east-1`
- **Default output format:** `json`

### 2. Verify AWS Configuration

```bash
aws sts get-caller-identity
```

You should see your AWS account information.

### 3. Create SNS Platform Application

```bash
cd /Users/henry/Solidi/SolidiMobileApp4
./scripts/setup-aws-sns.sh us-east-1
```

This will:
- Use your `.p12` certificate from `~/Downloads/apns_dev_cert.p12`
- Create AWS SNS Platform Application for APNS
- Save the Platform ARN to `infrastructure/apns-platform-arn.txt`

### 4. Deploy Infrastructure

```bash
./scripts/deploy-push-notifications.sh dev us-east-1
```

This will deploy all AWS resources (Lambda, DynamoDB, API Gateway, etc.)

---

## Alternative: Manual AWS Configuration

If you prefer to configure AWS manually:

```bash
mkdir -p ~/.aws

cat > ~/.aws/credentials << EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_HERE
aws_secret_access_key = YOUR_SECRET_KEY_HERE
EOF

cat > ~/.aws/config << EOF
[default]
region = us-east-1
output = json
EOF
```

Replace `YOUR_ACCESS_KEY_HERE` and `YOUR_SECRET_KEY_HERE` with your actual credentials.
