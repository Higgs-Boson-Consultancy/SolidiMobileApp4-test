# Notification Badge and Settings Visibility

## App Not Appearing in iOS Settings → Notifications

This is a common issue that occurs when:
1. The app was installed before Push Notifications capability was added
2. iOS hasn't fully registered the app's notification settings

**Solution:**
1. **Delete the app** completely from your iPhone (long press → Remove App → Delete App)
2. **Restart your iPhone** (optional but recommended)
3. **Reinstall the app** from Xcode
4. **Open the app** and allow notifications when prompted
5. Go to **Settings → Notifications** - your app should now appear as "SolidiTest"

## Badge Icon Not Showing Unread Count

The badge icon (red number on app icon) should automatically update when:
- A notification is received
- The app sets the badge number via `PushNotificationIOS.setApplicationIconBadgeNumber(count)`

**Current Implementation:**
- Badge permissions are requested: ✅
- Badge number is set when notifications are received: ✅
- Badge number is set based on unread count in `NotificationStorageService`: ✅

**To verify badge is working:**
1. Receive a notification (I can send you a test one)
2. Don't open the notification
3. Check your home screen - you should see a red badge with "1"
4. Open the app and view the notification
5. Badge should disappear

**Manual Test:**
If you want to test the badge manually, I can add a button in the app to set the badge number for testing purposes.
