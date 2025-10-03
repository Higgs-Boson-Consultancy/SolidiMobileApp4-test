# Apple Pay Sandbox Testing Instructions

## Quick Setup for Testing

### 1. Enable Apple Pay in iOS Simulator
1. Open iOS Simulator
2. Go to **Device → Wallet & Apple Pay**
3. Add test cards using these numbers:
   - **Visa**: 4111 1111 1111 1111 (Any future date, any CVC)
   - **MasterCard**: 5555 5555 5555 4444 (Any future date, any CVC)
   - **Amex**: 3782 822463 10005 (Any future date, any CVC)

### 2. Test Apple Pay in the App
1. Launch the Solidi app in iOS Simulator
2. Navigate to the **Wallet** section
3. Try to make a deposit with GBP, USD, or EUR
4. Select **"Apple Pay"** option
5. You should see the Apple Pay payment sheet with your test cards

### 3. Expected Behavior
- ✅ Apple Pay button appears for fiat currencies only
- ✅ Payment sheet shows with test cards
- ✅ Payment completes successfully
- ✅ Shows transaction confirmation with ID

### 4. Troubleshooting
If Apple Pay doesn't work:
1. **Check iOS Simulator setup**: Ensure test cards are added
2. **Verify app permissions**: Apple Pay capability should be enabled
3. **Check console logs**: Look for Apple Pay error messages
4. **Test device compatibility**: Use iOS 15.0+ simulators

### 5. Production Setup Required
For real deployment, you need:
- [ ] Apple Developer Account
- [ ] Merchant ID registration
- [ ] Payment processing backend (Stripe/Braintree)
- [ ] Production certificates

## Current Implementation Status
- ✅ Apple Pay UI integration complete
- ✅ Sandbox testing ready
- ✅ Error handling implemented
- ⚠️ Backend integration needed for production
- ⚠️ Real payment processing not implemented