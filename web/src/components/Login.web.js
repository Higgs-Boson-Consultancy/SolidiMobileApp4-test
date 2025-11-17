// Web-specific Login component
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { AppStateContext } from '../context/AppState.web.js';

const colors = {
  primary: '#1976d2',
  background: '#ffffff',
  surface: '#ffffff',
  text: '#212121',
  textSecondary: '#757575',
  error: '#f44336',
  border: '#e0e0e0',
  success: '#4caf50',
};

/**
 * Login component for the Solidi Web App
 * Matches mobile Login.js Material Design styling
 */
function Login() {
  const appState = useContext(AppStateContext);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tfa, setTFA] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [disableLoginButton, setDisableLoginButton] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [challenges, setChallenges] = useState(['email', 'password']);

  // Simple email storage for convenience (not secure, just for username)
  const storeEmail = async (emailToStore) => {
    try {
      localStorage.setItem('solidi_email', emailToStore);
    } catch (error) {
      console.error('Failed to store email:', error);
    }
  };

  const getStoredEmail = async () => {
    try {
      return localStorage.getItem('solidi_email') || '';
    } catch (error) {
      console.error('Failed to get stored email:', error);
      return '';
    }
  };

  // Load stored email on mount
  useEffect(() => {
    const loadEmail = async () => {
      const storedEmail = await getStoredEmail();
      if (storedEmail) {
        setEmail(storedEmail);
      }
    };
    loadEmail();
  }, []);

  // Auto-login attempt (basic version for web)
  useEffect(() => {
    const attemptAutoLogin = async () => {
      if (appState?.user?.apiCredentialsFound && !appState?.user?.isAuthenticated) {
        console.log('Auto-login attempt...');
        // For web, we're not implementing full auto-login yet
        // This would require secure credential storage
      }
    };
    attemptAutoLogin();
  }, [appState?.user?.apiCredentialsFound, appState?.user?.isAuthenticated]);

  const submitLoginRequest = async () => {
    console.log('🚀 Login attempt:', { 
      email: email ? 'provided' : 'missing', 
      password: password ? 'provided' : 'missing'
    });

    setDisableLoginButton(true);
    
    try {
      // Validate inputs
      if (!email || !password) {
        let msg = !email && password 
          ? 'Email is required.'
          : email && !password
          ? 'Password is required.'
          : 'Email and password are required.';
        
        Alert.alert('Login Error', msg);
        setDisableLoginButton(false);
        return;
      }

      // Attempt login
      setUploadMessage('Logging in...');
      const output = await appState.login({ email, password, tfa });

      // Check for TFA requirement
      if (output === 'TFA_REQUIRED') {
        setChallenges(['email', 'password', 'tfa']);
        setUploadMessage('');
        setDisableLoginButton(false);
        return;
      }

      // Store email for convenience on successful login
      await storeEmail(email);

      // Redirect to home page on successful login
      setUploadMessage('');
      appState.changeState('Home');
      
    } catch (err) {
      console.error('Login error:', err);
      Alert.alert(
        'Login Error',
        err.message || 'An error occurred during login. Please try again.'
      );
      setUploadMessage('');
      setDisableLoginButton(false);
    }
  };

  const handleRegister = () => {
    appState.changeState('Register');
  };

  const handleForgotPassword = () => {
    appState.changeState('ResetPassword');
  };

  const handleContactUs = () => {
    appState.changeState('ContactUs');
  };

  return (
    <View style={styles.container}>
      {/* Page Title */}
      <Text style={styles.pageTitle}>Secure Login</Text>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          {/* Login Form Card */}
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>🔐 Sign In</Text>

              {/* Email Field */}
              {challenges.includes('email') && (
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIconContainer}>
                    <Text style={styles.inputIcon}>📧</Text>
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Email Address"
                      placeholderTextColor={colors.textSecondary}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                    />
                  </View>
                </View>
              )}

              {/* Password Field */}
              {challenges.includes('password') && (
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIconContainer}>
                    <Text style={styles.inputIcon}>🔒</Text>
                    <TextInput
                      style={styles.input}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Password"
                      placeholderTextColor={colors.textSecondary}
                      secureTextEntry={!passwordVisible}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setPasswordVisible(!passwordVisible)}
                    >
                      <Text style={styles.eyeIcon}>
                        {passwordVisible ? '👁️' : '👁️‍🗨️'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Two-Factor Authentication */}
              {challenges.includes('tfa') && (
                <View style={styles.tfaContainer}>
                  <View style={styles.tfaHeader}>
                    <Text style={styles.tfaInfo}>📱 Two-Factor Authentication Required</Text>
                  </View>
                  <Text style={styles.tfaDescription}>
                    Please open Google Authenticator and enter the code for your Solidi account.
                  </Text>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIconContainer}>
                      <Text style={styles.inputIcon}>🔑</Text>
                      <TextInput
                        style={styles.input}
                        value={tfa}
                        onChangeText={setTFA}
                        placeholder="Authentication Code"
                        placeholderTextColor={colors.textSecondary}
                        keyboardType="number-pad"
                        maxLength={6}
                      />
                    </View>
                  </View>
                </View>
              )}

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.button, disableLoginButton && styles.buttonDisabled]}
                onPress={submitLoginRequest}
                disabled={disableLoginButton}
              >
                <Text style={styles.buttonIcon}>🔓</Text>
                {disableLoginButton ? (
                  <ActivityIndicator color="#ffffff" size="small" style={styles.buttonLoader} />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </TouchableOpacity>

              {/* Upload Message */}
              {uploadMessage && (
                <Text style={styles.uploadMessage}>{uploadMessage}</Text>
              )}

              {/* Start Again Button for TFA */}
              {challenges.includes('tfa') && (
                <TouchableOpacity
                  style={styles.outlineButton}
                  onPress={() => setChallenges(['email', 'password'])}
                >
                  <Text style={styles.outlineButtonIcon}>🔄</Text>
                  <Text style={styles.outlineButtonText}>Start Again</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Additional Actions Card */}
          <View style={styles.actionsCard}>
            <View style={styles.cardContent}>
              <Text style={styles.actionsCardTitle}>Need Help?</Text>
              
              <TouchableOpacity 
                style={styles.textButton}
                onPress={handleForgotPassword}
              >
                <Text style={styles.textButtonIcon}>🔑</Text>
                <Text style={styles.textButtonText}>Forgot Password?</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.textButton}
                onPress={handleRegister}
              >
                <Text style={styles.textButtonIcon}>➕</Text>
                <Text style={styles.textButtonText}>Create New Account</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.textButton}
                onPress={handleContactUs}
              >
                <Text style={styles.textButtonIcon}>❓</Text>
                <Text style={styles.textButtonText}>Contact Support</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Auto-login Loading Overlay */}
      {appState?.user?.isAutoLoginInProgress && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Signing you in...</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 480,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 24,
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 12,
    paddingHorizontal: 0,
    outlineStyle: 'none',
  },
  eyeButton: {
    padding: 8,
    marginLeft: 4,
  },
  eyeIcon: {
    fontSize: 20,
  },
  tfaContainer: {
    marginBottom: 16,
  },
  tfaHeader: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  tfaInfo: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  tfaDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonLoader: {
    marginLeft: 8,
  },
  uploadMessage: {
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 12,
    backgroundColor: '#e3f2fd',
    padding: 8,
    borderRadius: 8,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  outlineButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  outlineButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  actionsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  actionsCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 16,
  },
  textButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  textButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  textButtonText: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 32,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
});

export default Login;
