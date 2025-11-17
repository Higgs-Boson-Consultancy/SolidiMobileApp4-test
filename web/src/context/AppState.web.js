// Web-specific AppState - Simplified version for web platform
// This will be progressively enhanced as we migrate features

import React, { Component, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the context
export const AppStateContext = createContext();

// Web-safe Keychain mock using AsyncStorage
const Keychain = {
  getInternetCredentials: async (key) => {
    try {
      const stored = await AsyncStorage.getItem(`keychain_${key}`);
      if (stored) {
        const { username, password } = JSON.parse(stored);
        return { username, password };
      }
    } catch (error) {
      console.error('[Keychain] Error retrieving:', error);
    }
    return { username: false, password: false };
  },
  setInternetCredentials: async (key, username, password) => {
    try {
      await AsyncStorage.setItem(`keychain_${key}`, JSON.stringify({ username, password }));
    } catch (error) {
      console.error('[Keychain] Error storing:', error);
    }
  },
  resetInternetCredentials: async (key) => {
    try {
      await AsyncStorage.removeItem(`keychain_${key}`);
    } catch (error) {
      console.error('[Keychain] Error removing:', error);
    }
  }
};

// Main app states - matching mobile app
const mainPanelStates = {
  LOADING: 'Loading',
  LOGIN: 'Login',
  REGISTER: 'Register',
  DASHBOARD: 'Dashboard',
  WALLET: 'Wallet',
  BUY: 'Buy',
  SELL: 'Sell',
  TRADE: 'Trade',
  ASSETS: 'Assets',
  TRANSFER: 'Transfer',
  HISTORY: 'History',
  WITHDRAW: 'Withdraw',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
};

class AppStateProvider extends Component {
  constructor(props) {
    super(props);
    
    console.log('🏗️ [AppState] Constructor - Initializing state');
    
    this.state = {
      // Current page/state - Start with LOGIN instead of LOADING for web
      currentState: mainPanelStates.LOGIN,
      
      // Navigation history
      stateHistoryList: [],
      
      // User authentication
      isLoggedIn: false,
      username: null,
      password: null,
      apiKey: null,
      apiSecret: null,
      
      // User profile data
      profile: null,
      user: {
        email: null,
        isAuthenticated: false,
        apiCredentialsFound: false,
      },
      
      // Wallet data
      wallets: [],
      balances: {},
      
      // App config
      appVersion: '1.2.0',
      buildNumber: '20251112',
      domain: 't2.solidi.co', // API domain
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SolidiWeb/1.0',
      
      // Loading states
      isLoading: false,
      loadingMessage: '',
      
      // Error handling
      error: null,
      
      // API client (will be initialized)
      apiClient: null,
      
      // Constants
      mainPanelStates,
      Keychain, // Expose Keychain for components
    };
  }

  componentDidMount() {
    this.initializeApp();
  }

  // Initialize the app
  initializeApp = async () => {
    try {
      console.log('🚀 [AppState] Initializing web app...');
      
      // Check for stored credentials
      const credentials = await this.checkStoredCredentials();
      
      if (credentials.username && credentials.password) {
        console.log('✓ [AppState] Found stored credentials');
        this.setState({
          username: credentials.username,
          password: credentials.password,
        });
        
        // Try auto-login
        await this.attemptAutoLogin(credentials);
      } else {
        // No credentials, show login
        console.log('ℹ️ [AppState] No stored credentials, showing login');
        this.changeState(mainPanelStates.LOGIN);
      }
    } catch (error) {
      console.error('❌ [AppState] Initialization error:', error);
      this.changeState(mainPanelStates.LOGIN);
    }
  };

  // Check for stored credentials
  checkStoredCredentials = async () => {
    try {
      const result = await Keychain.getInternetCredentials('SolidiApp');
      return {
        username: result.username || null,
        password: result.password || null,
      };
    } catch (error) {
      console.error('[AppState] Error checking credentials:', error);
      return { username: null, password: null };
    }
  };

  // Attempt auto-login
  attemptAutoLogin = async (credentials) => {
    try {
      console.log('🔐 [AppState] Attempting auto-login...');
      // TODO: Implement actual API call
      // For now, just set as logged in
      this.setState({
        isLoggedIn: true,
        currentState: mainPanelStates.DASHBOARD,
      });
    } catch (error) {
      console.error('❌ [AppState] Auto-login failed:', error);
      this.changeState(mainPanelStates.LOGIN);
    }
  };

  // Change current state/page
  changeState = (newState, params = {}) => {
    console.log(`📱 [AppState] Changing state: ${this.state.currentState} → ${newState}`);
    
    const { stateHistoryList } = this.state;
    
    // Add current state to history before changing
    if (this.state.currentState !== mainPanelStates.LOADING) {
      stateHistoryList.push({
        state: this.state.currentState,
        timestamp: Date.now(),
      });
    }
    
    this.setState({
      currentState: newState,
      stateHistoryList,
      ...params,
    });
  };

  // Navigate back
  decrementStateHistory = () => {
    const { stateHistoryList } = this.state;
    
    if (stateHistoryList.length > 0) {
      const previousState = stateHistoryList.pop();
      console.log(`⬅️ [AppState] Going back to: ${previousState.state}`);
      
      this.setState({
        currentState: previousState.state,
        stateHistoryList,
      });
    }
  };

  // Login function with real API
  login = async ({ email, password, tfa = '' }) => {
    try {
      console.log(`🔐 [AppState] Logging in as: ${email}`);
      this.setState({ isLoading: true, loadingMessage: 'Logging in...' });
      
      // Import API client dynamically
      const SolidiRestAPIClientLibrary = require('../../../src/api/SolidiRestAPIClientLibrary').default;
      
      // Get domain and userAgent from state
      const { domain, userAgent, appVersion, buildNumber } = this.state;
      
      console.log(`📡 [AppState] Using domain: ${domain}`);
      console.log(`🌐 [AppState] Using userAgent: ${userAgent}`);
      
      const apiClient = new SolidiRestAPIClientLibrary({
        userAgent,
        apiKey: '',
        apiSecret: '',
        domain,
        appStateRef: { current: this }
      });
      
      console.log('✅ [AppState] API client created');
      
      // Call login API
      const apiRoute = `login_mobile/${email}`;
      const optionalParams = {
        origin: {
          clientType: 'web',
          os: 'web',
          appVersion: appVersion,
          appBuildNumber: buildNumber,
          appTier: 'prod',
        }
      };
      
      const params = { password, tfa, optionalParams };
      
      // Create AbortController for the request
      const abortController = new AbortController();
      
      console.log('🚀 [AppState] Calling login API...');
      const data = await apiClient.publicMethod({
        httpMethod: 'POST',
        apiRoute,
        params,
        abortController
      });
      
      console.log('📥 [AppState] Login response received:', data);
      
      // Check for TFA requirement
      if (data.error) {
        console.log('❌ [AppState] Login error:', data.error);
        if (data.error.code === 400 && data.error.details?.tfa_required) {
          console.log('🔒 [AppState] TFA Required');
          this.setState({ isLoading: false, loadingMessage: '' });
          return 'TFA_REQUIRED';
        }
        throw new Error(data.error.message || 'Login failed');
      }
      
      // Validate response
      if (!data.apiKey || !data.apiSecret) {
        throw new Error('Invalid username or password.');
      }
      
      const { apiKey, apiSecret } = data;
      console.log('✅ [AppState] Login successful, API credentials received');
      
      // Store credentials
      await Keychain.setInternetCredentials('SolidiApp', email, password);
      await Keychain.setInternetCredentials('SolidiApp_API', apiKey, apiSecret);
      
      // Create authenticated API client using state variables
      const { domain: stateDomain, userAgent: stateUserAgent } = this.state;
      const authenticatedClient = new SolidiRestAPIClientLibrary({
        userAgent: stateUserAgent,
        apiKey,
        apiSecret,
        domain: stateDomain,
        appStateRef: { current: this }
      });
      
      this.setState({
        isLoggedIn: true,
        username: email,
        password,
        apiKey,
        apiSecret,
        apiClient: authenticatedClient,
        isLoading: false,
        loadingMessage: '',
        user: {
          email,
          isAuthenticated: true,
          apiCredentialsFound: true,
        }
      });
      
      this.changeState(mainPanelStates.DASHBOARD);
      
      return { success: true };
    } catch (error) {
      console.error('❌ [AppState] Login error:', error);
      this.setState({
        isLoading: false,
        loadingMessage: '',
        error: error.message,
      });
      throw error;
    }
  };

  // Logout function
  logout = async () => {
    try {
      console.log('🚪 [AppState] Logging out...');
      
      // Clear stored credentials
      await Keychain.resetInternetCredentials('SolidiApp');
      
      this.setState({
        isLoggedIn: false,
        username: null,
        password: null,
        profile: null,
        wallets: [],
        balances: {},
        stateHistoryList: [],
      });
      
      this.changeState(mainPanelStates.LOGIN);
    } catch (error) {
      console.error('❌ [AppState] Logout error:', error);
    }
  };

  // Register function
  register = async (username, password, email) => {
    try {
      console.log(`📝 [AppState] Registering user: ${username}`);
      this.setState({ isLoading: true, loadingMessage: 'Creating account...' });
      
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.setState({ isLoading: false, loadingMessage: '' });
      
      // After successful registration, log in
      return await this.login(username, password);
    } catch (error) {
      console.error('❌ [AppState] Registration error:', error);
      this.setState({
        isLoading: false,
        loadingMessage: '',
        error: error.message,
      });
      return { success: false, error: error.message };
    }
  };

  render() {
    const contextValue = {
      // State
      ...this.state,
      
      // Methods
      changeState: this.changeState,
      decrementStateHistory: this.decrementStateHistory,
      login: this.login,
      logout: this.logout,
      register: this.register,
      
      // Constants
      mainPanelStates,
    };

    return (
      <AppStateContext.Provider value={contextValue}>
        {this.props.children}
      </AppStateContext.Provider>
    );
  }
}

// Hook to use AppState
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};

export { AppStateProvider, mainPanelStates };
export default AppStateProvider;
