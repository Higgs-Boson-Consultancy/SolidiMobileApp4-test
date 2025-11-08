# Solidi Mobile App - Complete API Documentation

**Generated:** November 07, 2025 at 12:14

## Base Configuration

- **Base URL**: `https://DOMAIN/api2/v1/`
- **Test Domain**: `t2.solidi.co`
- **Production Domain**: `www.solidi.co`
- **User Agent**: `SolidiMobileApp4/1.2.0 (Build 33)`

## Authentication

### Public Endpoints
- **Method**: GET or POST
- **Headers**:
  ```
  Content-Type: application/json
  Accept: application/json
  User-Agent: SolidiMobileApp4/1.2.0 (Build 33)
  ```

### Private Endpoints
- **Method**: POST (required for HMAC)
- **Authentication**: HMAC SHA256 signature
- **Headers**:
  ```
  Content-Type: application/json
  Accept: application/json
  User-Agent: SolidiMobileApp4/1.2.0 (Build 33)
  API-Key: <user_api_key>
  API-Sign: <hmac_sha256_signature>
  ```
- **Body**: Must include `nonce` (timestamp in microseconds)

### HMAC Signature Generation
```javascript
// Path: /api2/v1/{endpoint}
// Post data: JSON.stringify({...params, nonce})
// Message: path + SHA256(nonce + postData)
// Signature: HMAC-SHA256(message, base64-decoded-apiSecret)
// Result: base64(signature)
```

---

## Authentication & User

### `confirm_email_and_send_mobile_code/${registrationEmail}/${verificationCode}`

- **Type**: PUBLIC
- **Method**: GET or POST
- **Endpoint**: `/api2/v1/confirm_email_and_send_mobile_code/${registrationEmail}/${verificationCode}`

### `confirm_mobile/${appState.registrationEmail}/${verificationCode}`

- **Type**: PUBLIC
- **Method**: GET or POST
- **Endpoint**: `/api2/v1/confirm_mobile/${appState.registrationEmail}/${verificationCode}`

### `credentials/${userID}`

- **Type**: PRIVATE
- **Method**: POST
- **Endpoint**: `/api2/v1/credentials/${userID}`

### `password_reset/${email}`

- **Type**: PUBLIC
- **Method**: GET or POST
- **Endpoint**: `/api2/v1/password_reset/${email}`

### `resend_email_verification`

- **Type**: PUBLIC
- **Method**: GET or POST
- **Endpoint**: `/api2/v1/resend_email_verification`
- **Parameters**:
  ```javascript
  email: registrationEmail
  ```

### `resend_phone_verification`

- **Type**: PUBLIC
- **Method**: GET or POST
- **Endpoint**: `/api2/v1/resend_phone_verification`
- **Parameters**:
  ```javascript
  phoneNumber: registrationPhone
  ```

## Trading & Orders

### `buy`

- **Type**: PRIVATE
- **Method**: POST
- **Endpoint**: `/api2/v1/buy`
- **Parameters**:
  ```javascript
  market,
          baseAssetVolume: volumeBA,
          quoteAssetVolume: volumeQA,
          orderType,
          paymentMethod,
  ```

### `order`

- **Type**: PRIVATE
- **Method**: POST
- **Endpoint**: `/api2/v1/order`

### `order/${orderID}/user_has_paid`

- **Type**: PRIVATE
- **Method**: POST
- **Endpoint**: `/api2/v1/order/${orderID}/user_has_paid`

### `order_status/`

- **Type**: PRIVATE
- **Method**: POST
- **Endpoint**: `/api2/v1/order_status/`

### `sell`

- **Type**: PRIVATE
- **Method**: POST
- **Endpoint**: `/api2/v1/sell`
- **Parameters**:
  ```javascript
  market,
          baseAssetVolume: volumeBA,
          quoteAssetVolume: volumeQA,
          orderType,
          paymentMethod,
  ```

## Wallet & Balance

### `balance`

- **Type**: PRIVATE
- **Method**: POST
- **Endpoint**: `/api2/v1/balance`

### `best_volume_price/`

- **Type**: PRIVATE
- **Method**: POST
- **Endpoint**: `/api2/v1/best_volume_price/`

### `best_volume_price/${currency}/GBP/SELL/quote/1`

- **Type**: PUBLIC
- **Method**: GET or POST
- **Endpoint**: `/api2/v1/best_volume_price/${currency}/GBP/SELL/quote/1`

### `fee`

- **Type**: PRIVATE
- **Method**: POST
- **Endpoint**: `/api2/v1/fee`

### `ticker`

- **Type**: PUBLIC
- **Method**: GET or POST
- **Endpoint**: `/api2/v1/ticker`

### `volume_price/`

- **Type**: PRIVATE
- **Method**: POST
- **Endpoint**: `/api2/v1/volume_price/`

## Market Data

### `addressBook/${asset.toUpperCase()}`

- **Type**: PRIVATE
- **Method**: POST
- **Endpoint**: `/api2/v1/addressBook/${asset.toUpperCase()}`

### `asset_icon`

- **Type**: PUBLIC
- **Method**: GET or POST
- **Endpoint**: `/api2/v1/asset_icon`

### `asset_info`

- **Type**: PUBLIC
- **Method**: GET or POST
- **Endpoint**: `/api2/v1/asset_info`

### `default_account/${asset}`

- **Type**: PRIVATE
- **Method**: POST
- **Endpoint**: `/api2/v1/default_account/${asset}`

### `default_account/${asset}/update`

- **Type**: PRIVATE
- **Method**: POST
- **Endpoint**: `/api2/v1/default_account/${asset}/update`

### `deposit_details/${asset}`

- **Type**: PRIVATE
- **Method**: POST
- **Endpoint**: `/api2/v1/deposit_details/${asset}`

### `market`

- **Type**: PUBLIC
- **Method**: GET or POST
- **Endpoint**: `/api2/v1/market`

### `withdraw/${asset}`

- **Type**: PRIVATE
- **Method**: POST
- **Endpoint**: `/api2/v1/withdraw/${asset}`

## Verification & KYC

### `identity_verification_details`

- **Type**: PRIVATE
- **Method**: POST
- **Endpoint**: `/api2/v1/identity_verification_details`

### `user/extra_information/check`

- **Type**: PRIVATE
- **Method**: POST
- **Endpoint**: `/api2/v1/user/extra_information/check`

## Account Management

### `request_account_deletion`

- **Type**: PRIVATE
- **Method**: POST
- **Endpoint**: `/api2/v1/request_account_deletion`

### `user`

- **Type**: PRIVATE
- **Method**: POST
- **Endpoint**: `/api2/v1/user`

### `user_status`

- **Type**: PRIVATE
- **Method**: POST
- **Endpoint**: `/api2/v1/user_status`

## System

### `api_latest_version`

- **Type**: PUBLIC
- **Method**: GET or POST
- **Endpoint**: `/api2/v1/api_latest_version`

### `app_latest_version`

- **Type**: PUBLIC
- **Method**: GET or POST
- **Endpoint**: `/api2/v1/app_latest_version`

## Other

### `country`

- **Type**: PUBLIC
- **Method**: GET or POST
- **Endpoint**: `/api2/v1/country`

### `personal_detail_option`

- **Type**: PUBLIC
- **Method**: GET or POST
- **Endpoint**: `/api2/v1/personal_detail_option`

### `security_check`

- **Type**: PRIVATE
- **Method**: POST
- **Endpoint**: `/api2/v1/security_check`

### `transaction`

- **Type**: PRIVATE
- **Method**: POST
- **Endpoint**: `/api2/v1/transaction`
