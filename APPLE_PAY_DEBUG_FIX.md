# Apple Pay Debugging Guide - "Payment Error" Fix

## Issue: "Unable to process Apple Pay payment"

### What I've Fixed:

1. **Enhanced Error Logging** - Added detailed console logging
2. **Better Error Messages** - Specific error descriptions
3. **Fallback Demo Mode** - "Apple Pay (Demo)" option for testing
4. **Improved Configuration** - Better payment request setup
5. **Multiple Support Checks** - More thorough Apple Pay availability checking

### New Features Added:

#### 1. Apple Pay (Demo) Option
- **Purpose**: Test Apple Pay flow without merchant setup
- **How to use**: Select "Apple Pay (Demo)" instead of regular "Apple Pay"
- **What it does**: Simulates entire Apple Pay experience with native iOS alerts

#### 2. Enhanced Error Reporting
The app now shows specific error messages:
- "Apple Pay is not supported on this device"
- "Apple Pay merchant configuration error"  
- "Network error during Apple Pay setup"
- "Invalid payment configuration"

#### 3. Detailed Console Logging
Check the debug console for detailed logs:
- Apple Pay availability checks
- Payment request creation
- Error details with stack traces

### Testing Instructions:

#### Test 1: Apple Pay Demo (Recommended First Test)
1. Open Wallet → Select GBP/USD/EUR
2. Choose **"Apple Pay (Demo)"**  
3. Enter amount → Tap "Pay with Touch ID"
4. Should show success message

#### Test 2: Real Apple Pay (Requires Setup)
1. Add test cards to iPhone Wallet first:
   - Settings → Wallet & Apple Pay → Add Card
   - Use: 4111 1111 1111 1111 (Visa test)
2. Open Wallet → Select currency
3. Choose **"Apple Pay"**
4. Should show native Apple Pay sheet

### Common Issues & Solutions:

#### "Apple Pay is not set up on this device"
**Solution**: Add test cards to Wallet app first

#### "Apple Pay merchant configuration error"
**Solution**: Use "Apple Pay (Demo)" for testing instead

#### "Invalid payment configuration"
**Solution**: 
- Try different currency (USD instead of GBP)
- Use "Apple Pay (Demo)" mode
- Check that amount is valid number

#### App crashes or freezes
**Solution**: 
- Restart the app
- Try "Apple Pay (Demo)" first
- Check console for error logs

### Debug Console Access:

To see detailed logs:
1. **Safari Method**: Safari → Develop → [Your iPhone] → [App]
2. **Xcode Method**: Open Xcode → Window → Devices → Select iPhone → View logs

### Expected Log Output (Success):
```
Apple Pay deposit requested for currency: gbp
Checking Apple Pay availability...
Apple Pay canMakePayments result: true
Apple Pay device support: true  
Amount entered: 50 Parsed: 50
Creating PaymentRequest for amount: 50 currency: gbp
PaymentRequest created, attempting to show payment sheet...
```

### Expected Log Output (Error):
```
Apple Pay error details: {
  message: "...",
  name: "...",
  code: "..."
}
```

### Next Steps:

1. **Try Demo Mode First**: Test "Apple Pay (Demo)" - should work 100%
2. **Check Logs**: Look for specific error messages
3. **Add Test Cards**: If demo works, add test cards and try real Apple Pay
4. **Report Specific Errors**: Share the exact error message from enhanced logging

### Production Deployment:

When ready for production:
1. Register Apple Developer merchant ID
2. Configure Xcode with proper entitlements  
3. Set up backend payment processing
4. Remove demo mode
5. Test with production Apple Pay setup

---

**Quick Fix**: If you just want to test Apple Pay functionality, use **"Apple Pay (Demo)"** - it will work immediately without any setup!