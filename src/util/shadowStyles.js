import { Platform } from 'react-native';

// Helper function to convert React Native shadow styles to React Native Web boxShadow
export const createShadowStyle = (shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation = 0) => {
  if (Platform.OS === 'web') {
    // Convert to CSS boxShadow
    const { width, height } = shadowOffset;
    const alpha = shadowOpacity || 0.1;
    
    // Convert shadowColor to rgba if it's hex
    let color = shadowColor;
    if (typeof color === 'string' && color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      color = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } else if (typeof color === 'string' && color !== 'transparent') {
      // For named colors, use rgba with opacity
      color = `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
    }
    
    return {
      boxShadow: `${width}px ${height}px ${shadowRadius}px ${color}`,
    };
  } else {
    // Return original React Native shadow props for mobile
    return {
      shadowColor,
      shadowOffset,
      shadowOpacity,
      shadowRadius,
      elevation,
    };
  }
};

// Pre-defined common shadow styles
export const shadowStyles = {
  card: createShadowStyle('#000000', { width: 0, height: 2 }, 0.1, 4, 2),
  cardCompact: createShadowStyle('#000000', { width: 0, height: 2 }, 0.1, 4, 2),
  cardOneLine: createShadowStyle('#000000', { width: 0, height: 2 }, 0.1, 4, 2),
  warningCard: createShadowStyle('#000000', { width: 0, height: 1 }, 0.1, 2, 1),
  infoCard: createShadowStyle('#000000', { width: 0, height: 1 }, 0.1, 2, 1),
  errorCard: createShadowStyle('#000000', { width: 0, height: 1 }, 0.1, 2, 1),
};