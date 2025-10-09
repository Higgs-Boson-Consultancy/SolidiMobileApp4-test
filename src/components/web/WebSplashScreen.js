import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Animated } from 'react-native';

// Web alternative for react-native-splash-screen
export const WebSplashScreen = {
  show: () => {
    if (Platform.OS === 'web') {
      // Show web splash screen
      const splashElement = document.getElementById('web-splash-screen');
      if (splashElement) {
        splashElement.style.display = 'flex';
      } else {
        // Create splash screen if it doesn't exist
        createWebSplashScreen();
      }
    }
  },

  hide: () => {
    if (Platform.OS === 'web') {
      const splashElement = document.getElementById('web-splash-screen');
      if (splashElement) {
        // Fade out animation
        splashElement.style.opacity = '0';
        setTimeout(() => {
          splashElement.style.display = 'none';
          splashElement.style.opacity = '1'; // Reset for next time
        }, 500);
      }
    }
  }
};

// Create the web splash screen HTML element
const createWebSplashScreen = () => {
  const splashHtml = `
    <div id="web-splash-screen" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      transition: opacity 0.5s ease-in-out;
    ">
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        color: white;
      ">
        <div style="
          width: 80px;
          height: 80px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 30px;
        "></div>
        <h1 style="
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 10px 0;
          letter-spacing: -0.02em;
        ">SolidiMobileApp</h1>
        <p style="
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 1.1rem;
          margin: 0;
          opacity: 0.9;
          font-weight: 300;
        ">Loading your crypto experience...</p>
      </div>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;

  document.body.insertAdjacentHTML('beforeend', splashHtml);
};

// React component version for more control
export const WebSplashComponent = ({ visible = true, onHide }) => {
  const fadeAnim = new Animated.Value(visible ? 1 : 0);

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onHide?.();
      });
    }
  }, [visible, fadeAnim, onHide]);

  if (!visible && Platform.OS !== 'web') return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.content}>
        <View style={styles.spinner} />
        <Text style={styles.title}>SolidiMobileApp</Text>
        <Text style={styles.subtitle}>Loading your crypto experience...</Text>
      </View>
    </Animated.View>
  );
};

// Enhanced splash screen with app logo
export const SplashScreenWithLogo = ({ visible, logoSource, onHide }) => {
  const fadeAnim = new Animated.Value(visible ? 1 : 0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onHide?.();
      });
    }
  }, [visible, fadeAnim, scaleAnim, onHide]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Animated.View style={[styles.content, { transform: [{ scale: scaleAnim }] }]}>
        {logoSource && Platform.OS === 'web' && (
          <img 
            src={logoSource} 
            alt="App Logo" 
            style={styles.webLogo}
          />
        )}
        <View style={styles.spinner} />
        <Text style={styles.title}>SolidiMobileApp</Text>
        <Text style={styles.subtitle}>Secure Crypto Trading</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    ...(Platform.OS === 'web' && {
      position: 'fixed',
      width: '100vw',
      height: '100vh',
    }),
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopColor: '#fff',
    marginBottom: 30,
    ...(Platform.OS === 'web' && {
      animationKeyframes: 'spin',
      animationDuration: '1s',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Platform.OS === 'web' 
      ? '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      : undefined,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '300',
    fontFamily: Platform.OS === 'web'
      ? '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      : undefined,
  },
  webLogo: {
    width: 80,
    height: 80,
    marginBottom: 20,
    borderRadius: 12,
  },
});

// Platform-specific export
export default Platform.select({
  web: WebSplashScreen,
  default: {
    show: () => {
      try {
        const SplashScreen = require('react-native-splash-screen');
        SplashScreen.show();
      } catch (e) {
        console.warn('react-native-splash-screen not available');
      }
    },
    hide: () => {
      try {
        const SplashScreen = require('react-native-splash-screen');
        SplashScreen.hide();
      } catch (e) {
        console.warn('react-native-splash-screen not available');
      }
    },
  }
});