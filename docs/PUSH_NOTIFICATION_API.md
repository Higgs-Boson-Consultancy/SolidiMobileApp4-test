# Push Notification API Usage

## Send Notification Endpoint

**URL:** `https://e80gxrvbm8.execute-api.us-east-1.amazonaws.com/dev/send`

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "userIds": ["user-email-or-id"],
  "title": "Notification Title",
  "body": "Notification message body",
  "data": {
    "type": "optional-type",
    "screen": "optional-screen-to-navigate"
  }
}
```

## Examples

### Simple Notification
```bash
curl -X POST "https://e80gxrvbm8.execute-api.us-east-1.amazonaws.com/dev/send" \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": ["henry930@gmail.com"],
    "title": "Hello!",
    "body": "This is a test notification"
  }'
```

### Notification with Custom Data
```bash
curl -X POST "https://e80gxrvbm8.execute-api.us-east-1.amazonaws.com/dev/send" \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": ["henry930@gmail.com"],
    "title": "Transaction Complete",
    "body": "Your Bitcoin transaction has been confirmed",
    "data": {
      "type": "transaction",
      "screen": "TransactionHistory",
      "transactionId": "tx_12345"
    }
  }'
```

### Send to Multiple Users
```bash
curl -X POST "https://e80gxrvbm8.execute-api.us-east-1.amazonaws.com/dev/send" \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": ["user1@example.com", "user2@example.com"],
    "title": "System Update",
    "body": "The system will be under maintenance tonight"
  }'
```

## Response

**Success (200):**
```json
{
  "success": true,
  "results": [
    {
      "userId": "henry930@gmail.com",
      "success": true,
      "messageId": "01234567-89ab-cdef-0123-456789abcdef"
    }
  ]
}
```

**Error (400):**
```json
{
  "error": "Invalid userIds",
  "message": "userIds must be a non-empty array"
}
```

## Testing from Command Line

Save this as `send-notification.sh`:
```bash
#!/bin/bash

USER_ID="${1:-henry930@gmail.com}"
TITLE="${2:-Test Notification}"
BODY="${3:-This is a test message}"

curl -X POST "https://e80gxrvbm8.execute-api.us-east-1.amazonaws.com/dev/send" \
  -H "Content-Type: application/json" \
  -d "{
    \"userIds\": [\"$USER_ID\"],
    \"title\": \"$TITLE\",
    \"body\": \"$BODY\"
  }"
```

Usage:
```bash
chmod +x send-notification.sh
./send-notification.sh "henry930@gmail.com" "Hello" "Test message"
```

## Integration in Your Backend

### Node.js Example
```javascript
async function sendNotification(userId, title, body, data = {}) {
  const response = await fetch('https://e80gxrvbm8.execute-api.us-east-1.amazonaws.com/dev/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userIds: [userId],
      title,
      body,
      data
    })
  });
  
  return await response.json();
}

// Usage
await sendNotification(
  'henry930@gmail.com',
  'Payment Received',
  'You received $100',
  { type: 'payment', amount: 100 }
);
```

### Python Example
```python
import requests

def send_notification(user_id, title, body, data=None):
    url = "https://e80gxrvbm8.execute-api.us-east-1.amazonaws.com/dev/send"
    payload = {
        "userIds": [user_id],
        "title": title,
        "body": body
    }
    if data:
        payload["data"] = data
    
    response = requests.post(url, json=payload)
    return response.json()

# Usage
send_notification(
    "henry930@gmail.com",
    "Payment Received",
    "You received $100",
    {"type": "payment", "amount": 100}
)
```
