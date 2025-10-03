# Address Book API Response Logging Guide

## 📊 Enhanced Logging for Address Book List API

I've added comprehensive logging to show the **exact API responses** when the Transfer page loads address book data.

### 🎯 **When Address Book API Gets Called:**

1. **Transfer Page Opens** → Triggers AddressBookPicker for default asset (BTC)
2. **Asset Selection Changes** → Triggers new API call for selected asset
3. **Component Re-renders** → May trigger reload based on state changes

### 📋 **What You'll See in Console:**

#### **1. Transfer Page Asset Change Trigger:**
```
🎯 Transfer: ===== ASSET CHANGED - WILL TRIGGER ADDRESS BOOK RELOAD =====
🎯 Transfer: Selected asset changed to: BTC
🎯 Transfer: This will trigger AddressBookPicker to reload with new asset
🎯 Transfer: Expected API call: GET /addressBook/BTC
🎯 Transfer: ===== ASSET CHANGE TRIGGER END =====
```

#### **2. AddressBookPicker Loading Trigger:**
```
🏠 AddressBookPicker: ===== TRANSFER PAGE RENDER TRIGGER =====
🏠 AddressBookPicker: useEffect triggered for asset: BTC
🏠 AddressBookPicker: AppState available: true
🏠 AddressBookPicker: API Client available: true
🏠 AddressBookPicker: About to load address book data from API...
🏠 AddressBookPicker: Starting address book API call for BTC
```

#### **3. Detailed API Response (THE IMPORTANT PART):**
```
🏠 AddressBookPicker: ===== ADDRESS BOOK API RESPONSE START =====
🏠 AddressBookPicker: Raw API Response: {response object}
🏠 AddressBookPicker: Response Type: object
🏠 AddressBookPicker: Response Keys: ["success", "data", "error", "status"]
🏠 AddressBookPicker: Response Success: true/false
🏠 AddressBookPicker: Response Data: {data object}
🏠 AddressBookPicker: Response Error: null/error message
🏠 AddressBookPicker: Response Status: 200
🏠 AddressBookPicker: Response Message: "Success"
🏠 AddressBookPicker: Data Type: object
🏠 AddressBookPicker: Data Keys: ["addresses"]
🏠 AddressBookPicker: Addresses Array: [{address1}, {address2}, ...]
🏠 AddressBookPicker: Addresses Count: 3
🏠 AddressBookPicker: Address 1: {label: "My Wallet", address: "tb1q...", ...}
🏠 AddressBookPicker: Address 2: {label: "Exchange", address: "tb1q...", ...}
🏠 AddressBookPicker: ===== ADDRESS BOOK API RESPONSE END =====
```

#### **4. Processing Results:**
```
🏠 AddressBookPicker: Successfully transformed 3 addresses
🏠 AddressBookPicker: Final transformed addresses: [...]
🏠 AddressBookPicker: Address book API call completed for BTC
🏠 AddressBookPicker: Setting addresses state with 3 addresses
🏠 AddressBookPicker: Addresses state updated for Transfer page
```

### 🔍 **Visual Indicators on Transfer Page:**

- **Blue box around AddressBookPicker** showing current asset
- **Text indicator**: "📋 Loading Address Book for BTC (Check console for API response)"
- **Debug info** in AddressBookPicker component showing loading/error states

### 📝 **How to Test:**

1. **Open Transfer page** → Watch console for initial BTC address book API call
2. **Change asset dropdown** (BTC → ETH → GBP) → Watch console for new API calls
3. **Look for the API RESPONSE section** → This shows exactly what the server returns
4. **Check address count and data** → See how many addresses are loaded

### 🎯 **Key Things to Check:**

#### **For Successful API Response:**
- `Response Success: true`
- `Addresses Count: {number}` (should be > 0 if you have saved addresses)
- `Address 1: {actual address data}`

#### **For Empty Address Book:**
- `Response Success: true`
- `Addresses Count: 0`
- `No addresses found in API response`

#### **For API Errors:**
- `Response Success: false`
- `Response Error: {error message}`
- `Failed to load {asset} addresses`

### 📊 **Expected API Calls:**

When you open Transfer page, you should see these API calls:
- `GET /addressBook/BTC` (default)
- `GET /addressBook/ETH` (when switching to ETH)
- `GET /addressBook/GBP` (when switching to GBP)

---

**Now when you open the Transfer page, the console will show you EXACTLY what the address book API is returning, so we can see if your saved addresses are being loaded correctly!**