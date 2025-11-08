// React imports
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View, Alert, Platform, TouchableOpacity, Modal, TextInput, Dimensions, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Apple Pay imports
// import { PaymentRequest, canMakePayments } from 'react-native-payments';

// Material Design imports
import {
  Card,
  Text,
  Button,
  IconButton,
  Divider,
  List,
  Avatar,
  useTheme,
  Surface,
  ProgressBar,
} from 'react-native-paper';

// Other imports
import _ from 'lodash';
import Big from 'big.js';

// Internal imports
import AppStateContext from 'src/application/data';
import { colors, sharedStyles, layoutStyles, cardStyles } from 'src/constants';
import { scaledWidth, scaledHeight, normaliseFont } from 'src/util/dimensions';
import { Title } from 'src/components/shared';
import { StandardButton, AddressBookPicker } from 'src/components/atomic';
import misc from 'src/util/misc';
import { calculatePortfolioValue } from 'src/util/portfolioCalculator';

// Create local references for commonly used styles
const layout = layoutStyles;
const cards = cardStyles;

// Logger
import logger from 'src/util/logger';
let logger2 = logger.extend('Wallet');
let {deb, dj, log, lj} = logger.getShortcuts(logger2);

let Wallet = () => {
  let appState = useContext(AppStateContext);
  let theme = useTheme();
  
  // Check authentication first
  if (!appState) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#666' }}>Loading...</Text>
      </View>
    );
  }
  
  // Check if user is authenticated
  const isAuthenticated = appState.user?.isAuthenticated;
  
  if (!isAuthenticated) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
      }}>
        {/* Header */}
        <View style={{
          backgroundColor: '#FF6B6B',
          paddingVertical: 20,
          paddingHorizontal: 30,
          borderRadius: 12,
          marginBottom: 30,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: 'bold', 
            color: 'white',
            textAlign: 'center',
            marginBottom: 10
          }}>
            🔒 Authentication Required
          </Text>
          <Text style={{ 
            fontSize: 16, 
            color: 'white',
            textAlign: 'center'
          }}>
            Please login to access your wallet
          </Text>
        </View>
        
        <Text style={{ 
          fontSize: 16, 
          color: '#666',
          textAlign: 'center',
          marginBottom: 30,
          lineHeight: 24
        }}>
          You need to be logged in to access{'\n'}your wallet and manage funds.
        </Text>
        
        <TouchableOpacity 
          style={{
            backgroundColor: '#007AFF',
            paddingHorizontal: 30,
            paddingVertical: 15,
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
          onPress={() => {
            console.log('🔐 Redirecting to login page...');
            appState.setMainPanelState('Login');
          }}
        >
          <Text style={{ 
            color: 'white', 
            fontWeight: 'bold', 
            fontSize: 16,
            textAlign: 'center' 
          }}>
            Go to Login
          </Text>
        </TouchableOpacity>
        
        <Text style={{ 
          fontSize: 12, 
          color: '#999',
          textAlign: 'center',
          marginTop: 20
        }}>
          Don't have an account? Sign up in the Login page.
        </Text>
      </View>
    );
  }
  
  let [renderCount, triggerRender] = useState(0);
  let [isLoading, setIsLoading] = useState(true);
  let [depositAmount, setDepositAmount] = useState('');
  let [withdrawAmount, setWithdrawAmount] = useState('');
  let [selectedBalanceTab, setSelectedBalanceTab] = useState('crypto'); // 'crypto' or 'fiat'
  
  // Withdraw modal state
  let [showWithdrawModal, setShowWithdrawModal] = useState(false);
  let [withdrawCurrency, setWithdrawCurrency] = useState('');
  let [withdrawToAddress, setWithdrawToAddress] = useState('');
  let [withdrawAmountInput, setWithdrawAmountInput] = useState('');
  let [isWithdrawing, setIsWithdrawing] = useState(false);
  
  // Fiat withdrawal modal state
  let [showFiatWithdrawModal, setShowFiatWithdrawModal] = useState(false);
  let [fiatWithdrawCurrency, setFiatWithdrawCurrency] = useState('');
  let [fiatWithdrawAmount, setFiatWithdrawAmount] = useState('');
  let [isFiatWithdrawing, setIsFiatWithdrawing] = useState(false);
  
  // Bank account data
  let [userBankAccount, setUserBankAccount] = useState(null);
  let [isLoadingBankAccount, setIsLoadingBankAccount] = useState(false);
  
  let stateChangeID = appState.stateChangeID;

  let pageName = appState.pageName;
  let permittedPageNames = 'default'.split(' ');
  misc.confirmItemInArray('permittedPageNames', permittedPageNames, pageName, 'Wallet');

  // Initial setup
  useEffect(() => {
    setup();
  }, []); // Pass empty array so that this only runs once on mount

  // Recalculate portfolio when balance data changes
  useEffect(() => {
    const balanceData = getBalanceData();
    const hasBalance = Object.keys(balanceData).length > 0;
    
    if (hasBalance && !isLoading) {
      console.log('🔄 WALLET EFFECT: Balance data available, recalculating portfolio...');
      console.log('🔄 WALLET EFFECT: Balance data:', JSON.stringify(balanceData, null, 2));
      calculateTotalPortfolioValue(balanceData);
    }
  }, [appState.apiData?.balance, isLoading]); // Recalculate when balance changes or loading completes

  let setup = async () => {
    try {
      console.log('🔄 Wallet: Starting setup...');
      const generalSetupResult = await appState.generalSetup({caller: 'Wallet'});
      console.log('✅ Wallet: General setup complete');
      
      // No need to load ticker - we use cached prices from AppState!
      console.log('� Wallet: Using cached crypto prices from AppState (no ticker load needed)');
      
      // Load user balances
      try {
        console.log('🏦 Wallet: Loading balances from API...');
        let balanceResult = await appState.loadBalances();
        console.log('✅ Wallet: Balances loaded:', balanceResult);
        
        // Calculate total portfolio value after loading balances
        let balanceData = getBalanceData();
        console.log('📊 WALLET: Calling calculateTotalPortfolioValue with balanceData:', JSON.stringify(balanceData, null, 2));
        calculateTotalPortfolioValue(balanceData);
      } catch (error) {
        log('Wallet: Error loading balances:', error);
      }
      
      // Load user's default bank account for GBP withdrawals
      try {
        console.log('\n' + '🏦'.repeat(60));
        console.log('[WALLET-SETUP] Loading default bank account for GBP...');
        setIsLoadingBankAccount(true);
        
        console.log('[WALLET-SETUP] Calling appState.loadDefaultAccountForAsset("GBP")...');
        await appState.loadDefaultAccountForAsset('GBP');
        
        console.log('[WALLET-SETUP] Calling appState.getDefaultAccountForAsset("GBP")...');
        const bankAccount = appState.getDefaultAccountForAsset('GBP');
        
        console.log('[WALLET-SETUP] Bank account retrieved:', JSON.stringify(bankAccount, null, 2));
        console.log('[WALLET-SETUP] Bank account type:', typeof bankAccount);
        console.log('[WALLET-SETUP] Bank account is null:', bankAccount === null);
        console.log('[WALLET-SETUP] Bank account is undefined:', bankAccount === undefined);
        
        if (bankAccount) {
          console.log('[WALLET-SETUP] ✅ Bank account loaded successfully');
          console.log('[WALLET-SETUP] Account name:', bankAccount.accountName);
          console.log('[WALLET-SETUP] Sort code:', bankAccount.sortCode);
          console.log('[WALLET-SETUP] Account number:', bankAccount.accountNumber);
          console.log('[WALLET-SETUP] UUID:', bankAccount.uuid);
        } else {
          console.log('[WALLET-SETUP] ⚠️ No bank account found (null or undefined)');
        }
        
        setUserBankAccount(bankAccount);
        console.log('[WALLET-SETUP] setUserBankAccount called with:', bankAccount ? 'valid account' : 'null/undefined');
        console.log('🏦'.repeat(60) + '\n');
      } catch (error) {
        console.log('\n' + '❌'.repeat(60));
        console.log('[WALLET-SETUP] 🚨 ERROR loading bank account!');
        console.log('[WALLET-SETUP] Error type:', typeof error);
        console.log('[WALLET-SETUP] Error message:', error?.message);
        console.log('[WALLET-SETUP] Error stack:', error?.stack);
        console.log('[WALLET-SETUP] Full error:', JSON.stringify(error, null, 2));
        console.error('[WALLET-SETUP] Original error:', error);
        console.log('❌'.repeat(60) + '\n');
        setUserBankAccount(null);
      } finally {
        setIsLoadingBankAccount(false);
        console.log('[WALLET-SETUP] Bank account loading complete, isLoadingBankAccount set to false');
      }

      if (appState.stateChangeIDHasChanged(stateChangeID)) return;
      
      setIsLoading(false);
      triggerRender(renderCount + 1);
    } catch(err) {
      let msg = `Wallet.setup: Error = ${err}`;
      console.log(msg);
      setIsLoading(false);
    }
  };

  // Get balance data from real API
  let getBalanceData = () => {
    let balanceData = appState.apiData?.balance || {};
    console.log('🏦 Wallet: Raw balance data from API:', balanceData);
    
    // Transform API balance data to match UI expectations
    let transformedData = {};
    
    // Get assets that actually have data in the API response (user's actual balances)
    // Only show assets where the user has a non-zero balance
    let availableAssets = Object.keys(balanceData).filter(asset => {
      let balance = parseFloat(balanceData[asset]) || 0;
      return balance > 0; // Only include assets with positive balance
    });
    
    console.log('🏦 Wallet: Available assets with balance > 0:', availableAssets);
    
    // If no assets found, return empty object (no balances to show)
    if (availableAssets.length === 0) {
      console.log('🏦 Wallet: No assets with positive balance');
      return {};
    }
    
    availableAssets.forEach(asset => {
      let balance = balanceData[asset] || 0;
      let balanceNumber = 0;
      
      console.log(`🏦 Processing ${asset}: raw balance = ${balance} (type: ${typeof balance})`);
      
      try {
        balanceNumber = parseFloat(balance) || 0;
        console.log(`🏦 ${asset}: parsed balance = ${balanceNumber}`);
      } catch (error) {
        log(`Error parsing balance for ${asset}:`, error);
        balanceNumber = 0;
      }
      
      // For now, treat all balance as available (no reserved amounts from API)
      // This can be enhanced when API provides detailed balance breakdown
      transformedData[asset] = {
        available: balanceNumber,
        reserved: 0,
        total: balanceNumber
      };
      
      console.log(`🏦 ${asset}: final transformed data =`, transformedData[asset]);
    });
    
    console.log('🏦 Wallet: Transformed balance data for UI:', transformedData);
    return transformedData;
  };

  // Format currency display
  let formatCurrency = (amount, currency) => {
    if (_.isNil(amount)) return '0.00';
    
    try {
      let bigAmount = new Big(amount);
      
      // For fiat currencies, show 2 decimal places
      if (['GBP', 'EUR', 'USD'].includes(currency)) {
        return bigAmount.toFixed(2);
      }
      
      // For cryptocurrencies, show up to 8 decimal places (remove trailing zeros)
      return bigAmount.toFixed(8).replace(/\.?0+$/, '');
    } catch (error) {
      log('Error formatting currency:', error);
      return '0.00';
    }
  };

  // Get currency symbol
  let getCurrencySymbol = (currency) => {
    const symbols = {
      GBP: '£',
      EUR: '€',
      USD: '$',
      BTC: '₿',
      ETH: 'Ξ'
    };
    return symbols[currency] || currency;
  };

  // Get currency icon (using same mapping as AddressBook)
  let getCurrencyIcon = (currency) => {
    const iconMap = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum', 
      'GBP': 'currency-gbp',
      'USD': 'currency-usd',
      'EUR': 'currency-eur',
      'LTC': 'litecoin',
      'BCH': 'bitcoin',
      'XRP': 'ripple'
    };
    return iconMap[currency] || 'currency-btc';
  };

  // Calculate total portfolio value using pure function (no caching, no accumulation)
  let [totalPortfolioValue, setTotalPortfolioValue] = useState(0);
  let [isCalculatingTotal, setIsCalculatingTotal] = useState(false);
  let [tickerData, setTickerData] = useState({});

  let calculateTotalPortfolioValue = (balanceData) => {
    if (isCalculatingTotal) {
      console.log('⚠️ WALLET: Portfolio calculation already in progress, skipping...');
      return;
    }
    
    console.log('📊 WALLET WRAPPER: Starting portfolio calculation...');
    console.log('📊 WALLET WRAPPER: Balance data received:', JSON.stringify(balanceData, null, 2));
    
    setIsCalculatingTotal(true);
    
    try {
      // Use pure function from portfolioCalculator utility (now synchronous!)
      const result = calculatePortfolioValue(balanceData, appState);
      
      console.log('📊 WALLET WRAPPER: Portfolio calculation result:', JSON.stringify(result, null, 2));
      
      if (result.error) {
        console.log('❌ WALLET: Portfolio calculation failed:', result.error);
        setTotalPortfolioValue(0);
      } else {
        console.log('✅ WALLET WRAPPER: Setting totalPortfolioValue to:', result.total);
        setTotalPortfolioValue(result.total);
      }
    } catch (error) {
      console.log('📊 WALLET: Error in portfolio calculation wrapper:', error);
      setTotalPortfolioValue(0);
    } finally {
      setIsCalculatingTotal(false);
    }
  };

  // Handle deposit action
  let handleDeposit = async (currency) => {
    if (['BTC', 'ETH'].includes(currency)) {
      Alert.alert(
        'Crypto Deposit',
        `To deposit ${currency}, please use the Receive feature to get your wallet address.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Go to Receive', 
            onPress: () => appState.changeState('Receive')
          }
        ]
      );
      return;
    }

    // For fiat currencies, show Apple Pay option
    Alert.alert(
      `Deposit ${currency}`,
      `Choose your deposit method:`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Apple Pay', 
          onPress: () => handleApplePayDeposit(currency)
        },
        { 
          text: 'Apple Pay (Demo)', 
          onPress: () => handleApplePayDemo(currency)
        },
        { 
          text: 'Bank Transfer', 
          onPress: () => handleBankTransferDeposit(currency)
        }
      ]
    );
  };

  // Handle Apple Pay deposit
  let handleApplePayDeposit = async (currency) => {
    log('Apple Pay deposit requested for currency:', currency);
    
    if (Platform.OS !== 'ios') {
      Alert.alert('Apple Pay Not Available', 'Apple Pay is only available on iOS devices.');
      return;
    }

    try {
      // Step 1: Check if Apple Pay is available
      log('Checking Apple Pay availability...');
      
      // Check multiple Apple Pay conditions
      // const canPay = await canMakePayments();
      const canPay = false; // Apple Pay disabled
      log('Apple Pay canMakePayments result:', canPay);
      
      // Additional checks
      // const deviceSupport = await canMakePayments(['apple-pay']);
      const deviceSupport = false; // Apple Pay disabled
      log('Apple Pay device support:', deviceSupport);
      
      if (!canPay) {
        Alert.alert(
          'Apple Pay Not Available', 
          'Apple Pay is not set up on this device. Please add a card to Wallet and try again.',
          [
            { text: 'Open Settings', onPress: () => log('User should open Settings > Wallet & Apple Pay') },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
        return;
      }

      // Step 2: Show amount input dialog
      log('Showing amount input dialog...');
      const depositAmount = await showDepositAmountDialog(currency);
      if (!depositAmount) {
        log('User cancelled amount input');
        return;
      }

      // Step 3: Validate amount
      const amount = parseFloat(depositAmount);
      log('Amount entered:', depositAmount, 'Parsed:', amount);
      
      if (isNaN(amount) || amount <= 0) {
        Alert.alert('Invalid Amount', 'Please enter a valid deposit amount.');
        return;
      }

      // Step 4: Create payment request with simplified configuration
      log('Creating PaymentRequest for amount:', amount, 'currency:', currency);
      
      // const paymentRequest = new PaymentRequest(
      throw new Error('Apple Pay functionality disabled - react-native-payments removed');
      /*
        [
          {
            supportedMethods: ['apple-pay'],
            data: {
              merchantIdentifier: 'merchant.com.henryyeung.mysolidimobileapp', // Sandbox merchant ID
              supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
              countryCode: 'US', // Try US for better sandbox compatibility
              currencyCode: currency.toUpperCase(),
              merchantCapabilities: ['supports3DS'],
            },
          },
        ],
        {
          id: `deposit-${Date.now()}`,
          displayItems: [
            {
              label: `Deposit to ${currency.toUpperCase()} Wallet`,
              amount: { currency: currency.toUpperCase(), value: amount.toFixed(2) },
            },
          ],
          total: {
            label: 'Solidi Mobile App',
            amount: { currency: currency.toUpperCase(), value: amount.toFixed(2) },
          },
        }
      );

      log('PaymentRequest created, attempting to show payment sheet...');

      // Step 5: Show Apple Pay payment sheet
      const paymentResponse = await paymentRequest.show();
      log('Payment sheet shown, response received');

      // Step 6: Process the payment
      await processApplePayPayment(currency, amount, paymentResponse);

      // Step 7: Complete the payment
      log('Completing payment...');
      await paymentResponse.complete('success');
      log('Payment completed successfully');
      */

      // Step 6: Process the payment
      await processApplePayPayment(currency, amount, paymentResponse);

      // Step 7: Complete the payment
      log('Completing payment...');
      await paymentResponse.complete('success');
      log('Payment completed successfully');

    } catch (error) {
      log('Apple Pay error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        code: error.code
      });
      
      if (error.message === 'AbortError' || error.name === 'AbortError') {
        log('User cancelled Apple Pay');
        return;
      }
      
      // Provide specific error messages based on error type
      let errorMessage = 'Unable to process Apple Pay payment.';
      
      if (error.message.includes('not supported')) {
        errorMessage = 'Apple Pay is not supported on this device or iOS version.';
      } else if (error.message.includes('merchant')) {
        errorMessage = 'Apple Pay merchant configuration error. This is a development setup issue.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error during Apple Pay setup. Please check your connection.';
      } else if (error.message.includes('Invalid')) {
        errorMessage = 'Invalid payment configuration. Please try again.';
      } else {
        errorMessage = `Apple Pay error: ${error.message}`;
      }
      
      Alert.alert(
        'Apple Pay Error', 
        errorMessage,
        [
          { 
            text: 'Try Bank Transfer', 
            onPress: () => handleBankTransferDeposit(currency) 
          },
          { text: 'OK', style: 'cancel' }
        ]
      );
    }
  };

  // Handle Apple Pay Demo (fallback for testing)
  let handleApplePayDemo = async (currency) => {
    log('Apple Pay Demo mode requested');
    
    if (Platform.OS !== 'ios') {
      Alert.alert('Apple Pay Not Available', 'Apple Pay is only available on iOS devices.');
      return;
    }

    try {
      // Step 1: Show amount input dialog
      const depositAmount = await showDepositAmountDialog(currency);
      if (!depositAmount) return;

      // Step 2: Validate amount
      const amount = parseFloat(depositAmount);
      if (isNaN(amount) || amount <= 0) {
        Alert.alert('Invalid Amount', 'Please enter a valid deposit amount.');
        return;
      }

      // Step 3: Simulate Apple Pay payment sheet with native iOS alert
      Alert.alert(
        '🍎 Apple Pay Demo',
        `Simulate payment of ${getCurrencySymbol(currency)}${formatCurrency(amount.toString(), currency)}?\n\nThis is a demo that simulates Apple Pay without requiring merchant setup.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Pay with Touch ID',
            onPress: async () => {
              // Simulate processing delay
              Alert.alert('Processing...', 'Please wait while we process your payment.');
              
              setTimeout(() => {
                Alert.alert(
                  'Payment Successful! 🎉',
                  `Demo payment of ${getCurrencySymbol(currency)}${formatCurrency(amount.toString(), currency)} completed.\n\nTransaction ID: DEMO_${Date.now()}`,
                  [
                    {
                      text: 'View Transaction',
                      onPress: () => appState.changeState('History')
                    },
                    { text: 'OK' }
                  ]
                );
                triggerRender(renderCount + 1);
              }, 2000);
            }
          }
        ]
      );

    } catch (error) {
      log('Apple Pay Demo error:', error);
      Alert.alert('Demo Error', 'There was an error with the Apple Pay demo.');
    }
  };

  // Show deposit amount input dialog
  let showDepositAmountDialog = (currency) => {
    return new Promise((resolve) => {
      Alert.prompt(
        `Deposit ${currency}`,
        `Enter the amount you want to deposit:`,
        [
          { text: 'Cancel', style: 'cancel', onPress: () => resolve(null) },
          {
            text: 'Continue',
            onPress: (amount) => resolve(amount)
          }
        ],
        'plain-text',
        '',
        'numeric'
      );
    });
  };

  // Process Apple Pay payment
  let processApplePayPayment = async (currency, amount, paymentResponse) => {
    try {
      log('Processing Apple Pay payment:', {
        currency,
        amount,
        paymentToken: paymentResponse.details.paymentToken
      });

      // In a real app, you would send the payment token to your backend
      // Your backend would then process it with a payment processor like Stripe
      
      // For sandbox testing, we'll simulate the processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Extract payment token details for logging (sandbox only)
      const paymentToken = paymentResponse.details.paymentToken;
      log('Apple Pay Token received:', {
        transactionIdentifier: paymentToken.transactionIdentifier,
        paymentMethodDisplayName: paymentToken.paymentMethod?.displayName,
        paymentMethodNetwork: paymentToken.paymentMethod?.network
      });

      // Simulate successful payment
      Alert.alert(
        'Payment Successful',
        `Your deposit of ${getCurrencySymbol(currency)}${formatCurrency(amount.toString(), currency)} has been processed successfully via Apple Pay.
        
Transaction ID: ${paymentToken.transactionIdentifier || 'SANDBOX_' + Date.now()}`,
        [
          {
            text: 'View Transaction',
            onPress: () => appState.changeState('History')
          },
          { text: 'OK' }
        ]
      );

      // Trigger a refresh of balances (in a real app, this would update the balance)
      triggerRender(renderCount + 1);
      
    } catch (error) {
      log('Apple Pay processing error:', error);
      Alert.alert('Payment Failed', 'Your Apple Pay payment could not be processed. Please try again.');
      throw error; // Re-throw to let the calling function handle completion
    }
  };

  // Handle bank transfer deposit
  let handleBankTransferDeposit = async (currency) => {
    log('Bank transfer deposit requested for currency:', currency);
    
    try {
      // Ensure deposit details are loaded for the currency
      if (currency === 'GBP') {
        try {
          console.log('🔄 CONSOLE: ===== LOAD DEPOSIT DETAILS API CALL =====');
          console.log('📤 CONSOLE: About to call appState.loadDepositDetailsForAsset("GBP")...');
          const depositDetailsResult = await appState.loadDepositDetailsForAsset('GBP');
          console.log('📨 CONSOLE: ===== LOAD DEPOSIT DETAILS API RESPONSE =====');
          console.log('📨 CONSOLE: Raw loadDepositDetailsForAsset response:', depositDetailsResult);
          console.log('📨 CONSOLE: Response type:', typeof depositDetailsResult);
          console.log('📨 CONSOLE: Response JSON:', JSON.stringify(depositDetailsResult, null, 2));
          console.log('📨 CONSOLE: ===== END LOAD DEPOSIT DETAILS API RESPONSE =====');
          
          log('Deposit details loaded for GBP');
          console.log('✅ CONSOLE: Deposit details loaded for GBP');
        } catch (error) {
          log('Note: Could not load deposit details from server, will use fallback values');
          console.log('⚠️ CONSOLE: Could not load deposit details from server, will use fallback values:', error);
        }
      }

      Alert.alert(
        'Bank Transfer Deposit',
        `You will be redirected to a secure payment gateway to deposit ${currency} via bank transfer.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Continue to Payment', 
            onPress: () => {
              try {
                log('Navigating to MakePayment state for bank transfer');
                // Navigate to payment gateway
                appState.changeState('MakePayment');
              } catch (error) {
                log('Error navigating to payment state:', error);
                Alert.alert(
                  'Navigation Error',
                  'Unable to open payment gateway. Please try again.',
                  [{ text: 'OK' }]
                );
              }
            }
          }
        ]
      );
    } catch (error) {
      log('Error in handleBankTransferDeposit:', error);
      Alert.alert(
        'Error',
        'Unable to process bank transfer request. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  // Handle withdrawal
  let handleWithdraw = (currency) => {
    console.log('\n' + '🏦'.repeat(60));
    console.log('[WALLET] handleWithdraw called');
    console.log('[WALLET] Currency:', currency);
    console.log('[WALLET] Is crypto (BTC/ETH):', ['BTC', 'ETH'].includes(currency));
    console.log('🏦'.repeat(60) + '\n');
    
    if (['BTC', 'ETH'].includes(currency)) {
      console.log('[WALLET] Opening crypto withdrawal modal for', currency);
      // Open withdraw modal for crypto currencies
      setWithdrawCurrency(currency);
      setWithdrawToAddress('');
      setWithdrawAmountInput('');
      setShowWithdrawModal(true);
      console.log('[WALLET] Crypto withdrawal modal opened');
      return;
    }

    console.log('[WALLET] Opening fiat withdrawal modal for', currency);
    console.log('[WALLET] Current userBankAccount:', JSON.stringify(userBankAccount, null, 2));
    
    // For fiat currencies, open fiat withdrawal modal
    setFiatWithdrawCurrency(currency);
    setFiatWithdrawAmount('');
    setShowFiatWithdrawModal(true);
    console.log('[WALLET] Fiat withdrawal modal opened');
    console.log('🏦'.repeat(60) + '\n');
  };

  // Handle fiat withdrawal submission
  let handleFiatWithdrawal = async () => {
    console.log('\n' + '💰'.repeat(60));
    console.log('🚨 [FIAT-WITHDRAW] handleFiatWithdrawal FUNCTION CALLED');
    console.log('💰'.repeat(60));
    console.log('[FIAT-WITHDRAW] Step 1: Validating input amount...');
    console.log('[FIAT-WITHDRAW] fiatWithdrawAmount:', fiatWithdrawAmount);
    console.log('[FIAT-WITHDRAW] fiatWithdrawCurrency:', fiatWithdrawCurrency);
    
    if (!fiatWithdrawAmount) {
      console.log('[FIAT-WITHDRAW] ❌ ERROR: No amount provided');
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    const amount = parseFloat(fiatWithdrawAmount);
    console.log('[FIAT-WITHDRAW] Parsed amount:', amount);
    console.log('[FIAT-WITHDRAW] Amount is NaN:', isNaN(amount));
    console.log('[FIAT-WITHDRAW] Amount <= 0:', amount <= 0);
    
    if (isNaN(amount) || amount <= 0) {
      console.log('[FIAT-WITHDRAW] ❌ ERROR: Invalid amount (NaN or <= 0)');
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    console.log('[FIAT-WITHDRAW] ✅ Amount validation passed');
    console.log('[FIAT-WITHDRAW] Step 2: Checking user balance...');
    
    // Check if user has sufficient balance
    const balanceData = getBalanceData();
    console.log('[FIAT-WITHDRAW] Balance data:', JSON.stringify(balanceData, null, 2));
    
    const availableBalance = balanceData[fiatWithdrawCurrency]?.available || 0;
    console.log('[FIAT-WITHDRAW] Available balance for', fiatWithdrawCurrency, ':', availableBalance);
    console.log('[FIAT-WITHDRAW] Requested amount:', amount);
    console.log('[FIAT-WITHDRAW] Sufficient balance:', amount <= availableBalance);
    
    if (amount > availableBalance) {
      console.log('[FIAT-WITHDRAW] ❌ ERROR: Insufficient balance');
      Alert.alert('Insufficient Balance', `You only have ${getCurrencySymbol(fiatWithdrawCurrency)}${formatCurrency(availableBalance.toString(), fiatWithdrawCurrency)} available.`);
      return;
    }

    console.log('[FIAT-WITHDRAW] ✅ Balance check passed');
    console.log('[FIAT-WITHDRAW] Step 3: Checking bank account setup...');
    console.log('[FIAT-WITHDRAW] userBankAccount:', JSON.stringify(userBankAccount, null, 2));
    console.log('[FIAT-WITHDRAW] userBankAccount is null:', userBankAccount === null);
    console.log('[FIAT-WITHDRAW] userBankAccount is undefined:', userBankAccount === undefined);
    console.log('[FIAT-WITHDRAW] userBankAccount is "[loading]":', userBankAccount === '[loading]');
    
    // Check if bank account is set up
    if (!userBankAccount || userBankAccount === '[loading]') {
      console.log('[FIAT-WITHDRAW] ❌ ERROR: Bank account not set up or loading');
      Alert.alert(
        'Bank Account Required',
        'Please set up your bank account details before making a withdrawal.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Add Bank Account', 
            onPress: () => {
              console.log('[FIAT-WITHDRAW] User chose to add bank account');
              setShowFiatWithdrawModal(false);
              appState.changeState('BankAccounts');
            }
          }
        ]
      );
      return;
    }

    console.log('[FIAT-WITHDRAW] ✅ Bank account check passed');
    console.log('[FIAT-WITHDRAW] Bank account details:', {
      accountName: userBankAccount.accountName,
      sortCode: userBankAccount.sortCode,
      accountNumber: userBankAccount.accountNumber
    });

    try {
      setIsFiatWithdrawing(true);
      console.log('[FIAT-WITHDRAW] Step 4: Preparing API call...');
      console.log('[FIAT-WITHDRAW] Set isWithdrawing to true');
      console.log('[FIAT-WITHDRAW] Currency:', fiatWithdrawCurrency);
      console.log('[FIAT-WITHDRAW] Amount:', amount);
      console.log('[FIAT-WITHDRAW] Bank Account UUID:', userBankAccount.uuid || 'N/A');

      console.log('[FIAT-WITHDRAW] Bank Account UUID:', userBankAccount.uuid || 'N/A');

      console.log('\n' + '📤'.repeat(60));
      console.log('[FIAT-WITHDRAW] ===== MAKING API CALL =====');
      console.log('[FIAT-WITHDRAW] API Route: POST /withdraw');
      console.log('[FIAT-WITHDRAW] API Parameters:', {
        asset: fiatWithdrawCurrency,
        volume: amount.toString(),
        priority: 'normal'
      });
      console.log('📤'.repeat(60) + '\n');

      // Call withdraw API for fiat - uses user's default bank account
      let result = await appState.apiClient.privateMethod({
        httpMethod: 'POST',
        apiRoute: 'withdraw',
        params: {
          asset: fiatWithdrawCurrency,
          volume: amount.toString(),
          priority: 'normal'
        }
      });

      console.log('\n' + '📨'.repeat(60));
      console.log('[FIAT-WITHDRAW] ===== API RESPONSE RECEIVED =====');
      console.log('[FIAT-WITHDRAW] Raw response:', result);
      console.log('[FIAT-WITHDRAW] Response type:', typeof result);
      console.log('[FIAT-WITHDRAW] Response is null:', result === null);
      console.log('[FIAT-WITHDRAW] Response is undefined:', result === undefined);
      console.log('[FIAT-WITHDRAW] Response JSON:', JSON.stringify(result, null, 2));
      
      if (result && typeof result === 'object') {
        console.log('[FIAT-WITHDRAW] Response keys:', Object.keys(result));
        console.log('[FIAT-WITHDRAW] Has "error" property:', 'error' in result);
        console.log('[FIAT-WITHDRAW] Error value:', result.error);
        console.log('[FIAT-WITHDRAW] Error type:', typeof result.error);
        console.log('[FIAT-WITHDRAW] Error is null:', result.error === null);
        console.log('[FIAT-WITHDRAW] Has "data" property:', 'data' in result);
        console.log('[FIAT-WITHDRAW] Data value:', result.data);
        console.log('[FIAT-WITHDRAW] Has "id" property:', 'id' in result);
        console.log('[FIAT-WITHDRAW] ID value:', result.id);
      }
      console.log('📨'.repeat(60) + '\n');

      console.log('[FIAT-WITHDRAW] Step 5: Processing API response...');
      
      // Check for success (same logic as crypto withdrawal)
      let isSuccess = false;
      let successMessage = '';

      console.log('[FIAT-WITHDRAW] Checking if result.error === null...');
      if (result && result.error === null) {
        isSuccess = true;
        console.log('[FIAT-WITHDRAW] ✅ Top-level error is null - treating as success');
        
        if (result?.data?.error && typeof result.data.error === 'string') {
          console.log('[FIAT-WITHDRAW] Found data.error string:', result.data.error);
          successMessage = `Your ${fiatWithdrawCurrency} withdrawal of ${getCurrencySymbol(fiatWithdrawCurrency)}${formatCurrency(amount.toString(), fiatWithdrawCurrency)} - ${result.data.error}`;
        } else if (result?.id) {
          console.log('[FIAT-WITHDRAW] Found transaction ID:', result.id);
          successMessage = `Your ${fiatWithdrawCurrency} withdrawal of ${getCurrencySymbol(fiatWithdrawCurrency)}${formatCurrency(amount.toString(), fiatWithdrawCurrency)} has been initiated.\n\nTransaction ID: ${result.id}\n\nThe funds will be transferred to your bank account within 1-3 business days.`;
        } else {
          console.log('[FIAT-WITHDRAW] No transaction ID found, using generic success message');
          successMessage = `Your ${fiatWithdrawCurrency} withdrawal of ${getCurrencySymbol(fiatWithdrawCurrency)}${formatCurrency(amount.toString(), fiatWithdrawCurrency)} has been initiated.\n\nThe funds will be transferred to your bank account within 1-3 business days.`;
        }
        console.log('[FIAT-WITHDRAW] Success message prepared:', successMessage);
      } else {
        console.log('[FIAT-WITHDRAW] ❌ Response indicates failure');
        console.log('[FIAT-WITHDRAW] result.error is NOT null, value:', result?.error);
      }

      console.log('[FIAT-WITHDRAW] isSuccess:', isSuccess);
      
      if (isSuccess) {
        console.log('[FIAT-WITHDRAW] Step 6: Showing success alert...');
        Alert.alert(
          'Withdrawal Initiated',
          successMessage,
          [
            { 
              text: 'View History', 
              onPress: () => {
                console.log('[FIAT-WITHDRAW] User chose to view history');
                setShowFiatWithdrawModal(false);
                appState.changeState('History');
              }
            },
            { 
              text: 'OK', 
              onPress: () => {
                console.log('[FIAT-WITHDRAW] User clicked OK');
                setShowFiatWithdrawModal(false);
              }
            }
          ]
        );
        
        console.log('[FIAT-WITHDRAW] Step 7: Refreshing balances...');
        // Refresh balances
        await setup();
        console.log('[FIAT-WITHDRAW] ✅ Balances refreshed');
      } else {
        let errorMsg = result?.error || 'Unknown error occurred';
        console.log('[FIAT-WITHDRAW] ❌ Withdrawal failed with error:', errorMsg);
        console.log('[FIAT-WITHDRAW] Showing error alert to user');
        Alert.alert('Withdrawal Failed', errorMsg);
      }
    } catch (error) {
      console.log('\n' + '❌'.repeat(60));
      console.log('[FIAT-WITHDRAW] 🚨 EXCEPTION CAUGHT IN handleFiatWithdrawal!');
      console.log('[FIAT-WITHDRAW] Error type:', typeof error);
      console.log('[FIAT-WITHDRAW] Error name:', error?.name);
      console.log('[FIAT-WITHDRAW] Error message:', error?.message);
      console.log('[FIAT-WITHDRAW] Error stack:', error?.stack);
      console.log('[FIAT-WITHDRAW] Full error object:', JSON.stringify(error, null, 2));
      console.error('[FIAT-WITHDRAW] Original error:', error);
      console.log('❌'.repeat(60) + '\n');
      
      Alert.alert('Withdrawal Failed', 'An error occurred while processing your withdrawal');
    } finally {
      console.log('[FIAT-WITHDRAW] Step 8: Cleanup - setting isFiatWithdrawing to false');
      setIsFiatWithdrawing(false);
      console.log('[FIAT-WITHDRAW] ✅ Function complete');
      console.log('💰'.repeat(60) + '\n');
    }
  };

  // Handle crypto withdrawal with address book UUID
  let handleCryptoWithdraw = async () => {
    if (!withdrawToAddress || !withdrawAmountInput) {
      Alert.alert('Error', 'Please select an address and enter an amount');
      return;
    }

    if (!appState.apiClient) {
      Alert.alert('Error', 'API client not available');
      return;
    }

    try {
      setIsWithdrawing(true);
      
      console.log('🏦 Starting crypto withdrawal...');
      console.log('🏦 Currency:', withdrawCurrency);
      console.log('🏦 Address UUID:', withdrawToAddress);
      console.log('🏦 Amount:', withdrawAmountInput);

      console.log('🔄 CONSOLE: ===== CRYPTO WITHDRAW API CALL =====');
      console.log('📤 CONSOLE: About to call appState.apiClient.privateMethod for withdraw...');
      console.log('📤 CONSOLE: API parameters:', {
        httpMethod: 'POST',
        apiRoute: 'withdraw',
        params: {
          address: withdrawToAddress, // This is the UUID from address book
          volume: withdrawAmountInput,
          priority: 'normal'
        }
      });

      // Call withdraw API using address book UUID
      let result = await appState.apiClient.privateMethod({
        httpMethod: 'POST',
        apiRoute: 'withdraw',
        params: {
          address: withdrawToAddress, // This is the UUID from address book
          volume: withdrawAmountInput,
          priority: 'normal' // Can be 'low', 'normal', or 'high'
        }
      });

      console.log('📨 CONSOLE: ===== CRYPTO WITHDRAW API RESPONSE =====');
      console.log('📨 CONSOLE: Raw privateMethod (withdraw) response:', result);
      console.log('📨 CONSOLE: Response type:', typeof result);
      console.log('📨 CONSOLE: Response is null:', result === null);
      console.log('📨 CONSOLE: Response is undefined:', result === undefined);
      console.log('📨 CONSOLE: Response JSON:', JSON.stringify(result, null, 2));
      console.log('📨 CONSOLE: ===== END CRYPTO WITHDRAW API RESPONSE =====');
      
      console.log('🏦 Withdraw API result:', result);
      console.log('🏦 ===== DETAILED API RESPONSE ANALYSIS =====');
      console.log('🏦 Response type:', typeof result);
      console.log('🏦 Response is null:', result === null);
      console.log('🏦 Response is undefined:', result === undefined);
      console.log('🏦 Response stringified:', JSON.stringify(result, null, 2));
      
      if (result && typeof result === 'object') {
        console.log('🏦 Response keys:', Object.keys(result));
        console.log('🏦 Has error property:', 'error' in result);
        console.log('🏦 Error value:', result.error);
        console.log('🏦 Error type:', typeof result.error);
        console.log('🏦 Error is null:', result.error === null);
        console.log('🏦 Error is undefined:', result.error === undefined);
        console.log('🏦 Error stringified:', JSON.stringify(result.error));
        
        if (result.error && typeof result.error === 'string') {
          console.log('🏦 Error string length:', result.error.length);
          console.log('🏦 Error lowercase:', result.error.toLowerCase());
          console.log('🏦 Contains "successfully":', result.error.toLowerCase().includes('successfully'));
          console.log('🏦 Contains "queued":', result.error.toLowerCase().includes('queued'));
          console.log('🏦 Contains "withdrawal":', result.error.toLowerCase().includes('withdrawal'));
        }
        
        console.log('🏦 Has id property:', 'id' in result);
        console.log('🏦 ID value:', result.id);
        console.log('🏦 Has data property:', 'data' in result);
        console.log('🏦 Data value:', result.data);
      }
      console.log('🏦 ===== END DETAILED RESPONSE ANALYSIS =====');

      // Check for success conditions
      let isSuccess = false;
      let successMessage = '';

      if (result && result.error === null) {
        // Top-level error is null - this indicates success
        isSuccess = true;
        console.log('🏦 Top-level error is null - treating as success');
        
        // Check for success message in data.error
        if (result?.data?.error && typeof result.data.error === 'string') {
          console.log('🏦 Using success message from data.error:', result.data.error);
          successMessage = `Your ${withdrawCurrency} withdrawal of ${withdrawAmountInput} - ${result.data.error}`;
        } else if (result?.id) {
          console.log('🏦 Using transaction ID for success message:', result.id);
          successMessage = `Your ${withdrawCurrency} withdrawal of ${withdrawAmountInput} has been initiated. Transaction ID: ${result.id}`;
        } else {
          successMessage = `Your ${withdrawCurrency} withdrawal of ${withdrawAmountInput} has been initiated.`;
        }
      }

      if (isSuccess) {
        Alert.alert(
          'Withdrawal Initiated',
          successMessage,
          [{ text: 'OK', onPress: () => setShowWithdrawModal(false) }]
        );
        
        // Refresh balances
        await setup();
      } else {
        // Handle actual errors (when top-level error is not null)
        let errorMsg = result?.error || 'Unknown error occurred';
        console.log('🏦 Withdrawal failed with error (top-level error not null):', errorMsg);
        console.log('🏦 Full error response:', JSON.stringify(result, null, 2));
        Alert.alert('Withdrawal Failed', errorMsg);
      }
    } catch (error) {
      console.error('🏦 Withdraw error:', error);
      Alert.alert('Withdrawal Failed', 'An error occurred while processing your withdrawal');
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Helper function to determine if an asset is cryptocurrency
  let isCryptoCurrency = (currency) => {
    // Fiat currencies
    const fiatCurrencies = ['GBP', 'EUR', 'USD', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD'];
    // If it's not fiat, it's crypto
    return !fiatCurrencies.includes(currency);
  };

  // Calculate GBP value for any currency using pre-calculated values (instant!)
  let calculateGBPValue = (currency, amount) => {
    console.log(`🔍 WALLET calculateGBPValue: ${currency}, amount = ${amount}`);
    
    if (currency === 'GBP') {
      console.log(`🔍 WALLET: ${currency} is GBP, returning amount: ${amount}`);
      return amount; // Already in GBP
    }
    
    // Check if amount is valid
    if (!amount || amount <= 0) {
      console.log(`🔍 WALLET: ${currency} has zero/invalid amount, returning 0`);
      return 0;
    }
    
    // For crypto: Try to get pre-calculated balance first (fastest!)
    if (isCryptoCurrency(currency)) {
      console.log(`🔍 WALLET: ${currency} is crypto, checking pre-calculated value...`);
      // If this is the user's actual balance, get pre-calculated value
      const userBalance = parseFloat(appState.getBalance(currency));
      console.log(`🔍 WALLET: User balance from appState = ${userBalance}`);
      
      if (Math.abs(amount - userBalance) < 0.00000001) {
        // This is the user's balance - use pre-calculated value!
        const precalculatedValue = appState.getBalanceInGBP(currency);
        console.log(`🔍 WALLET: Pre-calculated GBP value = ${precalculatedValue}`);
        
        if (precalculatedValue !== undefined && precalculatedValue !== 0) {
          console.log(`⚡ WALLET: ${currency} using PRE-CALCULATED balance: £${precalculatedValue.toFixed(2)}`);
          return precalculatedValue;
        }
      }
      
      // Otherwise calculate on-the-fly using cached rate
      console.log(`🔍 WALLET: Calculating on-the-fly using appState.calculateCryptoGBPValue...`);
      const value = appState.calculateCryptoGBPValue(currency, amount);
      console.log(`🔍 WALLET: On-the-fly calculated value = ${value}`);
      return value || 0;
    }
    
    // Fallback for fiat currencies (EUR, USD) - would need exchange rates
    console.log(`🔍 WALLET: ${currency} is fiat (not GBP), returning 0 (no exchange rate)`);
    return 0;
  };

  // Navigate to CryptoContent page
  const navigateToCrypto = (currency, balanceInfo, tickerData) => {
    // Only allow navigation for crypto currencies
    const isCrypto = ['BTC', 'ETH', 'XRP', 'LTC', 'ADA', 'DOT', 'LINK', 'UNI'].includes(currency);
    if (!isCrypto) {
      console.log(`${currency} is not a crypto currency, navigation skipped`);
      return;
    }

    const { total } = balanceInfo;
    const gbpValue = calculateGBPValue(currency, total); // Use cached prices (instant!)
    
    // Get current price from AppState cache
    const currentPrice = appState.getCryptoSellPrice(currency) || 0;
    
    // Calculate 24h price change (mock data for now)
    const priceChange = Math.random() * 10 - 5; // Random between -5% and +5%
    
    // Get crypto name mapping
    const cryptoNames = {
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum', 
      'XRP': 'Ripple',
      'LTC': 'Litecoin',
      'ADA': 'Cardano',
      'DOT': 'Polkadot',
      'LINK': 'Chainlink',
      'UNI': 'Uniswap'
    };

    // Set selected crypto data in app state
    appState.selectedCrypto = {
      asset: currency,
      name: cryptoNames[currency] || currency,
      symbol: currency,
      balance: total.toString(),
      currentPrice: currentPrice,
      priceChange: priceChange,
      portfolioValue: gbpValue.toString()
    };

    console.log(`🚀 Navigating to CryptoContent for ${currency}:`, appState.selectedCrypto);

    // Navigate to CryptoContent page
    appState.setMainPanelState({
      mainPanelState: 'CryptoContent',
      pageName: 'default'
    });
  };

  // Render balance list item for each currency
  let renderBalanceListItem = (currency, balanceInfo, tickerData) => {
    let { total } = balanceInfo;
    let icon = getCurrencyIcon(currency);
    let isCrypto = isCryptoCurrency(currency);
    
    // Calculate GBP value instantly using cached prices (no async needed!)
    let gbpValue = calculateGBPValue(currency, total);
    
    console.log(`💰 WALLET CARD: ${currency} balance = ${total}, GBP value = £${gbpValue.toFixed(2)}`);
    
    // For display: always show GBP value on the right
    let displayValue = `£${formatCurrency(gbpValue.toString(), 'GBP')}`;
    
    // Show original amount in description for reference
    let description = '';
    if (currency === 'GBP') {
      description = 'Base currency';
    } else {
      // Show original amount for all non-GBP currencies
      if (isCrypto) {
        description = `${formatCurrency(total, currency)} ${currency}`;
      } else {
        description = `${getCurrencySymbol(currency)}${formatCurrency(total, currency)}`;
      }
    }
    
    // Get icon color exactly like AddressBook
    let getAssetColor = (assetType) => {
      switch (assetType) {
        case 'BTC': return '#f7931a';
        case 'ETH': return '#627eea';
        case 'GBP': return '#009639';
        default: return '#999999'; // mediumGray equivalent
      }
    };
    
    return (
      <View key={currency} style={{ paddingVertical: 8 }}>
        <List.Item
          title={currency}
          description={description}
          onPress={() => navigateToCrypto(currency, balanceInfo, tickerData)}
          left={props => (
            <View style={{ 
              justifyContent: 'center', 
              alignItems: 'center',
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: theme.colors.surfaceVariant,
              marginRight: 12
            }}>
              <Icon name={icon} size={24} color={getAssetColor(currency)} />
            </View>
          )}
          right={props => (
            <View style={{ justifyContent: 'center' }}>
              <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                {displayValue}
              </Text>
            </View>
          )}
          style={{ paddingVertical: 4 }}
        />
      </View>
    );
  };

  // Filter balances by type
  let getFilteredBalances = (balanceData, type) => {
    return Object.entries(balanceData).filter(([currency]) => {
      let isCrypto = isCryptoCurrency(currency);
      return type === 'crypto' ? isCrypto : !isCrypto;
    });
  };

  let balanceData = getBalanceData();

  console.log('🎯 WALLET RENDER: Current totalPortfolioValue state:', totalPortfolioValue);
  console.log('🎯 WALLET RENDER: Current isCalculatingTotal state:', isCalculatingTotal);

  if (isLoading) {
    return (
      <View style={[layout.panelContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ProgressBar indeterminate />
        <Text style={{ marginTop: 16 }}>Loading wallet...</Text>
      </View>
    );
  }

  return (
    <View style={layout.panelContainer}>
      
      <ScrollView 
        style={layout.panelSubContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingBottom: 20, 
          paddingHorizontal: 16 
        }}
      >
        {/* Wallet Overview Card */}
        <Card style={{ marginBottom: 20 }}>
          <Card.Content style={{ padding: 20 }}>
            <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 16 }}>
              Your Wallet
            </Text>
            
            {/* Total Portfolio Value */}
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 4 }}>
                Total Portfolio Value
              </Text>
              <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                {isCalculatingTotal ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ProgressBar indeterminate style={{ width: 100, marginRight: 8 }} />
                    <Text>Calculating...</Text>
                  </View>
                ) : (
                  `£${formatCurrency(totalPortfolioValue.toString(), 'GBP')}`
                )}
              </Text>
            </View>
            
            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Button
                mode="contained"
                onPress={() => {
                  // Navigate to DepositInstructions page
                  appState.changeState('DepositInstructions');
                }}
                style={{ flex: 1 }}
                icon="plus"
              >
                Deposit
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  Alert.alert(
                    'Select Currency',
                    'Choose which currency to withdraw:',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'GBP', onPress: () => handleWithdraw('GBP') },
                      { text: 'EUR', onPress: () => handleWithdraw('EUR') },
                      { text: 'USD', onPress: () => handleWithdraw('USD') },
                      { text: 'BTC', onPress: () => handleWithdraw('BTC') },
                      { text: 'ETH', onPress: () => handleWithdraw('ETH') }
                    ]
                  );
                }}
                style={{ flex: 1 }}
                icon="minus"
              >
                Withdraw
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Balance Cards with Tabs */}
        <Card style={{ marginBottom: 12 }}>
          <Card.Content style={{ padding: 0 }}>
            <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                Your Balances
              </Text>
            </View>
            
            {/* Tab Navigation */}
            <View style={{ flexDirection: 'row', paddingHorizontal: 16, marginBottom: 8 }}>
              <Button
                mode={selectedBalanceTab === 'crypto' ? 'contained' : 'outlined'}
                onPress={() => setSelectedBalanceTab('crypto')}
                style={{ 
                  flex: 1, 
                  marginRight: 8,
                  borderRadius: 20
                }}
                compact
              >
                Crypto
              </Button>
              <Button
                mode={selectedBalanceTab === 'fiat' ? 'contained' : 'outlined'}
                onPress={() => setSelectedBalanceTab('fiat')}
                style={{ 
                  flex: 1,
                  borderRadius: 20
                }}
                compact
              >
                Fiat
              </Button>
            </View>
            
            <Divider />
            
            {/* Balance List */}
            <View>
              {getFilteredBalances(balanceData, selectedBalanceTab).map(([currency, balanceInfo]) => 
                renderBalanceListItem(currency, balanceInfo, tickerData)
              )}
              {getFilteredBalances(balanceData, selectedBalanceTab).length === 0 && (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
                    No {selectedBalanceTab} balances to display
                  </Text>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={{ marginTop: 12 }}>
          <Card.Content style={{ padding: 16 }}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 12 }}>
              Quick Actions
            </Text>
            
            <List.Item
              title="View Transaction History"
              description="See all your deposits and withdrawals"
              left={props => <List.Icon {...props} icon="history" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => appState.changeState('History')}
              style={{ paddingHorizontal: 0 }}
            />
            
            <Divider />
            
            <List.Item
              title="Manage Bank Accounts"
              description="Add or update your banking details"
              left={props => <List.Icon {...props} icon="bank" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => appState.changeState('BankAccounts')}
              style={{ paddingHorizontal: 0 }}
            />
          </Card.Content>
        </Card>

        {/* Security Notice */}
        <Surface style={{ 
          padding: 16, 
          marginTop: 16, 
          borderRadius: 8,
          backgroundColor: theme.colors.primaryContainer 
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <List.Icon icon="shield-check" color={theme.colors.primary} />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text variant="titleSmall" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                Your Funds Are Secure
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer, marginTop: 4 }}>
                All crypto deposits are stored in secure cold storage. Find out more about our security in our{' '}
                <Text 
                  style={{ 
                    color: theme.colors.primary, 
                    textDecorationLine: 'underline',
                    fontWeight: 'bold'
                  }}
                  onPress={() => {
                    Linking.openURL('https://www.solidi.co/blog/industry-leading-security/').catch(err => 
                      console.error('Error opening URL:', err)
                    );
                  }}
                >
                  blog article
                </Text>
              </Text>
            </View>
          </View>
        </Surface>
      </ScrollView>

      {/* Withdraw Modal */}
      <Modal
        visible={showWithdrawModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWithdrawModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 20,
            width: '100%',
            maxWidth: 400,
            maxHeight: '80%'
          }}>
            <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
              Withdraw {withdrawCurrency}
            </Text>

            {/* Address Selection */}
            <View style={{ marginBottom: 20 }}>
              <Text variant="titleMedium" style={{ marginBottom: 10 }}>
                Select Destination Address
              </Text>
              <AddressBookPicker
                selectedAsset={withdrawCurrency}
                onAddressSelect={(address, selectedAddressData) => {
                  console.log('🏦 Selected address:', address);
                  console.log('🏦 Selected address data:', selectedAddressData);
                  // Use the UUID from the address data for the API call
                  let addressUUID = selectedAddressData?.id || selectedAddressData?.rawData?.uuid;
                  console.log('🏦 Address UUID for API:', addressUUID);
                  setWithdrawToAddress(addressUUID);
                }}
                label="Choose from Address Book"
                placeholder="Select a saved address..."
              />
              {withdrawToAddress ? (
                <Text variant="bodySmall" style={{ marginTop: 8, color: theme.colors.primary }}>
                  ✓ Address selected
                </Text>
              ) : null}
            </View>

            {/* Amount Input */}
            <View style={{ marginBottom: 20 }}>
              <Text variant="titleMedium" style={{ marginBottom: 10 }}>
                Amount to Withdraw
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: theme.colors.outline,
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 16
                }}
                placeholder={`Enter ${withdrawCurrency} amount`}
                value={withdrawAmountInput}
                onChangeText={setWithdrawAmountInput}
                keyboardType="numeric"
                autoCapitalize="none"
              />
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: theme.colors.surfaceVariant,
                  marginRight: 10
                }}
                onPress={() => setShowWithdrawModal(false)}
                disabled={isWithdrawing}
              >
                <Text style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: isWithdrawing ? theme.colors.surfaceVariant : theme.colors.primary,
                  marginLeft: 10
                }}
                onPress={handleCryptoWithdraw}
                disabled={isWithdrawing || !withdrawToAddress || !withdrawAmountInput}
              >
                <Text style={{ 
                  textAlign: 'center', 
                  color: isWithdrawing ? theme.colors.onSurfaceVariant : theme.colors.onPrimary,
                  fontWeight: 'bold'
                }}>
                  {isWithdrawing ? 'Processing...' : 'Withdraw'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Fiat Withdraw Modal */}
      <Modal
        visible={showFiatWithdrawModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFiatWithdrawModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 20,
            width: '100%',
            maxWidth: 400,
            maxHeight: '80%'
          }}>
            <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
              Withdraw {fiatWithdrawCurrency}
            </Text>

            {/* Amount Input */}
            <View style={{ marginBottom: 20 }}>
              <Text variant="titleMedium" style={{ marginBottom: 10 }}>
                Amount to Withdraw
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text variant="titleLarge" style={{ marginRight: 8 }}>
                  {getCurrencySymbol(fiatWithdrawCurrency)}
                </Text>
                <TextInput
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: theme.colors.outline,
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16
                  }}
                  placeholder={`Enter amount`}
                  value={fiatWithdrawAmount}
                  onChangeText={setFiatWithdrawAmount}
                  keyboardType="decimal-pad"
                  autoCapitalize="none"
                />
              </View>
              {fiatWithdrawAmount && balanceData[fiatWithdrawCurrency] ? (
                <Text variant="bodySmall" style={{ marginTop: 8, color: theme.colors.onSurfaceVariant }}>
                  Available: {getCurrencySymbol(fiatWithdrawCurrency)}{formatCurrency(balanceData[fiatWithdrawCurrency].available.toString(), fiatWithdrawCurrency)}
                </Text>
              ) : null}
            </View>

            {/* Bank Account Display */}
            <View style={{ marginBottom: 20 }}>
              <Text variant="titleMedium" style={{ marginBottom: 10 }}>
                Withdrawal Destination
              </Text>
              {isLoadingBankAccount ? (
                <View style={{
                  borderWidth: 1,
                  borderColor: theme.colors.outline,
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: theme.colors.surfaceVariant
                }}>
                  <Text style={{ color: theme.colors.onSurfaceVariant }}>
                    Loading bank account...
                  </Text>
                </View>
              ) : userBankAccount && userBankAccount !== '[loading]' ? (
                <View style={{
                  borderWidth: 1,
                  borderColor: theme.colors.primary,
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: theme.colors.surfaceVariant
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Icon name="bank" size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
                    <Text variant="titleSmall" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                      {userBankAccount.accountName || 'Bank Account'}
                    </Text>
                  </View>
                  {userBankAccount.sortCode && (
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      Sort Code: {userBankAccount.sortCode}
                    </Text>
                  )}
                  {userBankAccount.accountNumber && (
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      Account: ****{userBankAccount.accountNumber.slice(-4)}
                    </Text>
                  )}
                </View>
              ) : (
                <View style={{
                  borderWidth: 1,
                  borderColor: theme.colors.error,
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: theme.colors.errorContainer
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Icon name="alert-circle" size={20} color={theme.colors.error} style={{ marginRight: 8 }} />
                    <Text variant="titleSmall" style={{ fontWeight: 'bold', color: theme.colors.error }}>
                      No Bank Account
                    </Text>
                  </View>
                  <Text variant="bodySmall" style={{ color: theme.colors.onErrorContainer, marginBottom: 8 }}>
                    Please set up your bank account details to withdraw funds.
                  </Text>
                  <TouchableOpacity 
                    onPress={() => {
                      setShowFiatWithdrawModal(false);
                      appState.changeState('BankAccounts');
                    }}
                    style={{
                      backgroundColor: theme.colors.error,
                      padding: 8,
                      borderRadius: 6,
                      alignItems: 'center'
                    }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                      Add Bank Account
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Processing Time Notice */}
            <View style={{ 
              backgroundColor: theme.colors.surfaceVariant, 
              padding: 12, 
              borderRadius: 8,
              marginBottom: 20 
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Icon name="information" size={20} color={theme.colors.onSurfaceVariant} style={{ marginRight: 8, marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    Bank transfers typically take 1-3 business days to process.
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: theme.colors.surfaceVariant,
                  marginRight: 10
                }}
                onPress={() => setShowFiatWithdrawModal(false)}
                disabled={isFiatWithdrawing}
              >
                <Text style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: isFiatWithdrawing ? theme.colors.surfaceVariant : theme.colors.primary,
                  marginLeft: 10
                }}
                onPress={handleFiatWithdrawal}
                disabled={isFiatWithdrawing || !fiatWithdrawAmount}
              >
                <Text style={{ 
                  textAlign: 'center', 
                  color: isFiatWithdrawing ? theme.colors.onSurfaceVariant : theme.colors.onPrimary,
                  fontWeight: 'bold'
                }}>
                  {isFiatWithdrawing ? 'Processing...' : 'Withdraw'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Wallet;