# Code Logic & Algorithm Documentation

**Solidi Mobile App - Technical Implementation Analysis**

This document provides a comprehensive analysis of the core algorithms, business logic, and architectural patterns used throughout the Solidi Mobile application. It focuses on *how* the code works, not just *what* it does.

---

## Table of Contents

### Core Application Architecture
1. [Application Architecture](#1-application-architecture)
   - 1.1 [Entry Flow](#11-entry-flow)
   - 1.2 [Component Hierarchy](#12-component-hierarchy)

### Security & Authentication
2. [Authentication & Security](#2-authentication--security)
   - 2.1 [HMAC Signature Algorithm](#21-hmac-signature-algorithm)
   - 2.2 [Nonce Management](#22-nonce-management)
   - 2.3 [Credential Storage (Mock Keychain)](#23-credential-storage-mock-keychain)

3. [API Request Management](#3-api-request-management)
   - 3.1 [Request Queue Algorithm](#31-request-queue-algorithm)
   - 3.2 [Request Timeout](#32-request-timeout)

### Trading & Financial Operations
4. [Trading & Order Algorithms](#4-trading--order-algorithms)
   - 4.1 [Order Creation](#41-order-creation)
   - 4.2 [Volume Price Calculation](#42-volume-price-calculation)

5. [Portfolio & Balance Calculations](#5-portfolio--balance-calculations)
   - 5.1 [Portfolio Value Algorithm](#51-portfolio-value-algorithm)
   - 5.2 [Crypto Price Caching](#52-crypto-price-caching)
   - 5.3 [Crypto GBP Value Calculation](#53-crypto-gbp-value-calculation)

6. [Withdrawal Logic](#6-withdrawal-logic)
   - 6.1 [Crypto vs Fiat Withdrawal Differences](#61-crypto-vs-fiat-withdrawal-differences)
   - 6.2 [Withdrawal Response Handling](#62-withdrawal-response-handling)

### State & Navigation Management
7. [State Management](#7-state-management)
   - 7.1 [Navigation & State Transitions](#71-navigation--state-transitions)
   - 7.2 [Auto-Login Flow](#72-auto-login-flow)

8. [Error Handling & Recovery](#8-error-handling--recovery)
   - 8.1 [Global Error Handler](#81-global-error-handler)
   - 8.2 [API Error Handling](#82-api-error-handling)

9. [Performance Optimizations](#9-performance-optimizations)
   - 9.1 [Price Caching Strategy](#91-price-caching-strategy)
   - 9.2 [Request Queuing](#92-request-queuing)
   - 9.3 [Portfolio Calculation Optimization](#93-portfolio-calculation-optimization)

### User Onboarding & Verification
10. [Registration Completion Process](#10-registration-completion-process)
    - 10.1 [Multi-Step Registration Flow](#101-multi-step-registration-flow)
    - 10.2 [Registration Completion Criteria](#102-registration-completion-criteria)

11. [Identity Verification (KYC)](#11-identity-verification-kyc)
    - 11.1 [Document Upload Process](#111-document-upload-process)
    - 11.2 [Verification Status Check](#112-verification-status-check)

### Transaction Management
12. [Transaction & Order History](#12-transaction--order-history)
    - 12.1 [Data Models](#121-data-models)
    - 12.2 [Data Loading Algorithm](#122-data-loading-algorithm)
    - 12.3 [Order Status Tracking](#123-order-status-tracking)

### Security Features
13. [Biometric & PIN Authentication](#13-biometric--pin-authentication)
    - 13.1 [Biometric Authentication Wrapper](#131-biometric-authentication-wrapper)
    - 13.2 [PIN Code Authentication](#132-pin-code-authentication)

### User Profile Management
14. [Personal Details Management](#14-personal-details-management)
    - 14.1 [User Information Structure](#141-user-information-structure)
    - 14.2 [Update Algorithm](#142-update-algorithm)
    - 14.3 [Address Lookup (Postcode Search)](#143-address-lookup-postcode-search)
    - 14.4 [Save Address](#144-save-address)

15. [Address Book & Bank Account Management](#15-address-book--bank-account-management)
    - 15.1 [Address Book Structure](#151-address-book-structure)
    - 15.2 [Address Book Operations](#152-address-book-operations)
    - 15.3 [Bank Account Management](#153-bank-account-management)

### Crypto Operations
16. [Crypto Send & Receive](#16-crypto-send--receive)
    - 16.1 [Send (Withdraw) Crypto](#161-send-withdraw-crypto)
    - 16.2 [Receive (Deposit) Crypto](#162-receive-deposit-crypto)

### Data Visualization
17. [Price Charts & Graph Display](#17-price-charts--graph-display)
    - 17.1 [CoinGecko API Integration](#171-coingecko-api-integration)
    - 17.2 [Chart Rendering (Implementation Ready)](#172-chart-rendering-implementation-ready)

---

## 1. Application Architecture

### 1.1 Entry Flow

**File:** `index.js` → `src/application/index.js` → `App.js`

```javascript
// Entry point structure
index.js
  └── src/application/index.js
       └── App.js
            ├── SecureApp (Biometric wrapper)
            ├── ThemeProvider (Material Design)
            ├── PaperProvider (UI components)
            └── AppStateProvider (Global state)
                 └── SolidiMobileApp (Main app)
```

**Purpose:** This layered structure provides:
- **Security Layer:** Biometric authentication wrapper
- **Theme Layer:** Consistent Material Design styling
- **State Layer:** Centralized AppState context with 6,380+ lines of business logic
- **Main App:** UI components and navigation

### 1.2 Component Hierarchy

```
AppStateProvider (Context)
  │
  ├── Public Components (No auth required)
  │   ├── Login
  │   ├── Register
  │   └── Explore
  │
  └── Private Components (Auth required)
      ├── Home (Dashboard)
      ├── Trade
      │   ├── Buy
      │   └── Sell
      ├── Assets
      │   └── Wallet
      └── Settings
```

**Access Control Algorithm:**
```javascript
// AppState.js
const publicAccessStates = ['Login', 'Register', 'Explore'];

function isPublicState(stateName) {
  return publicAccessStates.includes(stateName);
}

function requiresAuthentication(newState) {
  return !isPublicState(newState);
}
```

---

## 2. Authentication & Security

### 2.1 HMAC Signature Algorithm

**File:** `src/api/SolidiRestAPIClientLibrary.js` (Lines 635-650)

**Purpose:** Cryptographically sign API requests to prevent tampering and replay attacks.

**Algorithm:**
```javascript
signAPICall({path, postData}) {
  // STEP 1: Construct the string to sign
  // Format: signingDomain + apiPath + postDataJSON
  let dataToSign = this.signingDomain + path;
  if (postData) {
    dataToSign += postData;
  }
  
  // STEP 2: Base64 encode the API secret
  let secretBase64 = Buffer.from(this.apiSecret).toString('base64');
  
  // STEP 3: Generate HMAC-SHA256 signature
  let signature = CryptoJS.HmacSHA256(dataToSign, secretBase64);
  
  // STEP 4: Base64 encode the signature
  let signatureBase64 = signature.toString(CryptoJS.enc.Base64);
  
  return signatureBase64;
}
```

**Example:**
```javascript
// Given:
signingDomain = 't2.solidi.co'
path = '/api2/v1/balance'
postData = '{"nonce":1699900000000}'
apiSecret = 'my_secret_key'

// Step 1: dataToSign
't2.solidi.co/api2/v1/balance{"nonce":1699900000000}'

// Step 2: secretBase64
Buffer.from('my_secret_key').toString('base64')
// → 'bXlfc2VjcmV0X2tleQ=='

// Step 3: HMAC signature
CryptoJS.HmacSHA256(dataToSign, secretBase64)

// Step 4: signatureBase64
signature.toString(CryptoJS.enc.Base64)
// → 'j7hKp2V...' (example)
```

**Security Properties:**
- **Integrity:** Any modification to path or postData invalidates the signature
- **Authenticity:** Only holders of the apiSecret can generate valid signatures
- **Non-repudiation:** Server can verify the request came from authenticated user

### 2.2 Nonce Management

**File:** `src/api/SolidiRestAPIClientLibrary.js` (Lines 226-229)

**Purpose:** Prevent replay attacks by ensuring each request has a strictly increasing timestamp.

**Algorithm:**
```javascript
generateNonce() {
  // Generate nonce in microseconds (1000x milliseconds)
  let nonce = Date.now() * 1000;
  
  // CRITICAL: Ensure strict ordering
  // If current nonce <= previous nonce, increment by 1
  if (nonce <= this.prevNonce) {
    nonce = this.prevNonce + 1;
  }
  
  // Store for next comparison
  this.prevNonce = nonce;
  
  return nonce;
}
```

**Why Microseconds?**
- Millisecond precision: `Date.now()` = 1699900000000 (13 digits)
- Microsecond precision: `Date.now() * 1000` = 1699900000000000 (16 digits)
- Allows multiple requests per millisecond while maintaining strict ordering

**Edge Case Handling:**
```javascript
// Scenario: Two API calls within same millisecond
Call 1: nonce = 1699900000000000
Call 2: nonce = 1699900000000000 (same timestamp!)

// Solution: Increment
Call 2: nonce = 1699900000000001 ✅
```

### 2.3 Credential Storage (Mock Keychain)

**File:** `src/application/data/AppState.js` (Lines 36-73)

**Problem:** Native Keychain causes `NativeEventEmitter` crashes in production.

**Solution:** Mock Keychain using AsyncStorage.

**Implementation:**
```javascript
const mockKeychain = {
  // Store credentials
  setInternetCredentials: async (server, username, password) => {
    const key = `keychain_${server}`;
    const data = JSON.stringify({ username, password });
    await AsyncStorage.setItem(key, data);
    console.log(`[Mock Keychain] Stored: ${server} → ${username}`);
  },
  
  // Retrieve credentials
  getInternetCredentials: async (server) => {
    const key = `keychain_${server}`;
    const data = await AsyncStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    return false; // No credentials found
  },
  
  // Delete credentials
  resetInternetCredentials: async (server) => {
    const key = `keychain_${server}`;
    await AsyncStorage.removeItem(key);
    console.log(`[Mock Keychain] Cleared: ${server}`);
  }
};
```

**Usage:**
```javascript
// Store API credentials after successful login
await mockKeychain.setInternetCredentials(
  'api.solidi.co',
  userEmail,
  apiKey
);

// Auto-login on app startup
const credentials = await mockKeychain.getInternetCredentials('api.solidi.co');
if (credentials) {
  await appState.loginWithCredentials(credentials);
}
```

**Trade-offs:**
- ✅ Prevents crashes
- ✅ Works consistently across iOS/Android
- ⚠️ Less secure than native Keychain (but AsyncStorage is still encrypted on device)

---

## 3. API Request Management

### 3.1 Request Queue Algorithm

**File:** `src/api/SolidiRestAPIClientLibrary.js` (Lines 190-210)

**Problem:** Server requires strictly increasing nonces. Concurrent API calls can violate this.

**Solution:** Sequential request processing with queue lock.

**Algorithm:**
```javascript
async queueAPICall(args) {
  // CRITICAL: Only one request at a time
  if (this.activeRequest) {
    // Another request is in progress - wait and retry
    console.log('[QUEUE] Request queued, waiting...');
    
    // Sleep for random 0-10ms to avoid thundering herd
    await sleep(Math.random() / 100);
    
    // Recursive retry
    return this.queueAPICall(args);
  }
  
  // Lock acquired
  this.activeRequest = true;
  console.log('[QUEUE] Lock acquired, processing request');
  
  try {
    // Make the actual API call
    let result = await this.makeAPICall(args);
    return result;
  } finally {
    // Always release lock (even if error)
    this.activeRequest = false;
    console.log('[QUEUE] Lock released');
  }
}
```

**Flow Diagram:**
```
Request A arrives → Lock available? 
                    ↓ YES
                    Acquire lock → Make API call → Release lock
                    
Request B arrives → Lock available?
                    ↓ NO (A is running)
                    Sleep 0-10ms → Retry (recursive)
                    
Request A completes → Release lock
Request B retries → Lock available?
                    ↓ YES
                    Acquire lock → Make API call → Release lock
```

**Why Random Sleep?**
- Prevents **thundering herd problem**
- If 10 requests queue up, they won't all retry simultaneously
- Spreads out retry attempts over 0-10ms window

### 3.2 Request Timeout

**File:** `src/api/SolidiRestAPIClientLibrary.js` (Lines 280-290)

**Implementation:**
```javascript
// Create AbortController for 20-second timeout
const abortController = new AbortController();
const timeoutId = setTimeout(() => {
  abortController.abort();
  console.log('[TIMEOUT] Request aborted after 20 seconds');
}, 20000);

try {
  const response = await fetch(url, {
    signal: abortController.signal,
    ...otherOptions
  });
  clearTimeout(timeoutId);
  return response;
} catch (error) {
  if (error.name === 'AbortError') {
    throw new Error('Request timeout after 20 seconds');
  }
  throw error;
}
```

**Purpose:**
- Prevents hanging requests
- Improves UX (user sees error instead of infinite loading)
- Frees up resources

---

## 4. Trading & Order Algorithms

### 4.1 Order Creation

**File:** `src/api/SolidiRestAPIClientLibrary.js` (Lines 654-690)

**Buy Order:**
```javascript
async createBuyOrder({
  market,           // e.g., "BTC/GBP"
  baseAssetVolume,  // Amount of BTC to buy
  quoteAssetVolume, // Amount of GBP to spend
  orderType = 'IMMEDIATE_OR_CANCEL',  // Default
  paymentMethod = 'BALANCE'            // Default
}) {
  const params = {
    market,
    baseAssetVolume,
    quoteAssetVolume,
    orderType,
    paymentMethod
  };
  
  return await this.privateMethod({
    httpMethod: 'POST',
    apiRoute: 'buy',
    params
  });
}
```

**Sell Order:**
```javascript
async createSellOrder({
  market,           // e.g., "BTC/GBP"
  baseAssetVolume,  // Amount of BTC to sell
  quoteAssetVolume, // Expected GBP amount
  orderType = 'IMMEDIATE_OR_CANCEL',
  paymentMethod = 'BALANCE'
}) {
  const params = {
    market,
    baseAssetVolume,
    quoteAssetVolume,
    orderType,
    paymentMethod
  };
  
  return await this.privateMethod({
    httpMethod: 'POST',
    apiRoute: 'sell',
    params
  });
}
```

**Order Types:**
1. **IMMEDIATE_OR_CANCEL** (default): Execute immediately or cancel
2. **LIMIT**: Place limit order in orderbook
3. **MARKET**: Market order at best available price

**Payment Methods:**
1. **BALANCE**: Use existing account balance
2. **CARD**: Credit/debit card payment
3. **BANK_TRANSFER**: Direct bank transfer

### 4.2 Volume Price Calculation

**File:** `src/application/data/AppState.js` (Lines 4630-4680)

**Purpose:** Get exact price for specific volume (accounts for orderbook depth).

**Algorithm:**
```javascript
async fetchPricesForASpecificVolume({
  market,           // e.g., "BTC/GBP"
  side,             // 'BUY' or 'SELL'
  baseOrQuoteAsset, // 'base' or 'quote'
  baseAssetVolume,  // Amount of BTC (optional)
  quoteAssetVolume  // Amount of GBP (optional)
}) {
  // Validate inputs
  if (!baseAssetVolume && !quoteAssetVolume) {
    throw new Error('One of baseAssetVolume or quoteAssetVolume required');
  }
  
  // Call volume_price API
  const response = await this.privateMethod({
    apiRoute: `volume_price/${market}`,
    params: {
      side,
      baseOrQuoteAsset,
      baseAssetVolume,
      quoteAssetVolume
    }
  });
  
  return response;
}
```

**Scenarios:**

| Scenario | Parameters | Returns |
|----------|-----------|---------|
| "How much GBP for 1 BTC?" | `baseAssetVolume=1, side=SELL` | `quoteAssetVolume` (GBP amount) |
| "How much BTC for £1000?" | `quoteAssetVolume=1000, side=BUY` | `baseAssetVolume` (BTC amount) |

**Important:** Price values **exclude fees**. Fees are returned separately.

---

## 5. Portfolio & Balance Calculations

### 5.1 Portfolio Value Algorithm

**File:** `src/util/portfolioCalculator.js`

**Purpose:** Calculate total portfolio value in GBP from fiat + crypto balances.

**Algorithm:**
```javascript
export const calculatePortfolioValue = (balanceData, appState) => {
  // STEP 1: Initialize fresh totals (no caching to avoid accumulation)
  let freshFiatTotal = 0;
  let freshCryptoTotal = 0;
  const breakdown = { fiat: {}, crypto: {} };
  
  // STEP 2: Define currency types
  const fiatCurrencies = ['GBP', 'EUR', 'USD', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD'];
  const isCrypto = (currency) => !fiatCurrencies.includes(currency);
  
  // STEP 3: Get all currencies from balance data
  const allCurrencies = Object.keys(balanceData);
  const fiat = allCurrencies.filter(c => !isCrypto(c));
  const crypto = allCurrencies.filter(c => isCrypto(c));
  
  // STEP 4: Calculate fiat balances
  for (let currency of fiat) {
    let balance = parseFloat(balanceData[currency].total) || 0;
    
    if (balance > 0) {
      if (currency === 'GBP') {
        // Direct addition for GBP
        freshFiatTotal += balance;
        breakdown.fiat[currency] = balance;
        console.log(`💷 ${currency}: £${balance.toFixed(2)} added`);
      } else {
        // Other fiat currencies need exchange rates (not implemented)
        console.log(`💵 ${currency}: ${balance} (needs exchange rate)`);
      }
    }
  }
  
  // STEP 5: Calculate crypto values using cached prices
  for (let currency of crypto) {
    let balance = parseFloat(balanceData[currency].total) || 0;
    
    if (balance > 0) {
      // Use AppState's cached price calculation
      const gbpValue = appState.calculateCryptoGBPValue(currency, balance);
      
      if (gbpValue > 0) {
        freshCryptoTotal += gbpValue;
        breakdown.crypto[currency] = {
          balance,
          pricePerUnit: gbpValue / balance,
          gbpValue
        };
        console.log(`₿ ${currency}: ${balance} = £${gbpValue.toFixed(2)}`);
      }
    }
  }
  
  // STEP 6: Calculate final total
  const finalTotal = freshFiatTotal + freshCryptoTotal;
  
  console.log(`💼 TOTAL: £${freshFiatTotal.toFixed(2)} (fiat) + £${freshCryptoTotal.toFixed(2)} (crypto) = £${finalTotal.toFixed(2)}`);
  
  return {
    total: finalTotal,
    fiatTotal: freshFiatTotal,
    cryptoTotal: freshCryptoTotal,
    breakdown
  };
};
```

**Key Design Decisions:**

1. **No Caching in Calculator:** Fresh calculation every time to avoid accumulation errors
2. **GBP-Centric:** All values converted to GBP base currency
3. **Separation:** Fiat and crypto calculated separately, then summed
4. **Cached Prices:** Uses AppState's pre-cached crypto prices (updated every 30s)

### 5.2 Crypto Price Caching

**File:** `src/application/data/AppState.js` (Lines 4370-4590)

**Purpose:** Pre-fetch and cache cryptocurrency prices to avoid repeated API calls.

**Algorithm:**
```javascript
// Background updater (runs every 30 seconds)
async updateCryptoRates() {
  console.log('[CRYPTO-CACHE] Background update started');
  
  const newRates = {
    sellPrices: {},      // Mid-price for selling
    buyPrices: {},       // Mid-price for buying
    balancesInGBP: {}    // Pre-calculated balance values
  };
  
  // STEP 1: Fetch ticker data (all markets)
  const ticker = await this.publicMethod({
    apiRoute: 'ticker',
    httpMethod: 'GET'
  });
  
  // Response format: {"BTC/GBP": {"price": "31712.51"}, ...}
  
  // STEP 2: Process each market
  for (let market in ticker) {
    const [crypto, fiat] = market.split('/');
    
    if (fiat === 'GBP') {
      const price = parseFloat(ticker[market].price);
      
      // Store sell price (how much GBP per 1 crypto)
      newRates.sellPrices[crypto] = price;
      
      // Store buy price (same as sell for simplicity)
      newRates.buyPrices[crypto] = price;
      
      // Pre-calculate balance value
      const balance = this.apiData.balance?.[crypto]?.total || 0;
      newRates.balancesInGBP[crypto] = balance * price;
      
      console.log(`[CRYPTO-CACHE] ${crypto}: £${price.toFixed(2)}`);
    }
  }
  
  // STEP 3: Update state (triggers UI re-render)
  this.cryptoRates = newRates;
  
  console.log('[CRYPTO-CACHE] Background update complete');
}

// Start background updates
startCryptoPriceUpdates() {
  // Initial fetch
  this.updateCryptoRates();
  
  // Set up 30-second interval
  this.cryptoPriceUpdateInterval = setInterval(() => {
    this.updateCryptoRates();
  }, 30000);
  
  console.log('[CRYPTO-CACHE] Started (30s interval)');
}
```

**Benefits:**
- ✅ **Performance:** Instant price lookups (no API delay)
- ✅ **Consistency:** All UI components use same cached prices
- ✅ **Reduced Load:** 1 API call per 30s instead of per UI render
- ✅ **Fresh Data:** 30-second updates keep prices current

### 5.3 Crypto GBP Value Calculation

**File:** `src/application/data/AppState.js` (Lines 4590-4600)

**Purpose:** Convert any crypto amount to GBP using cached price.

**Algorithm:**
```javascript
calculateCryptoGBPValue(currency, amount) {
  // Get cached sell price
  const pricePerUnit = this.getCryptoSellPrice(currency);
  
  if (pricePerUnit && amount) {
    // Simple multiplication
    return amount * pricePerUnit;
  }
  
  return 0; // Price not available
}
```

**Example:**
```javascript
// Given:
currency = 'BTC'
amount = 0.5
cachedPrice = £31,712.51 per BTC

// Calculation:
gbpValue = 0.5 * 31712.51 = £15,856.26
```

**Usage:**
```javascript
// In portfolio calculator
const btcBalance = 0.5;
const gbpValue = appState.calculateCryptoGBPValue('BTC', btcBalance);
console.log(`0.5 BTC = £${gbpValue.toFixed(2)}`);
// Output: "0.5 BTC = £15,856.26"
```

---

## 6. Withdrawal Logic

### 6.1 Crypto vs Fiat Withdrawal Differences

**File:** `src/application/data/AppState.js` (Lines 5082-5150)

**Problem:** Crypto and fiat withdrawals use different API parameters.

**Algorithm:**
```javascript
async sendWithdraw({
  asset,      // 'BTC', 'ETH', 'GBP', etc.
  volume,     // Amount to withdraw
  address,    // Destination (crypto address or bank account ID)
  priority,   // Transaction fee priority
  functionName
}) {
  console.log(`🔄 sendWithdraw: ${volume} ${asset} to ${address}`);
  
  // Prepare base parameters
  const params = {
    volume: volume,
    address: address,
    priority: priority
  };
  
  // CRITICAL: Asset-specific handling
  if (asset === 'GBP') {
    // Fiat (GBP) withdrawals
    params.account_id = address;  // Use account_id instead
    delete params.address;         // Remove address field
    delete params.priority;        // GBP doesn't use priority
    
    console.log(`🏦 GBP withdrawal: Using account_id=${address}`);
  } else {
    // Crypto withdrawals
    // Keep address and priority as-is
    console.log(`₿ Crypto withdrawal: Using address=${address}, priority=${priority}`);
  }
  
  // Make API call
  const data = await this.privateMethod({
    httpMethod: 'POST',
    apiRoute: `withdraw/${asset}`,
    params: params,
    functionName
  });
  
  return data;
}
```

**Parameter Differences:**

| Asset Type | Parameters | Example |
|------------|-----------|---------|
| **Crypto** (BTC, ETH) | `{volume, address, priority}` | `{volume: "0.1", address: "1A1z...", priority: "medium"}` |
| **Fiat** (GBP) | `{volume, account_id}` | `{volume: "100", account_id: "12345"}` |

**Why the difference?**
- **Crypto:** Needs blockchain address + fee priority (low/medium/high)
- **Fiat:** Uses bank account ID, fees are fixed (no priority)

### 6.2 Withdrawal Response Handling

**File:** `src/application/data/AppState.js` (Lines 5150-5200)

**Problem:** Withdrawal API returns success messages in various formats.

**Algorithm:**
```javascript
// Parse withdrawal API response
function parseWithdrawalResponse(data) {
  if (!data || typeof data !== 'object') {
    return { success: false, error: 'Invalid response' };
  }
  
  // FORMAT 1: Success message in "error" field (counterintuitive!)
  if (data.error && typeof data.error === 'string') {
    const errorMsg = data.error.toLowerCase();
    
    // Check if it's actually a success message
    const successKeywords = [
      'successfully', 'queued', 'withdrawal', 'processed',
      'submitted', 'completed', 'confirmed', 'sent'
    ];
    
    const isSuccess = successKeywords.some(keyword => 
      errorMsg.includes(keyword)
    );
    
    if (isSuccess) {
      console.log('✅ Success message detected in error field');
      return {
        success: true,
        message: data.error,
        id: data.id,
        originalResponse: data
      };
    }
  }
  
  // FORMAT 2: Classic success (has ID, no error)
  if (data.id && !data.error) {
    console.log('✅ Classic success response with ID');
    return {
      success: true,
      message: `Withdrawal successful! Transaction ID: ${data.id}`,
      id: data.id,
      originalResponse: data
    };
  }
  
  // FORMAT 3: Explicit success field
  if (data.success === true) {
    console.log('✅ Explicit success response');
    return data;
  }
  
  // If none of above, treat as error
  return {
    success: false,
    error: data.error || 'Unknown error',
    originalResponse: data
  };
}
```

**Why So Complex?**

The withdrawal API is inconsistent:

```javascript
// Example 1: Success in "error" field (common)
{
  "error": "Withdrawal successfully queued",
  "id": "tx_12345"
}

// Example 2: Classic format
{
  "id": "tx_12345"
}

// Example 3: Explicit success
{
  "success": true,
  "message": "Withdrawal processed",
  "id": "tx_12345"
}
```

---

## 7. State Management

### 7.1 Navigation & State Transitions

**File:** `src/application/data/AppState.js` (Lines 800-900)

**Purpose:** Manage app navigation with history stack for back button.

**Data Structure:**
```javascript
state = {
  mainPanelState: 'Home',    // Current screen
  navigationHistory: [],      // Stack of previous screens
  navigationParams: {}        // Parameters for current screen
}
```

**Algorithm:**
```javascript
changeMainPanelState({newState, params = {}, addToHistory = true}) {
  console.log(`🧭 Navigation: ${this.mainPanelState} → ${newState}`);
  
  // STEP 1: Check authentication requirement
  const publicStates = ['Login', 'Register', 'Explore'];
  const requiresAuth = !publicStates.includes(newState);
  
  if (requiresAuth && !this.isLoggedIn) {
    console.log('🔒 Requires authentication, redirecting to Login');
    newState = 'Login';
  }
  
  // STEP 2: Add current state to history (if requested)
  if (addToHistory && this.mainPanelState !== newState) {
    this.navigationHistory.push({
      state: this.mainPanelState,
      params: this.navigationParams
    });
    console.log(`📚 History: Added ${this.mainPanelState}`);
  }
  
  // STEP 3: Update state
  this.mainPanelState = newState;
  this.navigationParams = params;
  
  console.log(`✅ Now on: ${newState}`);
  console.log(`📚 History depth: ${this.navigationHistory.length}`);
}

// Go back in history
goBack() {
  if (this.navigationHistory.length > 0) {
    // Pop last state from history
    const previous = this.navigationHistory.pop();
    
    console.log(`⬅️ Going back to: ${previous.state}`);
    
    // Restore previous state (without adding to history again!)
    this.changeMainPanelState({
      newState: previous.state,
      params: previous.params,
      addToHistory: false  // CRITICAL: Don't add to history
    });
  } else {
    console.log('⬅️ No history, staying on current screen');
  }
}
```

**Flow Diagram:**
```
User on Home
  ↓ Navigate to Wallet
  history = [Home]
  current = Wallet
  ↓ Navigate to Send
  history = [Home, Wallet]
  current = Send
  ↓ Press Back
  history = [Home]
  current = Wallet
  ↓ Press Back
  history = []
  current = Home
  ↓ Press Back
  history = []
  current = Home (no change)
```

### 7.2 Auto-Login Flow

**File:** `src/application/data/AppState.js` (Lines 140-230)

**Purpose:** Automatically log in user on app startup using cached credentials.

**Algorithm:**
```javascript
async attemptAutoLogin() {
  console.log('[AUTO-LOGIN] Starting...');
  
  // STEP 1: Check if enabled
  if (!this.autoLoginWithStoredCredentials) {
    console.log('[AUTO-LOGIN] Disabled in config');
    return false;
  }
  
  // STEP 2: Retrieve cached credentials
  const credentials = await mockKeychain.getInternetCredentials('api.solidi.co');
  
  if (!credentials) {
    console.log('[AUTO-LOGIN] No cached credentials found');
    return false;
  }
  
  console.log(`[AUTO-LOGIN] Found credentials for: ${credentials.username}`);
  
  // STEP 3: Validate credentials with API
  const isValid = await this.validateCredentials({
    email: credentials.username,
    apiKey: credentials.password
  });
  
  if (!isValid) {
    console.log('[AUTO-LOGIN] Credentials invalid, clearing cache');
    await mockKeychain.resetInternetCredentials('api.solidi.co');
    return false;
  }
  
  // STEP 4: Log in with cached credentials
  console.log('[AUTO-LOGIN] Credentials valid, logging in...');
  await this.loginWithCredentials(credentials);
  
  // STEP 5: Navigate to Home
  this.changeMainPanelState({
    newState: 'Home',
    addToHistory: false  // Don't add to history (fresh start)
  });
  
  console.log('[AUTO-LOGIN] ✅ Success');
  return true;
}
```

**Sequence:**
```
App Startup
  ↓
attemptAutoLogin()
  ↓
Check mockKeychain
  ↓ Credentials found
Validate with API
  ↓ Valid
Login user
  ↓
Navigate to Home
  ↓
✅ User logged in automatically
```

---

## 8. Error Handling & Recovery

### 8.1 Global Error Handler

**File:** `src/application/data/AppState.js` (Lines 140-180)

**Purpose:** Catch unhandled errors and prevent app crashes.

**Algorithm:**
```javascript
// Global error handler (catches all unhandled errors)
ErrorUtils.setGlobalHandler((error, isFatal) => {
  console.error('❌ [GLOBAL ERROR]', error);
  console.error(`❌ Fatal: ${isFatal}`);
  
  // STEP 1: Store crash log
  const crashLog = {
    timestamp: new Date().toISOString(),
    error: error.toString(),
    stack: error.stack,
    isFatal,
    appState: this.mainPanelState
  };
  
  // Save to AsyncStorage
  AsyncStorage.setItem(
    'crash_log_' + Date.now(),
    JSON.stringify(crashLog)
  );
  
  // STEP 2: Report to server (if online)
  if (this.isOnline) {
    this.reportCrashToServer(crashLog);
  }
  
  // STEP 3: Emergency fallback state
  if (isFatal) {
    console.log('❌ Fatal error, triggering emergency fallback');
    this.emergencyFallback();
  }
});

// Emergency fallback (reset to safe state)
emergencyFallback() {
  console.log('🚨 EMERGENCY FALLBACK ACTIVATED');
  
  // Reset to login screen (public, no auth required)
  this.mainPanelState = 'Login';
  this.navigationHistory = [];
  
  // Clear any pending operations
  this.activeRequest = false;
  
  // Show error to user
  this.showErrorDialog({
    title: 'Unexpected Error',
    message: 'The app has been reset to a safe state. Please try logging in again.'
  });
}
```

**Purpose:**
- ✅ Prevent complete app crash
- ✅ Store crash logs for debugging
- ✅ Report to server for analysis
- ✅ Reset to safe state (Login screen)

### 8.2 API Error Handling

**File:** `src/api/SolidiRestAPIClientLibrary.js` (Lines 300-350)

**Algorithm:**
```javascript
async makeAPICall({apiRoute, params, httpMethod}) {
  try {
    // Make API request
    const response = await fetch(url, options);
    const data = await response.json();
    
    // Check for API error
    if (data.error && data.error !== null) {
      console.error(`❌ API Error: ${data.error}`);
      
      // Display error to user
      this.showErrorDialog({
        title: 'API Error',
        message: data.error
      });
      
      // Return sentinel value (not null, to avoid crashes)
      return 'DisplayedError';
    }
    
    return data;
    
  } catch (error) {
    console.error(`❌ Network Error:`, error);
    
    // User-friendly error message
    let message = 'Network error. Please check your connection.';
    
    if (error.name === 'AbortError') {
      message = 'Request timeout. Please try again.';
    }
    
    this.showErrorDialog({
      title: 'Error',
      message
    });
    
    return 'DisplayedError';
  }
}
```

**Key Pattern:** Return `'DisplayedError'` instead of throwing, so callers can handle gracefully:

```javascript
// Caller code
const balance = await this.loadBalances();
if (balance === 'DisplayedError') {
  // Error already shown to user, just return
  return;
}
// Continue with balance...
```

---

## 9. Performance Optimizations

### 9.1 Price Caching Strategy

**Problem:** Portfolio screen needs prices for all cryptocurrencies. Without caching, this would require 10+ API calls per render.

**Solution:** Pre-fetch all prices every 30 seconds and cache in memory.

**Benefits:**
- ✅ **UI Speed:** Instant portfolio calculation (no API delay)
- ✅ **Reduced Load:** 1 API call per 30s instead of 10+ per render
- ✅ **Consistency:** All components use same cached prices
- ✅ **Fresh Data:** 30s updates are frequent enough for crypto markets

**Implementation:** See section 5.2 (Crypto Price Caching)

### 9.2 Request Queuing

**Problem:** Server rejects concurrent requests due to nonce ordering violations.

**Solution:** Sequential request processing with queue lock.

**Benefits:**
- ✅ **Reliability:** 100% of requests have valid nonces
- ✅ **Simplicity:** No complex nonce synchronization logic
- ⚠️ **Trade-off:** Slightly slower (sequential vs parallel), but necessary

**Implementation:** See section 3.1 (Request Queue Algorithm)

### 9.3 Portfolio Calculation Optimization

**Problem:** Portfolio calculation involves loops over all cryptocurrencies. If done naively, can be slow.

**Solution:** Use cached prices instead of API calls inside the loop.

**Algorithm:**
```javascript
// ❌ SLOW: API call inside loop
for (let currency of cryptocurrencies) {
  const price = await fetchPrice(currency);  // Wait for API
  total += balance * price;
}

// ✅ FAST: Use cached prices
for (let currency of cryptocurrencies) {
  const price = this.getCryptoSellPrice(currency);  // Instant
  total += balance * price;
}
```

**Performance Difference:**
- **Slow version:** 10 currencies × 200ms API latency = 2,000ms
- **Fast version:** 10 currencies × 0ms (cached) = ~1ms

**1000x faster!**

---

## Summary

### Core Algorithms Identified

1. **HMAC Signature:** Cryptographic signing using HMAC-SHA256
2. **Nonce Management:** Strictly increasing timestamps in microseconds
3. **Request Queue:** Sequential processing to maintain nonce ordering
4. **Portfolio Calculation:** Fiat + Crypto value aggregation with cached prices
5. **Price Caching:** 30-second background updates for all crypto prices
6. **Withdrawal Logic:** Asset-specific parameter handling (crypto vs fiat)
7. **Navigation:** State machine with history stack for back button
8. **Auto-Login:** Cached credential validation and automatic sign-in
9. **Error Handling:** Global error handler with emergency fallback
10. **Performance:** Caching strategy for instant UI updates

### Key Design Patterns

- **Sequential Processing:** API request queue
- **Caching:** Crypto prices updated every 30s
- **Retry Logic:** Sleep + recursive retry for queue
- **State Machine:** Navigation with history stack
- **Fail-Safe:** Global error handler → emergency fallback
- **Mock Implementation:** Keychain → AsyncStorage (crash prevention)

### Files Analyzed

| File | Lines | Key Algorithms |
|------|-------|----------------|
| `AppState.js` | 6,380 | State management, balance loading, price caching, withdrawal logic |
| `SolidiRestAPIClientLibrary.js` | 746 | HMAC signing, nonce generation, request queue, timeout handling |
| `portfolioCalculator.js` | 150 | Portfolio value calculation, crypto→GBP conversion |
| `Home.js` | 2,078 | Dashboard rendering, balance display |
| `Wallet.js` | 893 | Asset management UI |
| `Buy.js` | 764 | Buy order UI |
| `Sell.js` | 824 | Sell order UI |
| **Total** | **11,835** | **10 core algorithms documented** |

---

## 10. Registration Completion Process

### 10.1 Multi-Step Registration Flow

**File:** `src/application/SolidiMobileApp/components/MainPanel/components/RegistrationCompletion/RegistrationCompletion.js`

**Purpose:** Guide new users through a sequential 4-step verification and onboarding process.

**Steps:**
```javascript
const steps = [
  { id: 'email', title: 'Email Verification', component: 'EmailVerification' },
  { id: 'phone', title: 'Phone Verification', component: 'PhoneVerification' },
  { id: 'extra', title: 'Extra Information', component: 'AccountUpdate' },
  { id: 'evaluation', title: 'Evaluation', component: 'AccountReview' }
];
```

**Step Determination Algorithm:**
```javascript
async determineUserStep() {
  // STEP 1: Check if this is a new registration
  const isNewRegistration = appState.registrationSuccess || 
                            appState.registrationEmail;
  
  if (isNewRegistration) {
    console.log('Fresh registration - start from email verification');
    setCurrentStep(0);
    setCompletedSteps(new Set());
    return 0;
  }
  
  // STEP 2: Check authentication credentials
  const userUuid = appState.user?.uuid || appState.user?.info?.user?.uuid;
  const isAuthenticated = appState.user?.isAuthenticated;
  const hasCredentials = userUuid && isAuthenticated;
  
  // STEP 3: For non-authenticated users, check verification status
  if (!hasCredentials) {
    const emailVerified = appState.emailVerified || 
                         appState.user?.emailVerified || false;
    const phoneVerified = appState.phoneVerified || 
                         appState.user?.phoneVerified || false;
    
    if (!emailVerified) {
      return 0; // Start at email verification
    }
    
    if (emailVerified && !phoneVerified) {
      setCompletedSteps(new Set(['email']));
      return 1; // Move to phone verification
    }
  }
  
  // STEP 4: For authenticated users, check completion status
  if (hasCredentials) {
    const userInfo = appState.userInfo || 
                    appState.user?.info?.user || 
                    appState.user || {};
    const userAppropriate = userInfo?.appropriate;
    const userCat = userInfo?.cat;
    
    // EARLY EXIT: If already passed evaluation
    if (userCat !== null && userCat !== undefined) {
      if (userAppropriate === 'PASS' || 
          userAppropriate === 'PASSED' || 
          (userCat === 1 && userAppropriate === 1)) {
        console.log('Registration already complete!');
        handleAllStepsComplete();
        return null;
      }
    }
    
    // STEP 5: Check if extra information is required
    const extraInfoData = await appState.privateMethod({
      apiRoute: 'user/extra_information/check',
      params: {}
    });
    
    if (extraInfoData && Array.isArray(extraInfoData) && 
        extraInfoData.length > 0) {
      console.log('Extra information required - step 3');
      setCurrentStep(2);
      setCompletedSteps(new Set(['email', 'phone']));
      return 2;
    }
    
    // STEP 6: Check if categorization is required
    const catData = await appState.privateMethod({
      apiRoute: 'user/cat',
      params: {}
    });
    
    if (catData?.cat === null || catData?.cat === undefined) {
      console.log('Categorization required - step 4');
      setCurrentStep(3);
      setCompletedSteps(new Set(['email', 'phone', 'extra']));
      return 3;
    }
  }
  
  // Default: All steps complete
  handleAllStepsComplete();
  return null;
}
```

**Key Features:**
- ✅ **Sequential Flow:** Each step must be completed before the next unlocks
- ✅ **State Persistence:** Tracks completed steps to resume from correct position
- ✅ **Smart Detection:** Automatically determines appropriate starting step
- ✅ **Early Completion Check:** Detects already-completed registrations

### 10.2 Registration Completion Criteria

**Algorithm:**
```javascript
function isRegistrationComplete(userInfo) {
  // Registration is complete when:
  // 1. Email verified
  // 2. Phone verified
  // 3. Extra information provided (if required)
  // 4. User categorized (cat field is not null)
  // 5. User evaluated as appropriate (appropriate = 'PASS' or cat=1 with appropriate=1)
  
  const emailVerified = userInfo.emailVerified === true;
  const phoneVerified = userInfo.phoneVerified === true;
  const hasCat = userInfo.cat !== null && userInfo.cat !== undefined;
  const isAppropriate = userInfo.appropriate === 'PASS' || 
                        userInfo.appropriate === 'PASSED' ||
                        (userInfo.cat === 1 && userInfo.appropriate === 1);
  
  return emailVerified && phoneVerified && hasCat && isAppropriate;
}
```

---

## 11. Identity Verification (KYC)

### 11.1 Document Upload Process

**File:** `src/application/SolidiMobileApp/components/MainPanel/components/IdentityVerification/IdentityVerification.js`

**Purpose:** Allow users to upload identity documents and proof of address for KYC verification.

**Supported Identity Documents:**
```javascript
const identityDocumentTypes = {
  passportUK: 'UK Passport',
  passportInternational: 'International Passport',
  photocardDriversLicenceUK: 'UK Driver\'s Licence photocard'
};
```

**Supported Address Documents:**
```javascript
const addressDocumentTypes = {
  photocardDriversLicenceUK: 'UK Driver\'s Licence photocard',
  councilTaxBill: 'Council Tax Bill (max 3 months old)',
  utilityBill: 'Utility Bill (excluding mobile phone / TV licence) (max 3 months old)',
  bankStatement: 'Bank / Building Society statement (max 3 months old)',
  mortgageStatement: 'Mortgage statement (max 12 months old)',
  taxNotification: 'HMRC Tax Notification (excluding P60) (max 12 months old)'
};
```

**Upload Algorithm:**
```javascript
async uploadDocument({
  documentType,  // 'identity' or 'address'
  fileURI,       // Local file URI from camera/gallery
  fileExtension, // 'jpg', 'png', 'pdf'
  selectedType   // Document type from dropdown
}) {
  try {
    // STEP 1: Read file as base64
    const base64Data = await RNFS.readFile(fileURI, 'base64');
    
    // STEP 2: Prepare upload parameters
    const params = {
      documentType: selectedType,
      fileData: base64Data,
      fileExtension: fileExtension
    };
    
    // STEP 3: Upload to API
    const apiRoute = documentType === 'identity' 
      ? 'private_upload/document/identity'
      : 'private_upload/document/address';
    
    const response = await appState.privateMethod({
      httpMethod: 'POST',
      apiRoute: apiRoute,
      params: params
    });
    
    // STEP 4: Check response
    if (response && !response.error) {
      console.log(`✅ ${documentType} document uploaded successfully`);
      
      // Mark as successfully uploaded
      if (documentType === 'identity') {
        setIdentityUploadedSuccessfully(true);
      } else {
        setAddressUploadedSuccessfully(true);
      }
      
      return { success: true };
    } else {
      throw new Error(response.error || 'Upload failed');
    }
    
  } catch (error) {
    console.error(`❌ ${documentType} upload error:`, error);
    return { success: false, error: error.message };
  }
}
```

**Camera/Gallery Integration:**
```javascript
// Launch camera
const launchCameraForDocument = async (documentType) => {
  // Request camera permission
  const cameraPermission = await check(PERMISSIONS.IOS.CAMERA);
  
  if (cameraPermission !== RESULTS.GRANTED) {
    const requestResult = await request(PERMISSIONS.IOS.CAMERA);
    if (requestResult !== RESULTS.GRANTED) {
      Alert.alert('Permission Denied', 'Camera access is required');
      return;
    }
  }
  
  // Launch camera
  const result = await launchCamera({
    mediaType: 'photo',
    quality: 0.8,
    saveToPhotos: false
  });
  
  if (result.didCancel) {
    console.log('User cancelled camera');
    return;
  }
  
  if (result.assets && result.assets.length > 0) {
    const photo = result.assets[0];
    const fileURI = photo.uri;
    const fileExtension = photo.fileName?.split('.').pop() || 'jpg';
    
    // Store for upload
    if (documentType === 'identity') {
      setTakePhoto1FileURI(fileURI);
      setTakePhoto1FileExtension(fileExtension);
    } else {
      setTakePhoto2FileURI(fileURI);
      setTakePhoto2FileExtension(fileExtension);
    }
  }
};
```

### 11.2 Verification Status Check

**API Call:**
```javascript
async fetchIdentityVerificationDetails() {
  const response = await this.privateMethod({
    apiRoute: 'identity_verification_details',
    httpMethod: 'GET',
    params: {}
  });
  
  return response;
  // Response format:
  // {
  //   identityDocument: { status: 'approved' | 'pending' | 'rejected', type: '...' },
  //   proofOfAddress: { status: 'approved' | 'pending' | 'rejected', type: '...' }
  // }
}
```

---

## 12. Transaction & Order History

### 12.1 Data Models

**File:** `src/application/SolidiMobileApp/components/MainPanel/components/History/HistoryDataModel.js`

**Transaction Data Model:**
```javascript
class TransactionDataModel {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.date = data.date || new Date().toISOString().split('T')[0];
    this.time = data.time || '00:00:00';
    this.code = data.code || 'PI'; // Transaction code
    this.baseAsset = data.baseAsset || 'BTC';
    this.baseAssetVolume = data.baseAssetVolume || '0';
    this.quoteAsset = data.quoteAsset || '';
    this.quoteAssetVolume = data.quoteAssetVolume || '0';
    this.status = data.status || 'completed';
    this.fee = data.fee || '0';
    this.feeAsset = data.feeAsset || '';
    
    // Derive type from code
    this.type = this.codeToType(this.code);
  }
  
  codeToType(code) {
    const typeMap = {
      'PI': 'Payment In',
      'PO': 'Payment Out',
      'FI': 'Funds In',
      'FO': 'Funds Out',
      'BY': 'Buy Order',
      'SL': 'Sell Order'
    };
    return typeMap[code] || 'Transaction';
  }
  
  getIcon() {
    const iconMap = {
      'PI': 'cash-plus',
      'PO': 'cash-minus',
      'FI': 'bank-transfer-in',
      'FO': 'bank-transfer-out',
      'BY': 'trending-up',
      'SL': 'trending-down'
    };
    return iconMap[this.code] || 'swap-horizontal';
  }
  
  getColor() {
    const colorMap = {
      'PI': '#4CAF50', // Green
      'PO': '#F44336', // Red
      'FI': '#2196F3', // Blue
      'FO': '#FF9800', // Orange
      'BY': '#9C27B0', // Purple
      'SL': '#607D8B'  // Blue Grey
    };
    return colorMap[this.code] || '#757575';
  }
}
```

**Order Data Model:**
```javascript
class OrderDataModel {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.market = data.market || 'BTC/USD';
    this.side = data.side || 'BUY';
    this.baseVolume = data.baseVolume || '0';
    this.quoteVolume = data.quoteVolume || '0';
    this.status = data.status || 'LIVE';
    this.date = data.date || new Date().toISOString().split('T')[0];
    this.time = data.time || '00:00:00';
    this.price = data.price || '0';
    this.type = data.type || 'IOC'; // Immediate or Cancel
    
    // Settlement tracking
    this.settlement1Id = data.settlement1Id || null;
    this.settlement1Status = data.settlement1Status || null;
    this.settlement2Id = data.settlement2Id || null;
    this.settlement2Status = data.settlement2Status || null;
  }
  
  getStatusColor() {
    const colorMap = {
      'LIVE': '#4CAF50',      // Green
      'SETTLED': '#2196F3',   // Blue
      'CANCELLED': '#F44336', // Red
      'PENDING': '#FF9800',   // Orange
      'PARTIAL': '#9C27B0'    // Purple
    };
    return colorMap[this.status] || '#757575';
  }
  
  getIcon() {
    return this.side === 'BUY' ? 'trending-up' : 'trending-down';
  }
  
  isClickable() {
    return this.status === 'SETTLED';
  }
}
```

### 12.2 Data Loading Algorithm

**File:** `src/application/data/AppState.js`

```javascript
// Load transactions from API
async loadTransactions() {
  const response = await this.privateMethod({
    apiRoute: 'transactions',
    httpMethod: 'GET',
    params: {}
  });
  
  if (response === 'DisplayedError') return;
  
  // Store in AppState
  this.apiData.transactions = response;
  
  return response;
}

// Get transactions with fallback
getTransactions() {
  if (this.apiData?.transactions) {
    return this.apiData.transactions;
  }
  return []; // Return empty array as fallback
}

// Load orders from API
async loadOrders() {
  const response = await this.privateMethod({
    apiRoute: 'orders',
    httpMethod: 'GET',
    params: {}
  });
  
  if (response === 'DisplayedError') return;
  
  // Store in AppState
  this.apiData.orders = response;
  
  return response;
}

// Get orders with fallback
getOrders() {
  if (this.apiData?.orders) {
    return this.apiData.orders;
  }
  return []; // Return empty array as fallback
}
```

### 12.3 Order Status Tracking

**API:** `GET /api2/v1/order_status/{orderId}`

```javascript
async getOrderStatus(orderId) {
  const response = await this.privateMethod({
    apiRoute: `order_status/${orderId}`,
    httpMethod: 'GET'
  });
  
  return response;
  // Response format:
  // {
  //   id: 'order_123',
  //   status: 'SETTLED',
  //   market: 'BTC/GBP',
  //   side: 'BUY',
  //   baseVolume: '0.5',
  //   quoteVolume: '15000',
  //   settlements: [...]
  // }
}
```

---

## 13. Biometric & PIN Authentication

### 13.1 Biometric Authentication Wrapper

**File:** `src/components/BiometricAuth/SecureApp.js`

**Purpose:** Wrap the main app with biometric authentication layer (optional - can be disabled for persistent login).

**Modes:**
1. **Persistent Login Mode (Active):** Skip biometric auth, use cached credentials
2. **Biometric Mode (Available):** Require biometric auth on app launch/resume

**Persistent Login Implementation:**
```javascript
class SecureApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      authRequired: false,
      skipAuth: true, // PERSISTENT LOGIN MODE
      isLoading: true
    };
  }

  async initializeBiometricAuth() {
    console.log('PERSISTENT LOGIN MODE');
    console.log('Biometric authentication: COMPLETELY DISABLED');
    console.log('Auto-login handled by AppState constructor');
    
    // Always allow access immediately
    this.setState({ 
      authRequired: false,
      isAuthenticated: true,
      isLoading: false
    });
    
    // AppState handles authentication with cached credentials
  }
  
  handleAppStateChange(nextAppState) {
    const { skipAuth } = this.state;
    
    // PERSISTENT LOGIN: Never re-authenticate on app state changes
    if (skipAuth) {
      console.log('PERSISTENT LOGIN: Skipping re-auth on app state change');
      console.log('User remains logged in');
      return;
    }
    
    // Standard biometric flow (if enabled)
    if (nextAppState === 'active' && this.state.appState === 'background') {
      // Re-authenticate when app comes to foreground
      this.performBiometricAuth();
    }
  }
}
```

**Biometric Authentication (When Enabled):**
```javascript
async performBiometricAuth() {
  try {
    // Check if biometrics are available
    const info = await biometricAuth.isBiometricAvailable();
    
    if (!info.available) {
      console.log('Biometrics not available');
      return;
    }
    
    console.log(`Biometric type: ${info.biometryType}`); // 'FaceID' or 'TouchID'
    
    // Perform authentication
    const result = await biometricAuth.authenticate({
      reason: 'Unlock Solidi App',
      fallbackLabel: 'Use Passcode',
      cancelLabel: 'Cancel'
    });
    
    if (result.success) {
      console.log('✅ Biometric authentication successful');
      this.setState({ isAuthenticated: true });
    } else {
      console.log('❌ Biometric authentication failed');
      this.setState({ authError: result.error });
    }
    
  } catch (error) {
    console.error('Biometric auth error:', error);
  }
}
```

### 13.2 PIN Code Authentication

**File:** `src/application/data/AppState.js`

**Mock PIN Implementation (Prevents Crashes):**
```javascript
// Mock deleteUserPinCode function
const deleteUserPinCode = async (appName) => {
  console.log(`[MockPinCode] deleteUserPinCode called for app: ${appName}`);
  await AsyncStorage.removeItem(`pincode_${appName}`);
  return true;
};

// Delete PIN on logout
async logout() {
  console.log('Logging out user...');
  
  // Clear PIN code
  await deleteUserPinCode(this.appName);
  
  // Clear credentials
  await mockKeychain.resetInternetCredentials('api.solidi.co');
  
  // Reset state
  this.user.isAuthenticated = false;
  this.mainPanelState = 'Login';
  
  console.log('Logout complete');
}
```

**Note:** Native PIN library disabled to prevent `NativeEventEmitter` crashes. PIN functionality uses mock implementation with AsyncStorage.

---

## 14. Personal Details Management

### 14.1 User Information Structure

**File:** `src/application/SolidiMobileApp/components/MainPanel/components/PersonalDetails/PersonalDetails.js`

**Editable Fields:**
```javascript
const userInfoFields = {
  // Basic Information
  title: 'Mr' | 'Mrs' | 'Miss' | 'Ms' | 'Dr',
  firstName: String,
  middleNames: String,
  lastName: String,
  dateOfBirth: 'YYYY-MM-DD',
  gender: 'Male' | 'Female' | 'Other',
  
  // Contact Information
  email: String,
  mobile: String (with country code),
  landline: String (optional),
  
  // Address Information
  postcode: String,
  address_1: String, // Main address line
  address_2: String, // Secondary address line
  address_3: String, // Tertiary address line
  address_4: String, // Town/City
  
  // Additional
  citizenship: String (country code, e.g., 'GB'),
  country: String
};
```

### 14.2 Update Algorithm

```javascript
async updatePersonalDetails(field, value) {
  try {
    console.log(`Updating ${field} to:`, value);
    
    // STEP 1: Validate input
    const validationResult = validateField(field, value);
    if (!validationResult.valid) {
      setErrorDisplay({
        [field]: validationResult.error
      });
      return { success: false, error: validationResult.error };
    }
    
    // STEP 2: Update via API
    const response = await appState.privateMethod({
      httpMethod: 'POST',
      apiRoute: 'user/update_user',
      params: {
        [field]: value
      }
    });
    
    if (response === 'DisplayedError') {
      return { success: false };
    }
    
    // STEP 3: Update local state
    appState.setUserInfo({ detail: field, value });
    
    // STEP 4: Clear any error messages
    setErrorDisplay({
      [field]: ''
    });
    
    console.log(`✅ ${field} updated successfully`);
    return { success: true };
    
  } catch (error) {
    console.error(`Error updating ${field}:`, error);
    setErrorDisplay({
      [field]: error.message
    });
    return { success: false, error: error.message };
  }
}
```

### 14.3 Address Lookup (Postcode Search)

```javascript
async searchPostcode(postcode) {
  try {
    setDisableSearchPostcodeButton(true);
    
    // Call postcode lookup API
    const response = await appState.privateMethod({
      apiRoute: 'postcode_lookup',
      params: { postcode }
    });
    
    if (response && Array.isArray(response.addresses)) {
      // Show address selection dialog
      const selectedAddress = await showAddressSelection(response.addresses);
      
      if (selectedAddress) {
        // Populate address fields
        setAddress({
          address_1: selectedAddress.line1,
          address_2: selectedAddress.line2,
          address_3: selectedAddress.line3,
          address_4: selectedAddress.town
        });
        setPostcode(postcode);
      }
    }
    
    setDisableSearchPostcodeButton(false);
    
  } catch (error) {
    console.error('Postcode lookup error:', error);
    setDisableSearchPostcodeButton(false);
  }
}
```

### 14.4 Save Address

```javascript
async saveAddress() {
  try {
    setDisableSaveAddressButton(true);
    
    // Validate all address fields
    if (!postcode || !address.address_1) {
      Alert.alert('Error', 'Postcode and first address line are required');
      return;
    }
    
    // Submit address to API
    const response = await appState.privateMethod({
      httpMethod: 'POST',
      apiRoute: 'provide_address',
      params: {
        postcode: postcode,
        address_1: address.address_1,
        address_2: address.address_2,
        address_3: address.address_3,
        address_4: address.address_4
      }
    });
    
    if (response === 'DisplayedError') {
      setDisableSaveAddressButton(false);
      return;
    }
    
    // Update AppState
    appState.setUserInfo({ detail: 'postcode', value: postcode });
    appState.setUserInfo({ detail: 'address_1', value: address.address_1 });
    appState.setUserInfo({ detail: 'address_2', value: address.address_2 });
    appState.setUserInfo({ detail: 'address_3', value: address.address_3 });
    appState.setUserInfo({ detail: 'address_4', value: address.address_4 });
    
    Alert.alert('Success', 'Address saved successfully');
    setDisableSaveAddressButton(false);
    
  } catch (error) {
    console.error('Save address error:', error);
    setDisableSaveAddressButton(false);
  }
}
```

---

## 15. Address Book & Bank Account Management

### 15.1 Address Book Structure

**File:** `src/application/SolidiMobileApp/components/MainPanel/components/AddressBook/AddressBookManagement.js`

**Address Types:**
```javascript
const addressTypes = {
  CRYPTO_HOSTED: 'Hosted Wallet (Exchange/Custodian)',
  CRYPTO_UNHOSTED: 'Personal Wallet (Self-custody)',
  FIAT: 'Bank Account'
};
```

**Address Data Model:**
```javascript
const addressEntry = {
  id: String,              // Unique identifier
  name: String,            // User-friendly name
  assetType: String,       // 'BTC', 'ETH', 'GBP', etc.
  type: String,            // 'CRYPTO_HOSTED', 'CRYPTO_UNHOSTED', 'FIAT'
  address: String | Object, // Crypto address or bank details
  verified: Boolean,       // Email verification status
  createdAt: String,       // ISO timestamp
  lastUsed: String         // ISO timestamp of last withdrawal
};
```

### 15.2 Address Book Operations

**Load Addresses:**
```javascript
async loadAddresses() {
  try {
    setIsLoading(true);
    
    // Fetch from API
    const response = await appState.privateMethod({
      apiRoute: 'address_book',
      httpMethod: 'GET'
    });
    
    if (response === 'DisplayedError') {
      setIsLoading(false);
      return;
    }
    
    // Transform API response to address models
    const addressList = response.map(addr => ({
      id: addr.id,
      name: addr.name || 'Unnamed Address',
      assetType: addr.asset_type,
      type: addr.type,
      address: addr.address,
      verified: addr.verified || false,
      createdAt: addr.created_at,
      lastUsed: addr.last_used
    }));
    
    setAddresses(addressList);
    setIsLoading(false);
    
  } catch (error) {
    console.error('Load addresses error:', error);
    setError('Failed to load address book');
    setIsLoading(false);
  }
}
```

**Add New Address:**
```javascript
async addAddress({
  name,
  assetType,
  type,
  address
}) {
  try {
    // Validate inputs
    if (!name || !assetType || !address) {
      Alert.alert('Error', 'All fields are required');
      return { success: false };
    }
    
    // Submit to API
    const response = await appState.privateMethod({
      httpMethod: 'POST',
      apiRoute: 'address_book/add',
      params: {
        name,
        asset_type: assetType,
        type,
        address
      }
    });
    
    if (response === 'DisplayedError') {
      return { success: false };
    }
    
    // Reload address book
    await loadAddresses();
    
    Alert.alert('Success', 'Address added successfully');
    return { success: true };
    
  } catch (error) {
    console.error('Add address error:', error);
    Alert.alert('Error', 'Failed to add address');
    return { success: false, error: error.message };
  }
}
```

**Delete Address:**
```javascript
async deleteAddress(addressId) {
  try {
    // Confirm deletion
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // Delete via API
            const response = await appState.privateMethod({
              httpMethod: 'POST',
              apiRoute: `address_book/delete/${addressId}`,
              params: {}
            });
            
            if (response !== 'DisplayedError') {
              // Reload address book
              await loadAddresses();
              Alert.alert('Success', 'Address deleted');
            }
          }
        }
      ]
    );
    
  } catch (error) {
    console.error('Delete address error:', error);
    Alert.alert('Error', 'Failed to delete address');
  }
}
```

### 15.3 Bank Account Management

**File:** `src/application/SolidiMobileApp/components/MainPanel/components/Wallet/Wallet.js`

**Bank Account Structure (GBP):**
```javascript
const bankAccount = {
  accountName: String,    // e.g., "John Smith"
  sortCode: String,       // e.g., "12-34-56"
  accountNumber: String,  // e.g., "12345678"
  accountId: String       // Unique ID for API calls
};
```

**Load Bank Account:**
```javascript
async loadBankAccount(asset) {
  if (asset !== 'GBP') return null;
  
  try {
    console.log('[BANK-ACCOUNT] Loading default bank account for GBP...');
    
    // Get from AppState
    const bankAccount = appState.getDefaultAccountForAsset('GBP');
    
    if (bankAccount) {
      console.log('[BANK-ACCOUNT] ✅ Bank account loaded');
      console.log('[BANK-ACCOUNT] Account name:', bankAccount.accountName);
      console.log('[BANK-ACCOUNT] Sort code:', bankAccount.sortCode);
      console.log('[BANK-ACCOUNT] Account number:', bankAccount.accountNumber);
      
      setUserBankAccount(bankAccount);
      return bankAccount;
    } else {
      console.log('[BANK-ACCOUNT] No default bank account found');
      return null;
    }
    
  } catch (error) {
    console.error('[BANK-ACCOUNT] Error loading:', error);
    return null;
  }
}
```

**Add/Update Bank Account:**
```javascript
async updateBankAccount({
  asset,
  accountName,
  sortCode,
  accountNumber
}) {
  try {
    const response = await appState.privateMethod({
      httpMethod: 'POST',
      apiRoute: `default_account/${asset}`,
      params: {
        accountName,
        sortCode,
        accountNumber
      }
    });
    
    if (response === 'DisplayedError') {
      return { success: false };
    }
    
    // Update local state
    appState.user.info.defaultAccount[asset] = {
      accountName,
      sortCode,
      accountNumber
    };
    
    Alert.alert('Success', 'Bank account updated');
    return { success: true };
    
  } catch (error) {
    console.error('Update bank account error:', error);
    return { success: false, error: error.message };
  }
}
```

---

## 16. Crypto Send & Receive

### 16.1 Send (Withdraw) Crypto

**File:** `src/application/SolidiMobileApp/components/MainPanel/components/Send/Send.js`

**Send Flow:**
```javascript
async sendCrypto({
  asset,        // 'BTC', 'ETH', etc.
  volume,       // Amount to send
  address,      // Destination address
  priority,     // 'low', 'medium', 'high'
  destinationTag  // Optional (for XRP, etc.)
}) {
  try {
    // STEP 1: Validate inputs
    if (!volume || parseFloat(volume) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    if (!address) {
      Alert.alert('Error', 'Please enter a destination address');
      return;
    }
    
    // STEP 2: Check balance
    const balance = parseFloat(appState.getBalance(asset));
    const fee = parseFloat(appState.getFee({
      feeType: 'withdraw',
      asset,
      priority
    }));
    const total = parseFloat(volume) + fee;
    
    if (total > balance) {
      Alert.alert(
        'Insufficient Balance',
        `You need ${total.toFixed(8)} ${asset} (including ${fee.toFixed(8)} ${asset} fee), but only have ${balance.toFixed(8)} ${asset}`
      );
      return;
    }
    
    // STEP 3: Confirm transaction
    Alert.alert(
      'Confirm Send',
      `Send ${volume} ${asset} to ${address.substring(0, 10)}...?\n\nFee: ${fee} ${asset}\nPriority: ${priority}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: async () => {
            setDisableSendButton(true);
            
            // STEP 4: Execute withdrawal
            const params = {
              volume,
              address,
              priority
            };
            
            // Add destination tag if applicable
            if (destinationTag && ['XRP', 'XLM'].includes(asset)) {
              params.destinationTag = destinationTag;
            }
            
            const response = await appState.sendWithdraw({
              asset,
              ...params,
              functionName: 'sendCrypto'
            });
            
            if (response && response.success) {
              Alert.alert(
                'Success',
                `Withdrawal submitted successfully!\n\nTransaction ID: ${response.id}`
              );
              
              // Refresh balance
              await appState.loadBalances();
              
              // Navigate back to wallet
              appState.changeState('Wallet');
            } else {
              Alert.alert('Error', response.error || 'Withdrawal failed');
            }
            
            setDisableSendButton(false);
          }
        }
      ]
    );
    
  } catch (error) {
    console.error('Send crypto error:', error);
    Alert.alert('Error', 'Failed to send cryptocurrency');
    setDisableSendButton(false);
  }
}
```

**Address Validation:**
```javascript
function validateCryptoAddress(asset, address) {
  // Basic validation patterns
  const patterns = {
    BTC: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/,
    ETH: /^0x[a-fA-F0-9]{40}$/,
    XRP: /^r[0-9a-zA-Z]{24,34}$/,
    LTC: /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/
  };
  
  if (!patterns[asset]) {
    return { valid: true }; // No pattern available
  }
  
  if (patterns[asset].test(address)) {
    return { valid: true };
  } else {
    return { 
      valid: false, 
      error: `Invalid ${asset} address format` 
    };
  }
}
```

### 16.2 Receive (Deposit) Crypto

**File:** `src/application/SolidiMobileApp/components/MainPanel/components/Receive/Receive.js`

**Generate Deposit Address:**
```javascript
async loadDepositAddress(asset) {
  try {
    console.log(`[RECEIVE] Loading deposit address for ${asset}...`);
    
    // STEP 1: Fetch from API
    const response = await appState.privateMethod({
      apiRoute: `deposit_address/${asset}`,
      httpMethod: 'GET'
    });
    
    if (response === 'DisplayedError') {
      return null;
    }
    
    // STEP 2: Parse response
    const depositDetails = {
      address: response.address,
      warningMessage: response.warningMessage,
      infoMessage: response.infoMessage
    };
    
    // STEP 3: Asset-specific fields
    if (asset === 'XRP' || asset === 'XLM') {
      depositDetails.destinationTag = response.destinationTag;
    }
    
    if (asset === 'GBP') {
      depositDetails.accountName = response.accountName;
      depositDetails.sortCode = response.sortCode;
      depositDetails.accountNumber = response.accountNumber;
      depositDetails.reference = response.reference; // Unique reference code
    }
    
    // STEP 4: Store in AppState
    appState.apiData.depositDetails = appState.apiData.depositDetails || {};
    appState.apiData.depositDetails[asset] = depositDetails;
    
    console.log(`[RECEIVE] ✅ Deposit address loaded for ${asset}`);
    
    return depositDetails;
    
  } catch (error) {
    console.error(`[RECEIVE] Error loading deposit address for ${asset}:`, error);
    return null;
  }
}
```

**Display Deposit Details:**
```javascript
function renderDepositDetails(asset, depositDetails) {
  const assetType = appState.getAssetInfo(asset).type;
  
  if (assetType === 'crypto') {
    // Crypto assets: Show QR code + address
    return (
      <View>
        {/* QR Code */}
        <View style={styles.qrCodeSection}>
          <QRCode
            size={150}
            value={depositDetails.address}
          />
          <Text>Scan this QR code to deposit {asset}</Text>
        </View>
        
        {/* Address */}
        <Surface style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailLabel}>Address:</Text>
            <IconButton
              icon="content-copy"
              onPress={() => copyToClipboard(depositDetails.address)}
            />
          </View>
          <Text style={styles.detailValue}>{depositDetails.address}</Text>
        </Surface>
        
        {/* Destination Tag (if applicable) */}
        {depositDetails.destinationTag && (
          <Surface style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailLabel}>Destination Tag:</Text>
              <IconButton
                icon="content-copy"
                onPress={() => copyToClipboard(depositDetails.destinationTag)}
              />
            </View>
            <Text style={styles.detailValue}>{depositDetails.destinationTag}</Text>
          </Surface>
        )}
        
        {/* Warning message */}
        {depositDetails.warningMessage && (
          <Surface style={styles.warningCard}>
            <Text style={styles.warningText}>{depositDetails.warningMessage}</Text>
          </Surface>
        )}
      </View>
    );
  } else {
    // Fiat assets (GBP): Show bank details
    return (
      <View>
        <Surface style={styles.detailCard}>
          <Text style={styles.detailLabel}>Account Name:</Text>
          <Text style={styles.detailValue}>{depositDetails.accountName}</Text>
        </Surface>
        
        <Surface style={styles.detailCard}>
          <Text style={styles.detailLabel}>Sort Code:</Text>
          <Text style={styles.detailValue}>{depositDetails.sortCode}</Text>
        </Surface>
        
        <Surface style={styles.detailCard}>
          <Text style={styles.detailLabel}>Account Number:</Text>
          <Text style={styles.detailValue}>{depositDetails.accountNumber}</Text>
        </Surface>
        
        <Surface style={styles.detailCard}>
          <Text style={styles.detailLabel}>Reference (IMPORTANT):</Text>
          <Text style={styles.detailValue}>{depositDetails.reference}</Text>
        </Surface>
        
        <Surface style={styles.infoCard}>
          <Text style={styles.infoText}>
            Please include the reference "{depositDetails.reference}" in your bank transfer to ensure your deposit is credited correctly.
          </Text>
        </Surface>
      </View>
    );
  }
}
```

---

## 17. Price Charts & Graph Display

### 17.1 CoinGecko API Integration

**File:** `src/api/CoinGeckoAPI.js`

**Purpose:** Fetch historical price data for cryptocurrency charts.

**API Class:**
```javascript
class CoinGeckoAPI {
  constructor() {
    this.baseURL = 'https://api.coingecko.com/api/v3';
  }
  
  // Get historical price data for charts
  async getMarketChart({
    coinId,      // 'bitcoin', 'ethereum', etc.
    vsCurrency,  // 'usd', 'gbp', etc.
    days         // 1, 7, 30, 90, 365, 'max'
  }) {
    try {
      // Determine interval based on time range
      const interval = days <= 1 ? 'hourly' : 'daily';
      
      const url = `${this.baseURL}/coins/${coinId}/market_chart?vs_currency=${vsCurrency}&days=${days}&interval=${interval}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      // Response format:
      // {
      //   prices: [[timestamp, price], [timestamp, price], ...],
      //   market_caps: [[timestamp, cap], ...],
      //   total_volumes: [[timestamp, volume], ...]
      // }
      
      return data;
      
    } catch (error) {
      console.error('CoinGecko API error:', error);
      throw error;
    }
  }
  
  // Transform data for chart library
  transformToChartData(marketChartData) {
    return marketChartData.prices.map(([timestamp, price]) => ({
      x: new Date(timestamp),
      y: price
    }));
  }
}
```

**Usage Example:**
```javascript
// Fetch Bitcoin price data for last 7 days
const coinGecko = new CoinGeckoAPI();
const data = await coinGecko.getMarketChart({
  coinId: 'bitcoin',
  vsCurrency: 'gbp',
  days: 7
});

// Transform for chart
const chartData = coinGecko.transformToChartData(data);

// chartData format:
// [
//   { x: Date(2024-11-01), y: 31500 },
//   { x: Date(2024-11-02), y: 31750 },
//   ...
// ]
```

### 17.2 Chart Rendering (Implementation Ready)

**Chart Component Structure:**
```javascript
import { LineChart } from 'react-native-chart-kit';

function PriceChart({ asset, timeframe }) {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadChartData();
  }, [asset, timeframe]);
  
  async function loadChartData() {
    setIsLoading(true);
    
    try {
      // Map asset to CoinGecko ID
      const coinId = assetToCoinGeckoId(asset);
      
      // Fetch data
      const coinGecko = new CoinGeckoAPI();
      const data = await coinGecko.getMarketChart({
        coinId,
        vsCurrency: 'gbp',
        days: timeframe
      });
      
      // Transform for chart
      const chartData = coinGecko.transformToChartData(data);
      
      setChartData(chartData);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Failed to load chart data:', error);
      setIsLoading(false);
    }
  }
  
  if (isLoading) {
    return <Spinner />;
  }
  
  return (
    <LineChart
      data={{
        datasets: [{
          data: chartData.map(point => point.y)
        }],
        labels: chartData.map(point => 
          point.x.toLocaleDateString()
        )
      }}
      width={screenWidth}
      height={220}
      chartConfig={{
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 2,
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        style: {
          borderRadius: 16
        }
      }}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 16
      }}
    />
  );
}
```

---

**Document Version:** 2.0  
**Generated:** 2024-11-08  
**Updated:** 2024-11-08  
**Lines of Code Analyzed:** 15,000+  
**Algorithms Documented:** 17  
**New Sections Added:** 8

