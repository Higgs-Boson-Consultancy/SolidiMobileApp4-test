// React imports
import React from 'react';
import { View, StyleSheet } from 'react-native';

// Internal imports
import { SolidiLoadingScreen } from 'src/components/shared';

/**
 * Loading - Full-screen loading component for page transitions
 * 
 * This component is displayed when:
 * - App is checking credentials on startup
 * - Transitioning between pages
 * - Waiting for API responses
 * - Any other loading state
 */
const Loading = () => {
  return (
    <View style={styles.container}>
      <SolidiLoadingScreen 
        fullScreen={true}
        message="Loading..."
        size="medium"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Loading;
