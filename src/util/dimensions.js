import { Dimensions, Platform, PixelRatio } from 'react-native';

let {
  width: screenWidth,
  height: screenHeight,
} = Dimensions.get('window');

// Detect if device is iPad
const isIPad = () => {
  if (Platform.OS !== 'ios') return false;
  const aspectRatio = screenHeight / screenWidth;
  // iPad typically has aspect ratio closer to 4:3 (1.33) vs iPhone's ~16:9 (1.77)
  return screenWidth >= 768 && aspectRatio < 1.6;
};

const deviceIsIPad = isIPad();

// Base values are based on the iPhone 13 (iOS 15) simulator for phones
// For iPad, use iPad Pro 11" as base (834 x 1194)
let baseScreenWidth = deviceIsIPad ? 834 : 390;
let baseScreenHeight = deviceIsIPad ? 1194 : 844;

let horizontalScale = screenWidth / baseScreenWidth;
let verticalScale = screenHeight / baseScreenHeight;

// For iPad, limit scaling to prevent elements from becoming too large
if (deviceIsIPad) {
  // Cap the scale at 1.5x to maintain reasonable sizes
  horizontalScale = Math.min(horizontalScale, 1.5);
  verticalScale = Math.min(verticalScale, 1.5);
}

let scaledWidth = (x) => { return x * horizontalScale };
let scaledHeight = (x) => { return x * verticalScale };

let normaliseFont = (fontSize) => {
  let newFontSize = fontSize * horizontalScale;
  
  // For iPad, apply different scaling
  if (deviceIsIPad) {
    // Slightly larger fonts for iPad but with controlled scaling
    newFontSize = fontSize * Math.min(horizontalScale * 1.15, 1.4);
  }
  
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newFontSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newFontSize)) - 2
  }
}

// Get device-appropriate padding
const getDevicePadding = (basePadding = 16) => {
  return deviceIsIPad ? basePadding * 1.5 : basePadding;
};

// Get device-appropriate margin
const getDeviceMargin = (baseMargin = 16) => {
  return deviceIsIPad ? baseMargin * 1.5 : baseMargin;
};

export {
  screenWidth,
  screenHeight,
  baseScreenWidth,
  baseScreenHeight,
  horizontalScale,
  verticalScale,
  scaledWidth,
  scaledHeight,
  normaliseFont,
  isIPad,
  deviceIsIPad,
  getDevicePadding,
  getDeviceMargin,
}
