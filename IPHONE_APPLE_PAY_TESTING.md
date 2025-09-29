# Apple Pay Testing on Your iPhone - Troubleshooting Guide

## Current Setup Status ✅
- ✅ Physical iPhone connected (iPhone 11)
- ✅ Metro bundler running and connected
- ✅ Apple Pay library installed (react-native-payments)
- ✅ iOS app built and deployed to device

## Testing Steps for Your iPhone

### 1. Prepare Apple Wallet
**Add Test Cards:**
- Open **Settings → Wallet & Apple Pay**
- Tap **"Add Card"**
- Choose **"Credit or Debit Card"**
- Enter test card numbers:
  ```
  Visa: 4111 1111 1111 1111
  Expiry: Any future date (e.g., 12/25)
  CVC: Any 3 digits (e.g., 123)
  
  MasterCard: 5555 5555 5555 4444
  Expiry: Any future date
  CVC: Any 3 digits
  ```
- Complete the setup process

### 2. Test in Solidi App
1. **Open Solidi app** on your iPhone
2. **Navigate to Wallet** section  
3. **Select a fiat currency** (GBP, USD, EUR)
4. **Tap "Deposit"**
5. **Choose "Apple Pay"**

### 3. Expected Behavior
✅ **Should work:**
- Amount input dialog appears
- Apple Pay payment sheet opens
- Shows your test cards
- Payment completes successfully

❌ **If it doesn't work:**
- Check error messages in the app
- Ensure passcode/Touch ID/Face ID is enabled
- Verify test cards are properly added

### 4. Common Issues & Solutions

**"Apple Pay Not Available"**
- Solution: Add cards to Wallet app first

**"Apple Pay is not set up on this device"**
- Solution: Enable passcode/biometrics, add cards

**Payment sheet doesn't appear**
- Solution: Check merchant ID configuration in Xcode

**App crashes on Apple Pay**
- Solution: Check console logs for detailed error

### 5. Debug Mode
If you encounter issues, you can:
1. Open **Safari → Develop → [Your iPhone] → [App Name]**
2. Check console for Apple Pay errors
3. Or use Xcode console while testing

### 6. Real vs Sandbox Testing

**Current Mode: Sandbox/Test**
- No real money charged
- Uses Apple's test environment
- Test cards simulate real behavior

**For Production:**
- Need Apple Developer account
- Register merchant ID
- Implement backend payment processing

## Next Steps

1. **Test the current implementation** on your iPhone
2. **Report any issues** you encounter
3. **Check console logs** if payments fail
4. **Consider production setup** if tests are successful

## Quick Test Command
To reload the app on your device:
```bash
npx react-native run-ios --device
```

## Debugging
To see logs from your iPhone:
```bash
xcrun devicectl device log stream --device 00008030-000669240A91402E
```