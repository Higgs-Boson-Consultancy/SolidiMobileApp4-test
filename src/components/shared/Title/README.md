# Title Component Usage Guide

## Overview
The `Title` component provides consistent header styling across all pages in the SolidiMobileApp, eliminating title alignment issues and ensuring uniform appearance.

## Import
```javascript
import { Title } from 'src/components/shared';
```

## Basic Usage

### Simple Title
```javascript
<Title>
  Page Name
</Title>
```

### Title with Custom Style
```javascript
<Title style={{ 
  marginHorizontal: -16,
  marginTop: -16,
  marginBottom: 24,
  elevation: 2
}}>
  Page Name
</Title>
```

### Title with Right Element (like Assets page)
```javascript
<Title 
  rightElement={
    <View style={{
      backgroundColor: 'rgba(255,255,255,0.2)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12
    }}>
      <Text style={{ color: 'white', fontSize: 10, fontWeight: '600' }}>
        LIVE
      </Text>
    </View>
  }
>
  My Assets
</Title>
```

### Title with Custom Content (like portfolio cards)
```javascript
<Title 
  customContent={
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      {/* Custom content here */}
    </View>
  }
>
  My Assets
</Title>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | string | - | The title text |
| `style` | object | `{}` | Additional styles for the container |
| `variant` | string | `"headlineSmall"` | Material Design text variant |
| `showBackground` | boolean | `true` | Whether to show the primary color background |
| `backgroundColor` | string | `theme.colors.primary` | Custom background color |
| `textColor` | string | `'white'` | Custom text color |
| `rightElement` | ReactNode | - | Element to display on the right side |
| `customContent` | ReactNode | - | Additional content below the title |

## Benefits

✅ **Consistent Alignment**: No more title shifting or covering the logo bar
✅ **Standardized Styling**: Uniform appearance across all pages
✅ **Flexible**: Supports custom content and right elements
✅ **Material Design**: Built with react-native-paper components
✅ **Responsive**: Automatically adjusts to content
✅ **Maintainable**: Single component to update for all pages

## Implementation Status

- ✅ Identity Verification
- ✅ Personal Details  
- ✅ Bank Account
- ✅ Security
- ✅ Assets (with custom content)

## Migration

Replace existing header structures:
```javascript
// OLD - Manual header with potential alignment issues
<View style={{ backgroundColor: sharedColors.primary, ... }}>
  <View style={{ paddingHorizontal: 16 }}>
    <Text variant="headlineSmall" style={[sharedStyles.headerTitle, { flex: 1 }]}>
      Page Name
    </Text>
  </View>
</View>

// NEW - Simple and consistent
<Title>
  Page Name  
</Title>
```