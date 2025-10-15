// React imports
import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';

// Material Design imports
import {
  Card,
  Text,
  TextInput,
  Button,
  useTheme,
  Title,
} from 'react-native-paper';

// Other imports
import _ from 'lodash';

// Import logger functionality
import logger from 'src/util/logger';
let logger2 = logger.extend('PhoneVerification');
let { log, jd } = logger.getShortcuts(logger2);

// Import miscellaneous functionality
import misc from 'src/util/misc';

// Import app context
import AppStateContext from 'src/application/data';

export default function PhoneVerification() {
  const appState = useContext(AppStateContext);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');

  const registrationPhone = appState.registrationPhone || '';

  useEffect(() => {
    log('Phone verification page mounted');
    // Auto-focus on verification code input
    setTimeout(() => {
      if (verificationInput.current) {
        verificationInput.current.focus();
      }
    }, 500);
  }, []);

  const verificationInput = useRef();

  const handleVerificationCodeChange = (code) => {
    setVerificationCode(code);
    
    // Auto-submit when 6 digits are entered
    if (code.length === 6) {
      handleVerifyPhone();
    }
  };

  const handleVerifyPhone = async () => {
    if (!verificationCode || verificationCode.length !== 4) {
      Alert.alert('Invalid Code', 'Please enter a 4-digit verification code');
      return;
    }

    setIsVerifying(true);
    setUploadMessage('Verifying your phone number...');

    try {
      log(`Verifying phone with code: ${verificationCode}`);
      
      // Call phone verification API - using same pattern as RegisterConfirm
      const result = await appState.publicMethod({
        functionName: 'verifyPhone',
        apiRoute: `confirm_mobile/${appState.registrationEmail}/${verificationCode}`,
        params: {}
      });

      if (result && !result.error) {
        log('✅ Phone verification successful - Registration complete!');
        setUploadMessage('Phone verified successfully!');
        
        Alert.alert(
          'Registration Complete!', 
          'Your account has been successfully created and verified!',
          [
            {
              text: 'Start Using App',
              onPress: () => {
                // Clear registration data
                appState.registrationEmail = null;
                appState.registrationPhone = null;
                appState.registrationSuccess = false;
                
                // Redirect to login page for user to sign in
                appState.setMainPanelState({
                  mainPanelState: 'Login',
                  pageName: 'default'
                });
              }
            }
          ]
        );
      } else {
        log(`❌ Phone verification failed: ${result.error}`);
        setUploadMessage('');
        Alert.alert('Verification Failed', result.error || 'Invalid verification code');
      }
    } catch (error) {
      log(`❌ Phone verification error: ${error.message}`);
      setUploadMessage('');
      Alert.alert('Error', 'Failed to verify phone. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setResendDisabled(true);
    setResendTimer(60);
    
    try {
      // Resend verification SMS
      const result = await appState.publicMethod({
        functionName: 'resendPhoneVerification',
        apiRoute: 'resend_phone_verification',
        params: {
          phoneNumber: registrationPhone
        }
      });

      if (result && !result.error) {
        Alert.alert('Code Sent', 'A new verification code has been sent to your phone');
      } else {
        Alert.alert('Error', 'Failed to resend verification code');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to resend verification code');
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setResendTimer(prevTimer => {
        const newTimer = prevTimer - 1;
        if (newTimer <= 0) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return newTimer;
      });
    }, 1000);
  };

  const materialTheme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: materialTheme.colors.background }}>
      <Title style={styles.title}>Verify Your Phone</Title>
      
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.subtitle}>
              We've sent a 6-digit verification code via SMS to:
            </Text>
            <Text style={styles.phone}>{registrationPhone}</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Verification Code</Text>
              <TextInput
                ref={verificationInput}
                mode="outlined"
                value={verificationCode}
                onChangeText={handleVerificationCodeChange}
                placeholder="Enter 6-digit code"
                keyboardType="numeric"
                maxLength={6}
                autoCapitalize="none"
                autoCorrect={false}
                disabled={isVerifying}
                style={styles.input}
              />
            </View>

            {uploadMessage ? (
              <Text style={styles.uploadMessage}>{uploadMessage}</Text>
            ) : null}

            <Button
              mode="contained"
              onPress={handleVerifyPhone}
              disabled={isVerifying || verificationCode.length !== 4}
              style={styles.verifyButton}
            >
              {isVerifying ? 'Verifying...' : 'Verify Phone'}
            </Button>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendCode}
              disabled={resendDisabled}
            >
              <Text style={[styles.resendButtonText, resendDisabled && styles.resendButtonTextDisabled]}>
                {resendDisabled ? `Resend in ${resendTimer}s` : 'Resend Code'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                appState.setMainPanelState({
                  mainPanelState: 'EmailVerification',
                  pageName: 'default'
                });
              }}
            >
              <Text style={styles.backButtonText}>← Back to Email Verification</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  card: {
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  phone: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 2,
  },
  uploadMessage: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
  },
  verifyButton: {
    marginVertical: 15,
  },
  resendButton: {
    alignItems: 'center',
    marginBottom: 30,
  },
  resendButtonText: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  resendButtonTextDisabled: {
    textDecorationLine: 'none',
    opacity: 0.5,
  },
  backButton: {
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
  },
});