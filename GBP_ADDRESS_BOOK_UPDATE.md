# GBP Address Book Update - NEW API FORMAT

## Summary
Updated the address book functionality to support the new GBP address format with nested `address` object structure, including bank account details (sortcode, accountnumber, accountname, business name) and the new required `network` field ('GBPFPS').

## Reference File
Based on: `example3-GBP-withdraw.js` (provided by user from Downloads folder)

## Changes Made

### 1. Updated GBP Address Creation (AddressBookForm.js)

**File:** `src/components/atomic/AddressBookForm.js`

**Before (OLD FORMAT):**
```javascript
apiPayload = {
  name: `${formData.firstName} ${formData.lastName}`.trim() || formData.recipient,
  asset: 'GBP',
  network: 'GBP',
  accountName: formData.accountName,
  sortCode: formData.sortCode.replace(/-/g, ''),
  accountNumber: formData.accountNumber,
  thirdparty: formData.destinationType === 'thirdParty'
};
```

**After (NEW FORMAT):**
```javascript
apiPayload = {
  name: `${formData.firstName} ${formData.lastName}`.trim() || formData.recipient,
  type: 'BANK',  // ✅ NEW: Required for GBP addresses
  asset: 'GBP',
  network: 'GBPFPS',  // ✅ NEW: Required network field for GBP (was 'GBP', now 'GBPFPS')
  address: {  // ✅ NEW: Nested address object structure
    firstname: (formData.firstName && formData.firstName.trim()) ? formData.firstName.trim() : null,
    lastname: (formData.lastName && formData.lastName.trim()) ? formData.lastName.trim() : null,
    business: formData.recipient === 'another_business' ? formData.firstName : null,  // ✅ NEW: Business name field
    accountname: formData.accountName,  // ✅ Bank account holder name
    sortcode: formData.sortCode.replace(/-/g, ''),  // ✅ Sort code without dashes
    accountnumber: formData.accountNumber,  // ✅ Account number
    reference: '',  // ✅ NEW: Payment reference field (optional, default empty)
    dtag: null,
    vasp: null
  },
  thirdparty: formData.destinationType === 'thirdParty' || false
};
```

**Key Changes:**
- ✅ Added `type: 'BANK'` field (required for GBP)
- ✅ Changed `network` from `'GBP'` to `'GBPFPS'` (new network identifier)
- ✅ Wrapped bank details in nested `address` object
- ✅ Added `business` field for company names
- ✅ Added `reference` field for payment references
- ✅ Added `firstname`, `lastname`, `dtag`, `vasp` fields for consistency

### 2. Updated GBP Address Display (AddressBookManagement.js)

**File:** `src/application/SolidiMobileApp/components/MainPanel/components/AddressBook/AddressBookManagement.js`

**Updated `extractAddress()` function to handle GBP bank details:**

```javascript
const extractAddress = (addressData) => {
  try {
    if (typeof addressData === 'object' && addressData !== null) {
      // ✅ NEW: For GBP bank accounts with sortcode and accountnumber
      if (addressData.sortcode && addressData.accountnumber) {
        const sortCode = addressData.sortcode;
        const formattedSortCode = sortCode.length === 6 
          ? `${sortCode.slice(0, 2)}-${sortCode.slice(2, 4)}-${sortCode.slice(4, 6)}`
          : sortCode;
        return `Sort Code: ${formattedSortCode}, Account: ${addressData.accountnumber}`;
      }
      // For crypto addresses
      return addressData.address || 'No address found';
    }
    // ... rest of function
  } catch (error) {
    return addressData || 'Invalid address';
  }
};
```

**Updated address item display to show account holder name:**

```javascript
{/* ✅ NEW: For GBP bank accounts, show account holder name */}
{addressData.accountname && (
  <Text style={styles.addressOwner}>
    Account Holder: {addressData.accountname}
  </Text>
)}

{/* For businesses */}
{addressData.business && (
  <Text style={styles.addressBusiness}>{addressData.business}</Text>
)}

{/* For individuals (crypto addresses) */}
{addressData.firstname && addressData.lastname && (
  <Text style={styles.addressOwner}>
    {addressData.firstname} {addressData.lastname}
  </Text>
)}
```

### 3. Updated Address Selection Display (AddressBookSelectionPage.js)

**File:** `src/components/atomic/AddressBookSelectionPage.js`

**Applied same updates:**
- ✅ Updated `extractAddress()` function to format GBP bank details
- ✅ Added account holder name display
- ✅ Added business name display support

## API Endpoints

