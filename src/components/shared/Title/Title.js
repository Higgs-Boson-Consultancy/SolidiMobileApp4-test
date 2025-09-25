import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { sharedStyles, sharedColors } from 'src/constants';

const Title = ({ 
  children, 
  style = {},
  variant = "headlineSmall",
  showBackground = true,
  backgroundColor,
  textColor,
  rightElement,
  customContent
}) => {
  const theme = useTheme();
  
  const defaultBackgroundColor = backgroundColor || theme.colors.primary;
  const defaultTextColor = textColor || 'white';

  const titleContainerStyle = {
    backgroundColor: showBackground ? defaultBackgroundColor : 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 0,
    elevation: 2,
  };

  const titleTextStyle = {
    color: showBackground ? defaultTextColor : theme.colors.onSurface,
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  };

  if (!showBackground) {
    return (
      <View style={[{ paddingHorizontal: 16, paddingVertical: 12 }, style]}>
        <Text 
          variant={variant} 
          style={[titleTextStyle, { color: theme.colors.onSurface }]}
        >
          {children}
        </Text>
      </View>
    );
  }

  return (
    <View style={[titleContainerStyle, style]}>
      {/* Header with Title and Right Element */}
      <View style={{ 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: customContent ? 16 : 0
      }}>
        <Text 
          variant={variant} 
          style={[titleTextStyle, { flex: 1 }]}
        >
          {children}
        </Text>
        {rightElement && rightElement}
      </View>
      
      {/* Optional custom content below title */}
      {customContent && customContent}
    </View>
  );
};

export default Title;