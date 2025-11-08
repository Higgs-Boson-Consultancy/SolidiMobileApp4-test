# Solidi API Documentation

**Version:** 2.0  
**Base URL:** `https://t2.solidi.co`  
**API Path Prefix:** `/api2/v1`

---

## Table of Contents

1. [Base Configuration](#base-configuration)
2. [Authentication](#authentication)
3. [HMAC Signature Generation](#hmac-signature-generation)
4. [Authentication & User Management](#authentication--user-management)
5. [Trading & Orders](#trading--orders)
6. [Wallet & Balance Operations](#wallet--balance-operations)
7. [Market Data](#market-data)
8. [Deposits & Withdrawals](#deposits--withdrawals)
9. [Verification & KYC](#verification--kyc)
10. [Account Management](#account-management)
11. [System Information](#system-information)
12. [Error Handling](#error-handling)
13. [Best Practices](#best-practices)
14. [Appendices](#appendices)

---

## Base Configuration

### Domains
- **Production:** `https://t2.solidi.co`
- **API Version:** `api2/v1`

### Common Headers
```javascript
{
  'User-Agent': 'SolidiMobileApp4/1.2.0 (Build 33)',
  'Content-Type': 'application/json'
}
```

---

## Authentication

### Public Endpoints
**No authentication required.** Only need basic HTTP headers.

**Examples:** `/api2/v1/ticker`, `/api2/v1/version`

### Private Endpoints
**Require HMAC-SHA256 signature authentication.** Always use POST method.

**Required Headers:**
```javascript
{
  'API-Key': 'your_api_key',
  'API-Sign': 'hmac_sha256_signature',
  'Content-Type': 'application/json',
  'User-Agent': 'SolidiMobileApp4/1.2.0 (Build 33)'
}
```

**All private requests must include:**
- `nonce` in request body (Unix timestamp in microseconds, strictly increasing)
- HMAC signature in `API-Sign` header

---

## HMAC Signature Generation

### Algorithm

```javascript
// 1. Generate nonce (microseconds, must be greater than previous nonce)
const nonce = Date.now() * 1000;

// 2. Prepare POST data with nonce
const postData = JSON.stringify({
  ...params,
  nonce: nonce
});

// 3. Hash the nonce + postData
const hash = CryptoJS.SHA256(nonce + postData).toString();

// 4. Create message: API path + hash
const path = '/api2/v1/balance'; // example path
const message = path + hash;

// 5. Decode API secret from base64
const secretDecoded = CryptoJS.enc.Base64.parse(apiSecret);

// 6. Generate HMAC-SHA256 signature
const hmac = CryptoJS.HmacSHA256(message, secretDecoded);
const signature = CryptoJS.enc.Base64.stringify(hmac);

// 7. Use signature in API-Sign header
headers['API-Sign'] = signature;
```

### Example Implementation
```javascript
const generateSignature = (path, params, apiSecret) => {
  const nonce = Date.now() * 1000;
  const postData = JSON.stringify({ ...params, nonce });
  const hash = CryptoJS.SHA256(nonce + postData).toString();
  const message = path + hash;
  const secretDecoded = CryptoJS.enc.Base64.parse(apiSecret);
  const hmac = CryptoJS.HmacSHA256(message, secretDecoded);
  return CryptoJS.enc.Base64.stringify(hmac);
};
```

---

## Authentication & User Management

### 1. Login Mobile

**Endpoint:** `POST /api2/v1/login_mobile/{email}`

**Type:** Public (no HMAC signature required)

**Request:**
```javascript
{
  "password": "MyPassword123",
  "tfa": "", // Two-factor auth code (empty string if not enabled)
  "optionalParams": {
    "origin": {
      "clientType": "mobile",
      "os": "ios",
      "appVersion": "1.2.0",
      "buildNumber": 33,
      "deviceModel": "iPhone14,2",
      "osVersion": "17.0"
    }
  }
}
```

**Response (Success):**
```javascript
{
  "api_key": "abc123...",
  "api_secret": "xyz789...",
  "user_id": "user123",
  "email": "user@example.com",
  "verified": true,
  "tfa_enabled": false
}
```

**Response (2FA Required):**
```javascript
{
  "requires_tfa": true,
  "message": "Two-factor authentication required"
}
```

### 2. Register New User

**Endpoint:** `POST /api2/v1/register_new_user`

**Type:** Public

**Request:**
```javascript
{
  "userData": {
    "email": "newuser@example.com",
    "password": "SecurePassword123",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-15",
    "nationality": "GB",
    "phoneNumber": "+447700900000",
    "address": {
      "line1": "123 High Street",
      "line2": "Apt 4B",
      "city": "London",
      "postcode": "SW1A 1AA",
      "country": "GB"
    }
  },
  "optionalParams": {
    "origin": {
      "clientType": "mobile",
      "os": "ios"
    }
  }
}
```

**Response:**
```javascript
{
  "success": true,
  "user_id": "user456",
  "message": "Registration successful. Please verify your email."
}
```

### 3. Logout

**Endpoint:** `POST /api2/v1/logout`

**Type:** Private (requires HMAC)

**Request:**
```javascript
{
  "nonce": 1699900000000
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 4. Change Password

**Endpoint:** `POST /api2/v1/change_password`

**Type:** Private

**Request:**
```javascript
{
  "current_password": "OldPassword123",
  "new_password": "NewPassword456",
  "nonce": 1699900000000
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 5. Request Password Reset

**Endpoint:** `POST /api2/v1/request_password_reset`

**Type:** Public

**Request:**
```javascript
{
  "email": "user@example.com"
}
```

### 6. Reset Password

**Endpoint:** `POST /api2/v1/reset_password`

**Type:** Public

**Request:**
```javascript
{
  "token": "reset_token_from_email",
  "new_password": "NewSecurePassword789"
}
```

---

## Trading & Orders

### 1. Buy Order

**Endpoint:** `POST /api2/v1/buy`

**Type:** Private

**Request:**
```javascript
{
  "market": "BTC/GBP", // format: BASE/QUOTE
  "baseAssetVolume": "0.01", // Amount of BTC to buy
  "quoteAssetVolume": "300.00", // Amount of GBP to spend
  "orderType": "IMMEDIATE_OR_CANCEL", // See Order Types in Appendix
  "paymentMethod": "BALANCE", // or "CARD", "BANK_TRANSFER"
  "nonce": 1699900000000
}
```

**Response:**
```javascript
{
  "success": true,
  "order_id": "order123456",
  "market": "BTC/GBP",
  "executed_volume": "0.01",
  "executed_price": "30000.00",
  "status": "FILLED"
}
```

### 2. Sell Order

**Endpoint:** `POST /api2/v1/sell`

**Type:** Private

**Request:**
```javascript
{
  "market": "BTC/GBP",
  "baseAssetVolume": "0.01", // Amount of BTC to sell
  "quoteAssetVolume": "300.00", // Expected GBP received
  "orderType": "IMMEDIATE_OR_CANCEL",
  "paymentMethod": "BALANCE",
  "nonce": 1699900000000
}
```

**Response:** Same as Buy Order

### 3. Order Status

**Endpoint:** `POST /api2/v1/order_status/{orderID}`

**Type:** Private

**Request:**
```javascript
{
  "nonce": 1699900000000
}
```

**Response:**
```javascript
{
  "order_id": "order123456",
  "market": "BTC/GBP",
  "side": "BUY",
  "status": "FILLED", // or "PARTIAL", "PENDING", "CANCELLED"
  "created_at": "2023-11-13T10:30:00Z",
  "executed_volume": "0.01",
  "executed_price": "30000.00"
}
```

### 4. Cancel Order

**Endpoint:** `POST /api2/v1/cancel_order/{orderID}`

**Type:** Private

**Request:**
```javascript
{
  "nonce": 1699900000000
}
```

### 5. Order History

**Endpoint:** `POST /api2/v1/order_history`

**Type:** Private

**Request:**
```javascript
{
  "market": "BTC/GBP", // Optional: filter by market
  "limit": 50, // Optional: max 100
  "nonce": 1699900000000
}
```

**Response:**
```javascript
{
  "orders": [
    {
      "order_id": "order123",
      "market": "BTC/GBP",
      "side": "BUY",
      "status": "FILLED",
      "created_at": "2023-11-13T10:30:00Z"
    }
    // ... more orders
  ]
}
```

---

## Wallet & Balance Operations

### 1. Get Balance

**Endpoint:** `POST /api2/v1/balance`

**Type:** Private

**Request:**
```javascript
{
  "nonce": 1699900000000
}
```

**Response:**
```javascript
{
  "BTC": {
    "available": "0.5",
    "reserved": "0.01", // In open orders
    "total": "0.51"
  },
  "ETH": {
    "available": "2.5",
    "reserved": "0",
    "total": "2.5"
  },
  "GBP": {
    "available": "1000.00",
    "reserved": "0",
    "total": "1000.00"
  }
  // ... all assets
}
```

### 2. Get Deposit Address

**Endpoint:** `POST /api2/v1/deposit_address/{asset}`

**Type:** Private

**Request:**
```javascript
{
  "nonce": 1699900000000
}
```

**Response:**
```javascript
{
  "asset": "BTC",
  "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "network": "bitcoin"
}
```

### 3. Get Transaction Fees

**Endpoint:** `POST /api2/v1/transaction_fees`

**Type:** Private

**Request:**
```javascript
{
  "asset": "BTC", // Optional
  "nonce": 1699900000000
}
```

**Response:**
```javascript
{
  "BTC": {
    "SLOW": "0.0001",
    "MEDIUM": "0.0002",
    "FAST": "0.0005"
  },
  "ETH": {
    "SLOW": "0.001",
    "MEDIUM": "0.002",
    "FAST": "0.005"
  }
}
```

### 4. Get Trading Fees

**Endpoint:** `POST /api2/v1/trading_fees`

**Type:** Private

**Request:**
```javascript
{
  "market": "BTC/GBP", // Optional
  "nonce": 1699900000000
}
```

**Response:**
```javascript
{
  "BTC/GBP": {
    "maker_fee": "0.001", // 0.1%
    "taker_fee": "0.002"  // 0.2%
  }
}
```

### 5. Get Transaction History

**Endpoint:** `POST /api2/v1/transaction_history`

**Type:** Private

**Request:**
```javascript
{
  "asset": "BTC", // Optional
  "type": "DEPOSIT", // Optional: DEPOSIT, WITHDRAWAL, TRADE
  "limit": 50,
  "nonce": 1699900000000
}
```

### 6. Get Address Book

**Endpoint:** `POST /api2/v1/address_book`

**Type:** Private

**Request:**
```javascript
{
  "asset": "BTC", // Optional: filter by asset
  "nonce": 1699900000000
}
```

**Response:**
```javascript
{
  "addresses": [
    {
      "id": "addr123",
      "asset": "BTC",
      "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      "label": "My Hardware Wallet",
      "created_at": "2023-10-01T12:00:00Z"
    }
  ]
}
```

---

## Market Data

### 1. Get Ticker (All Markets)

**Endpoint:** `POST /api2/v1/ticker`

**Type:** Public

**Request:** None (no body needed)

**Response:**
```javascript
{
  "BTC/GBP": {
    "bid": "29950.00",
    "ask": "30050.00",
    "price": "30000.00",
    "volume": "150.5",
    "change_24h": "2.5" // percentage
  },
  "ETH/GBP": {
    "bid": "1950.00",
    "ask": "1955.00",
    "price": "1952.50",
    "volume": "5000.0",
    "change_24h": "1.2"
  }
  // ... all markets
}
```

### 2. Get Ticker (Single Market)

**Endpoint:** `POST /api2/v1/ticker/{market}`

**Type:** Public

**Example:** `POST /api2/v1/ticker/BTC%2FGBP`

**Response:**
```javascript
{
  "bid": "29950.00",
  "ask": "30050.00",
  "price": "30000.00",
  "volume": "150.5",
  "change_24h": "2.5"
}
```

### 3. Get Historical Prices

**Endpoint:** `POST /api2/v1/historical_prices`

**Type:** Public

**Request:**
```javascript
{
  "market": "BTC/GBP",
  "timeframe": "1h", // 1m, 5m, 15m, 1h, 4h, 1d, 1w
  "from": "2023-11-01T00:00:00Z", // Optional
  "to": "2023-11-13T00:00:00Z" // Optional
}
```

**Response:**
```javascript
{
  "market": "BTC/GBP",
  "timeframe": "1h",
  "data": [
    {
      "timestamp": "2023-11-01T00:00:00Z",
      "open": "29000.00",
      "high": "29500.00",
      "low": "28800.00",
      "close": "29200.00",
      "volume": "25.5"
    }
    // ... more candles
  ]
}
```

### 4. Get Order Book

**Endpoint:** `POST /api2/v1/order_book/{market}`

**Type:** Public

**Request:**
```javascript
{
  "depth": 10 // Optional: number of levels (default 10, max 100)
}
```

**Response:**
```javascript
{
  "market": "BTC/GBP",
  "bids": [
    ["29950.00", "0.5"], // [price, volume]
    ["29940.00", "1.2"]
  ],
  "asks": [
    ["30050.00", "0.8"],
    ["30060.00", "2.0"]
  ],
  "timestamp": "2023-11-13T10:30:00Z"
}
```

### 5. Get Markets

**Endpoint:** `POST /api2/v1/markets`

**Type:** Public

**Response:**
```javascript
{
  "markets": [
    {
      "name": "BTC/GBP",
      "base": "BTC",
      "quote": "GBP",
      "min_order_size": "0.0001",
      "price_decimals": 2,
      "volume_decimals": 8
    }
    // ... all markets
  ]
}
```

### 6. Get Supported Assets

**Endpoint:** `POST /api2/v1/supported_assets`

**Type:** Public

**Response:**
```javascript
{
  "crypto": ["BTC", "ETH", "XRP", "LTC", "BCH"],
  "fiat": ["GBP", "EUR", "USD", "CAD", "AUD", "CHF", "JPY", "NZD"]
}
```

### 7. Get Asset Info

**Endpoint:** `POST /api2/v1/asset_info/{asset}`

**Type:** Public

**Response:**
```javascript
{
  "asset": "BTC",
  "name": "Bitcoin",
  "type": "crypto",
  "decimals": 8,
  "min_withdrawal": "0.001",
  "withdrawal_fee": "0.0005"
}
```

### 8. Get Trading Pairs

**Endpoint:** `POST /api2/v1/trading_pairs`

**Type:** Public

**Response:**
```javascript
{
  "pairs": [
    "BTC/GBP",
    "ETH/GBP",
    "XRP/GBP",
    "BTC/EUR",
    "ETH/EUR"
    // ... all pairs
  ]
}
```

---

## Deposits & Withdrawals

### 1. Withdraw Crypto

**Endpoint:** `POST /api2/v1/withdraw/{asset}`

**Type:** Private

**Request:**
```javascript
{
  "volume": "0.1",
  "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "priority": "MEDIUM", // SLOW, MEDIUM, FAST
  "nonce": 1699900000000
}
```

**Response:**
```javascript
{
  "success": true,
  "withdrawal_id": "withdrawal123",
  "asset": "BTC",
  "volume": "0.1",
  "fee": "0.0002",
  "status": "PENDING"
}
```

### 2. Withdraw Fiat (GBP)

**Endpoint:** `POST /api2/v1/withdraw/GBP`

**Type:** Private

**Request:**
```javascript
{
  "volume": "500.00",
  "account_id": "bank_account_123", // NOT 'address' for fiat
  "nonce": 1699900000000
  // NOTE: No 'priority' field for fiat withdrawals
}
```

**Response:**
```javascript
{
  "success": true,
  "withdrawal_id": "withdrawal456",
  "asset": "GBP",
  "volume": "500.00",
  "fee": "0.00",
  "status": "PENDING"
}
```

### 3. Get Deposit History

**Endpoint:** `POST /api2/v1/deposit_history`

**Type:** Private

**Request:**
```javascript
{
  "asset": "BTC", // Optional
  "limit": 50,
  "nonce": 1699900000000
}
```

### 4. Get Withdrawal History

**Endpoint:** `POST /api2/v1/withdrawal_history`

**Type:** Private

**Request:**
```javascript
{
  "asset": "BTC", // Optional
  "limit": 50,
  "nonce": 1699900000000
}
```

### 5. Cancel Withdrawal

**Endpoint:** `POST /api2/v1/cancel_withdrawal/{withdrawalID}`

**Type:** Private

**Request:**
```javascript
{
  "nonce": 1699900000000
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "Withdrawal cancelled"
}
```

---

## Verification & KYC

### 1. Verify Phone

**Endpoint:** `POST /api2/v1/verify_phone`

**Type:** Private

**Request:**
```javascript
{
  "phone_number": "+447700900000",
  "verification_code": "123456",
  "nonce": 1699900000000
}
```

**Response:**
```javascript
{
  "success": true,
  "phone_verified": true
}
```

### 2. Verify Email

**Endpoint:** `POST /api2/v1/verify_email`

**Type:** Private

**Request:**
```javascript
{
  "verification_token": "token_from_email",
  "nonce": 1699900000000
}
```

**Response:**
```javascript
{
  "success": true,
  "email_verified": true
}
```

---

## Account Management

### 1. Get User Info

**Endpoint:** `POST /api2/v1/user_info`

**Type:** Private

**Request:**
```javascript
{
  "nonce": 1699900000000
}
```

**Response:**
```javascript
{
  "user_id": "user123",
  "email": "user@example.com",
  "email_verified": true,
  "phone_verified": true,
  "kyc_status": "VERIFIED",
  "created_at": "2023-01-15T10:00:00Z"
}
```

### 2. Update User Info

**Endpoint:** `POST /api2/v1/update_user_info`

**Type:** Private

**Request:**
```javascript
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+447700900000",
  "nonce": 1699900000000
}
```

### 3. Get Account Settings

**Endpoint:** `POST /api2/v1/account_settings`

**Type:** Private

**Request:**
```javascript
{
  "nonce": 1699900000000
}
```

**Response:**
```javascript
{
  "tfa_enabled": true,
  "email_notifications": true,
  "push_notifications": true
}
```

---

## System Information

### 1. Get API Version

**Endpoint:** `POST /api2/v1/version`

**Type:** Public

**Response:**
```javascript
{
  "version": "2.1.0",
  "build": "20231113"
}
```

### 2. Get Server Time

**Endpoint:** `POST /api2/v1/time`

**Type:** Public

**Response:**
```javascript
{
  "server_time": "2023-11-13T10:30:45Z",
  "timestamp": 1699877445000
}
```

---

## Error Handling

### Common Error Responses

**Invalid Signature:**
```javascript
{
  "error": "Invalid API signature",
  "code": "AUTH_INVALID_SIGNATURE"
}
```

**Nonce Too Low:**
```javascript
{
  "error": "Nonce must be greater than previous nonce",
  "code": "AUTH_NONCE_TOO_LOW",
  "last_nonce": 1699900000000
}
```

**Insufficient Balance:**
```javascript
{
  "error": "Insufficient balance",
  "code": "BALANCE_INSUFFICIENT",
  "available": "0.01",
  "required": "0.05"
}
```

**Invalid Parameters:**
```javascript
{
  "error": "Invalid parameters",
  "code": "VALIDATION_ERROR",
  "details": {
    "volume": "Must be greater than 0"
  }
}
```

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (authentication failed)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (endpoint or resource not found)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error
- `503` - Service Unavailable

---

## Best Practices

### Nonce Management
1. **Always use strictly increasing nonces**: `Date.now() * 1000` (microseconds)
2. **Store last used nonce** in persistent storage
3. **Handle nonce errors**: If you get "nonce too low", sync with server time
4. **Multiple devices**: Each device should maintain separate API keys

### Security
1. **Never log API secrets** in plain text
2. **Store credentials securely**: Use Keychain (iOS) / KeyStore (Android)
3. **Validate SSL certificates** for all API calls
4. **Implement request timeouts** (30 seconds recommended)

### Performance
1. **Cache market data**: Ticker updates every 1-5 seconds
2. **Batch balance requests**: Don't poll balance on every screen
3. **Use WebSockets** for real-time price updates (if available)
4. **Implement exponential backoff** for failed requests

### Testing
1. **Use test environment**: `https://t2.solidi.co` (already the test URL)
2. **Test with small amounts** before production
3. **Verify withdrawal addresses** thoroughly
4. **Test all error scenarios**: insufficient balance, invalid addresses, etc.

---

## Appendices

### A. Supported Cryptocurrencies
- **BTC** - Bitcoin
- **ETH** - Ethereum
- **XRP** - Ripple
- **LTC** - Litecoin
- **BCH** - Bitcoin Cash

### B. Supported Fiat Currencies
- **GBP** - British Pound
- **EUR** - Euro
- **USD** - US Dollar
- **CAD** - Canadian Dollar
- **AUD** - Australian Dollar
- **CHF** - Swiss Franc
- **JPY** - Japanese Yen
- **NZD** - New Zealand Dollar

### C. Trading Pairs
All cryptocurrencies can be traded against all fiat currencies.

**Examples:**
- BTC/GBP, BTC/EUR, BTC/USD
- ETH/GBP, ETH/EUR, ETH/USD
- XRP/GBP, LTC/EUR, BCH/USD

### D. Payment Methods
- **BALANCE** - Use existing account balance
- **CARD** - Debit/Credit card (instant)
- **BANK_TRANSFER** - Bank transfer (1-3 days)

### E. Order Types
- **IMMEDIATE_OR_CANCEL** - Fill immediately or cancel (default for mobile app)
- **LIMIT** - Limit order at specified price
- **MARKET** - Execute at current market price

### F. Withdrawal Priorities
- **SLOW** - Low fee, 30-60 minutes
- **MEDIUM** - Medium fee, 10-30 minutes (default)
- **FAST** - High fee, 5-10 minutes

---

## Notes

1. **All timestamps** are in ISO 8601 format (UTC)
2. **All volumes and prices** are strings to avoid floating-point precision issues
3. **Asset codes** are case-sensitive (BTC, not btc)
4. **Market format** is always `BASE/QUOTE` (e.g., BTC/GBP)
5. **Crypto withdrawals** require `address` and `priority`
6. **Fiat withdrawals** require `account_id` (NOT `address`) and NO `priority`

---

**Last Updated:** 2024-01-13  
**Generated from:** Codebase scan of SolidiMobileApp4
