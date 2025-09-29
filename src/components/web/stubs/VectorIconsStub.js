import React from 'react';
import { View, Text } from 'react-native';

// Stub for react-native-vector-icons
class VectorIconsStub extends React.Component {
  render() {
    const { name, size = 20, color = '#333', style } = this.props;
    
    return (
      <View 
        style={[
          {
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: size / 2,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.7
          },
          style
        ]}
      >
        <Text style={{ fontSize: size * 0.6, color: 'white', fontWeight: 'bold' }}>
          {name ? name.charAt(0).toUpperCase() : 'I'}
        </Text>
      </View>
    );
  }
}

// Create icon set function
export const createIconSet = () => VectorIconsStub;
export const createIconSetFromFontello = () => VectorIconsStub;
export const createIconSetFromIcoMoon = () => VectorIconsStub;

// Export common icon font families as named exports
export const FontAwesome = VectorIconsStub;
export const Ionicons = VectorIconsStub;
export const MaterialIcons = VectorIconsStub;
export const MaterialCommunityIcons = VectorIconsStub;
export const Feather = VectorIconsStub;
export const AntDesign = VectorIconsStub;
export const Entypo = VectorIconsStub;
export const EvilIcons = VectorIconsStub;
export const Foundation = VectorIconsStub;
export const SimpleLineIcons = VectorIconsStub;
export const Octicons = VectorIconsStub;
export const Zocial = VectorIconsStub;

// Default export
export default VectorIconsStub;