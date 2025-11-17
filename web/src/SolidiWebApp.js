import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AppStateContext, mainPanelStates } from './context/AppState.web';
import Login from './components/Login.web';
import Dashboard from './pages/Dashboard.web';
import Wallet from './pages/Wallet.web';
import Trading from './pages/Trading.web';
import Payments from './pages/Payments.web';
import Account from './pages/Account.web';

class SolidiWebApp extends Component {
  static contextType = AppStateContext;

  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: false,
    };
  }

  navigateTo = (page) => {
    const { changeState } = this.context;
    this.setState({ isMenuOpen: false });
    
    // Map page names to states (matching mobile app)
    const stateMap = {
      'home': mainPanelStates.LOGIN,
      'trade': 'Trade',
      'assets': 'Assets',
      'wallet': mainPanelStates.WALLET,
      'transfer': 'Transfer',
      'history': 'History',
      'payments': mainPanelStates.WITHDRAW,
      'account': mainPanelStates.PROFILE,
    };
    
    if (stateMap[page]) {
      changeState(stateMap[page]);
    }
  };

  toggleMenu = () => {
    this.setState({ isMenuOpen: !this.state.isMenuOpen });
  };

  renderHeader = () => {
    const { isMenuOpen } = this.state;
    
    console.log('🎨 [SolidiWebApp] Rendering header');
    
    return (
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => this.navigateTo('home')}>
            <Text style={styles.logo}>Solidi</Text>
          </TouchableOpacity>
          
          {/* Desktop Navigation */}
          <View style={styles.desktopNav} nativeID="desktop-nav" data-desktop-nav="true">
            {this.renderNavItems()}
          </View>
          
          {/* Mobile Menu Button */}
          <TouchableOpacity 
            style={styles.mobileMenuButton}
            nativeID="mobile-menu-btn"
            data-mobile-menu-button="true"
            onPress={this.toggleMenu}
          >
            <Text style={styles.menuIcon}>{isMenuOpen ? '✕' : '☰'}</Text>
          </TouchableOpacity>
        </View>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <View style={styles.mobileMenu}>
            {this.renderNavItems()}
          </View>
        )}
      </View>
    );
  };

  renderNavItems = () => {
    const { isLoggedIn, currentState, logout } = this.context;
    
    // Match mobile app's bottom navigation: Trade, Assets, Wallet, Transfer, History
    const navItems = isLoggedIn ? [
      { id: 'trade', label: 'Trade', state: mainPanelStates.BUY },
      { id: 'assets', label: 'Assets', state: 'Assets' },
      { id: 'wallet', label: 'Wallet', state: mainPanelStates.WALLET },
      { id: 'transfer', label: 'Transfer', state: 'Transfer' },
      { id: 'history', label: 'History', state: 'History' },
    ] : [
      { id: 'home', label: 'Home', state: mainPanelStates.LOGIN },
    ];

    return (
      <>
        {navItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.navItem,
              currentState === item.state && styles.navItemActive
            ]}
            onPress={() => this.navigateTo(item.id)}
          >
            <Text style={[
              styles.navText,
              currentState === item.state && styles.navTextActive
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
        
        {isLoggedIn && (
          <TouchableOpacity
            style={styles.navItem}
            onPress={logout}
          >
            <Text style={styles.navText}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  renderPage = () => {
    const { currentState, isLoading, loadingMessage, isLoggedIn } = this.context;

    // Show loading screen
    if (isLoading) {
      return this.renderLoadingScreen(loadingMessage);
    }

    // Route based on currentState from AppState (matching mobile app)
    switch (currentState) {
      case mainPanelStates.LOADING:
        return this.renderLoadingScreen('Initializing...');
      case mainPanelStates.LOGIN:
        return <Login />;
      case mainPanelStates.REGISTER:
        return this.renderRegisterPage();
      case mainPanelStates.DASHBOARD:
      case 'Home':
        return <Dashboard />;
      case 'Trade':
      case mainPanelStates.BUY:
      case mainPanelStates.SELL:
        return <Trading />;
      case 'Assets':
        return <Dashboard />; // For now, Assets shows Dashboard
      case mainPanelStates.WALLET:
        return <Wallet />;
      case 'Transfer':
      case mainPanelStates.WITHDRAW:
        return <Payments />;
      case 'History':
        return <Dashboard />; // For now, History shows Dashboard
      case mainPanelStates.PROFILE:
      case mainPanelStates.SETTINGS:
        return <Account />;
      default:
        return isLoggedIn ? <Dashboard /> : <Login />;
    }
  };

  renderLoadingScreen = (message = 'Loading...') => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>{message}</Text>
      </View>
    );
  };



  renderRegisterPage = () => {
    const { register, changeState } = this.context;
    
    return (
      <View style={styles.page}>
        <View style={styles.accountContainer}>
          <View style={styles.loginCard}>
            <Text style={styles.cardTitle}>Create Account</Text>
            <Text style={styles.cardText}>Join Solidi to start trading</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputPlaceholder}>Email input (coming soon)</Text>
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Username</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputPlaceholder}>Username input (coming soon)</Text>
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputPlaceholder}>Password input (coming soon)</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.button, styles.buttonPrimary, styles.fullWidthButton]}
              onPress={() => {
                register('demo_user', 'demo_password', 'demo@example.com');
              }}
            >
              <Text style={styles.buttonTextPrimary}>Create Account (Demo)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => changeState(mainPanelStates.LOGIN)}
            >
              <Text style={styles.linkText}>Already have an account? Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  renderFooter = () => {
    return (
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Solidi. All rights reserved.</Text>
        <View style={styles.footerLinks}>
          <Text style={styles.footerLink}>Privacy Policy</Text>
          <Text style={styles.footerLink}>Terms of Service</Text>
          <Text style={styles.footerLink}>Contact</Text>
        </View>
      </View>
    );
  };

  render() {
    console.log('🎨 [SolidiWebApp] Main render called', {
      currentState: this.context?.currentState,
      isLoggedIn: this.context?.isLoggedIn
    });
    
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <View style={styles.content}>
          {this.renderPage()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  
  // Header Styles - Matches Mobile App
  header: {
    backgroundColor: '#1976d2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  
  // Navigation
  desktopNav: {
    flexDirection: 'row',
    gap: 10,
  },
  mobileMenuButton: {
    padding: 10,
    display: 'none', // Will be shown on mobile via media query
  },
  menuIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  mobileMenu: {
    backgroundColor: '#1976d2',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  navItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 6,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  navItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  navText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
  },
  navTextActive: {
    fontWeight: '700',
  },
  
  // Content
  content: {
    flex: 1,
  },
  page: {
    minHeight: '80vh',
    paddingVertical: 40,
  },
  
  // Hero Section
  hero: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 20,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  
  // Buttons
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#2196F3',
  },
  buttonSecondary: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  buttonTextPrimary: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextSecondary: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Features
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 60,
    maxWidth: 1200,
    alignSelf: 'center',
    gap: 40,
  },
  feature: {
    alignItems: 'center',
    maxWidth: 300,
    padding: 20,
  },
  featureIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // Page Styles
  pageTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
  
  // Trade Page
  tradeContainer: {
    paddingHorizontal: 20,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  tradePanel: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  
  // Wallet Page
  walletContainer: {
    paddingHorizontal: 20,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  balanceCard: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 10,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  
  // Payments Page
  paymentsContainer: {
    paddingHorizontal: 20,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  panelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  panelText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  methodIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  methodText: {
    fontSize: 18,
    color: '#333',
  },
  
  // Account Page
  accountContainer: {
    paddingHorizontal: 20,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  loginCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // Footer
  footer: {
    backgroundColor: '#333',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 60,
  },
  footerText: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 15,
  },
  footerLinks: {
    flexDirection: 'row',
    gap: 20,
  },
  footerLink: {
    color: '#ffffff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#666',
  },
  
  // Form elements
  formGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  inputPlaceholder: {
    color: '#999',
    fontSize: 14,
  },
  fullWidthButton: {
    width: '100%',
    marginTop: 10,
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#2196F3',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  
  // Profile
  profileInfo: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  profileLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  profileValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default SolidiWebApp;