### Create GBP Address (v1)
```
POST /api2/v1/addressBook/GBP/BANK
```

**Payload:**
```json
{
  "name": "John Doe",
  "type": "BANK",
  "asset": "GBP",
  "network": "GBPFPS",
  "address": {
    "firstname": "John",
    "lastname": "Doe",
    "business": null,
    "accountname": "Joe Bloggs",
    "sortcode": "040004",
    "accountnumber": "01234567",
    "reference": "",
    "dtag": null,
    "vasp": null
  },
  "thirdparty": false
}
```

### List GBP Addresses
```
GET /api2/v1/addressBook/GBP
```

### Delete Address (Any Asset)
```
DELETE /api2/v1/addressBook/delete/{uuid}

Request:
- HTTP Method: DELETE
- URL Parameter: uuid (address UUID from list response)
- Body: {} (empty object)

Response:
{
  "error": null,
  "data": {
    "result": "success",
    "message": "Address deleted successfully"
  }
}
```

**Important Notes:**
- Use DELETE HTTP method (not POST)
- No request body parameters required
- Works for all assets (BTC, ETH, GBP, etc.)
- UUID is obtained from the address list response

## Testing Checklist

### ✅ Address Creation
- [ ] Create GBP address with personal account
- [ ] Create GBP address with business account
- [ ] Verify `network: 'GBPFPS'` is sent to API
- [ ] Verify `type: 'BANK'` is set correctly
- [ ] Verify sort code formatting (with/without dashes)
- [ ] Verify account number (8 digits)
- [ ] Verify account holder name is saved

### ✅ Address Listing
- [ ] List GBP addresses shows all saved addresses
- [ ] Sort code displays with dashes (XX-XX-XX)
- [ ] Account number displays correctly
- [ ] Account holder name displays
- [ ] Business name displays (if applicable)
- [ ] Address book cache refresh works

### ✅ Address Deletion
- [ ] Delete GBP address by UUID
- [ ] Verify address removed from list
- [ ] Verify cache cleared after deletion

### ✅ Withdrawal Flow
- [ ] Select GBP address from address book during withdrawal
- [ ] Verify UUID is passed to withdraw API
- [ ] Verify withdrawal completes successfully

## Backward Compatibility

**Old Format (if any exist in database):**
- The `extractAddress()` function will still attempt to extract data
- May display "No address found" if structure doesn't match
- Recommend testing with existing GBP addresses in database

## Future Migration to API v2

The example file shows a commented v2 API format:

```javascript
// V2 API (future):
POST /api2/v2/addressBook/GBP/GBPFPS/BANK
```

This includes the network in the URL path. When migrating to v2:
1. Update API route to include network: `addressBook/GBP/GBPFPS/BANK`
2. Add `version='v2'` parameter to API call
3. Test thoroughly before deploying

## Key Fields Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Nickname for the address |
| `type` | string | Yes | Must be 'BANK' for GBP |
| `asset` | string | Yes | Must be 'GBP' |
| `network` | string | Yes | Must be 'GBPFPS' (new requirement) |
| `address.firstname` | string | Optional | First name of individual |
| `address.lastname` | string | Optional | Last name of individual |
| `address.business` | string | Optional | Business name (for companies) |
| `address.accountname` | string | Yes | Bank account holder name |
| `address.sortcode` | string | Yes | UK sort code (6 digits, no dashes) |
| `address.accountnumber` | string | Yes | UK account number (8 digits) |
| `address.reference` | string | Optional | Payment reference |
| `address.dtag` | null | No | Reserved for future use |
| `address.vasp` | null | No | Reserved for future use |
| `thirdparty` | boolean | No | Third party flag (default: false) |

## Files Modified

1. ✅ `src/components/atomic/AddressBookForm.js` - GBP address creation
2. ✅ `src/application/SolidiMobileApp/components/MainPanel/components/AddressBook/AddressBookManagement.js` - Address display
3. ✅ `src/components/atomic/AddressBookSelectionPage.js` - Address selection
4. ✅ `example3-GBP-withdraw.js` - Reference file (copied from Downloads)

## Notes

- The `addressType` variable is already correctly set to `'BANK'` for GBP addresses
- The API endpoint `addressBook/GBP/BANK` is already correct
- The main changes are in the payload structure and display formatting
- Existing crypto address functionality remains unchanged
- The form validation for sort code (XX-XX-XX) and account number (8 digits) is already in place

## Completed By
GitHub Copilot - 2024
Based on user-provided example file: `example3-GBP-withdraw (1).js`
