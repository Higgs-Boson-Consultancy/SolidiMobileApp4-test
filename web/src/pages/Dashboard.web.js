// Dashboard/Home Page - Matches Mobile App Home.js Design
import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { AppStateContext } from '../context/AppState.web';

const { width: screenWidth } = Dimensions.get('window');

class Dashboard extends Component {
  static contextType = AppStateContext;

  formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  render() {
    const { isLoggedIn, username } = this.context;

    if (!isLoggedIn) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>Please log in to access your dashboard</Text>
        </View>
      );
    }

    // Demo data (will be replaced with real data from AppState)
    const portfolioValue = 15234.56;
    const monthlyChange = 1234.56;
    const monthlyChangePercent = 8.8;

    const actionButtons = [
      { id: 'trade', title: 'Trade', icon: '↔️' },
      { id: 'send', title: 'Send', icon: '⬆️' },
      { id: 'receive', title: 'Receive', icon: '⬇️' },
      { id: 'wallet', title: 'Wallet', icon: '💼' },
    ];

    const cryptoAssets = [
      { asset: 'BTC', name: 'Bitcoin', balance: '0.5234', value: 8234.56, change: '+5.2%' },
      { asset: 'ETH', name: 'Ethereum', balance: '2.1234', value: 4234.56, change: '+3.1%' },
      { asset: 'LTC', name: 'Litecoin', balance: '15.234', value: 1234.56, change: '-1.2%' },
      { asset: 'XRP', name: 'Ripple', balance: '1000.00', value: 567.89, change: '+2.3%' },
      { asset: 'BCH', name: 'Bitcoin Cash', balance: '5.000', value: 1200.00, change: '-0.5%' },
    ];

    return (
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Main Portfolio Section */}
          <View style={styles.portfolioSection}>
            <View style={styles.portfolioContent}>
              <Text style={styles.portfolioValue}>
                {this.formatCurrency(portfolioValue)}
              </Text>
              <View style={styles.portfolioChange}>
                <Text style={[styles.changeText, monthlyChange >= 0 && styles.positiveChange]}>
                  {monthlyChange >= 0 ? '+' : ''}{this.formatCurrency(monthlyChange)}
                </Text>
                <Text style={[styles.changePercent, monthlyChange >= 0 && styles.positiveChange]}>
                  ({monthlyChange >= 0 ? '+' : ''}{monthlyChangePercent.toFixed(1)}%)
                </Text>
              </View>
              <Text style={styles.portfolioLabel}>Last 30 Days</Text>
            </View>

            {/* Chart Placeholder */}
            <View style={styles.chartContainer}>
              <View style={styles.chartPlaceholder}>
                <Text style={styles.chartText}>📈 Portfolio Performance</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons Section */}
          <View style={styles.actionsSection}>
            <View style={styles.actionsContainer}>
              {actionButtons.map((button) => (
                <TouchableOpacity
                  key={button.id}
                  style={styles.actionButton}
                  onPress={() => console.log(`Tapped ${button.title}`)}
                  activeOpacity={0.7}
                >
                  <View style={styles.actionButtonIcon}>
                    <Text style={styles.actionIconText}>{button.icon}</Text>
                  </View>
                  <Text style={styles.actionButtonText}>{button.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Crypto Assets Section */}
          <View style={styles.homeSection}>
            <View style={styles.homeSectionHeader}>
              <Text style={styles.homeSectionTitle}>Your Assets</Text>
              <TouchableOpacity onPress={() => console.log('Navigate to Assets')}>
                <Text style={styles.homeSectionSeeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.homeAssetsList}>
              {cryptoAssets.map((asset) => (
                <TouchableOpacity key={asset.asset} style={styles.homeAssetItem}>
                  <View style={styles.homeAssetIconSection}>
                    <View style={styles.assetIcon}>
                      <Text style={styles.assetIconText}>{asset.asset[0]}</Text>
                    </View>
                  </View>
                  <View style={styles.homeAssetMainContent}>
                    <Text style={styles.homeAssetName}>{asset.name}</Text>
                    <Text style={styles.homeAssetSymbol}>{asset.balance} {asset.asset}</Text>
                  </View>
                  <View style={styles.homeAssetPriceSection}>
                    <Text style={styles.homeAssetPrice}>{this.formatCurrency(asset.value)}</Text>
                    <Text style={[
                      styles.homeAssetChange,
                      asset.change.startsWith('-') && styles.negativeChange
                    ]}>
                      {asset.change}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Transactions Section */}
          <View style={styles.homeSection}>
            <View style={styles.homeSectionHeader}>
              <Text style={styles.homeSectionTitle}>Recent Transactions</Text>
              <TouchableOpacity onPress={() => console.log('Navigate to History')}>
                <Text style={styles.homeSectionSeeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.homeTransactionsList}>
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No recent transactions</Text>
                <Text style={styles.emptyStateSubtext}>Your transactions will appear here</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    padding: 24,
  },
  
  // Portfolio Section Styles (matches mobile Home.js)
  portfolioSection: {
    backgroundColor: '#F9FAFB',
    paddingTop: 20,
    paddingBottom: 16,
  },
  portfolioContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  portfolioValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  portfolioChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  changeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  changePercent: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  positiveChange: {
    color: '#10B981',
  },
  portfolioLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  chartContainer: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  chartPlaceholder: {
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  chartText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  
  // Action Buttons Styles (matches mobile Home.js)
  actionsSection: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  actionButtonIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIconText: {
    fontSize: 24,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
    marginTop: 4,
  },
  
  // Home Section Styles (matches mobile Home.js)
  homeSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  homeSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  homeSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  homeSectionSeeAll: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366F1',
  },
  
  // Assets List Styles (matches mobile Home.js)
  homeAssetsList: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 4,
  },
  homeAssetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginVertical: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  homeAssetIconSection: {
    marginRight: 12,
  },
  assetIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  assetIconText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  homeAssetMainContent: {
    flex: 1,
  },
  homeAssetName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  homeAssetSymbol: {
    fontSize: 12,
    color: '#6B7280',
  },
  homeAssetPriceSection: {
    alignItems: 'flex-end',
  },
  homeAssetPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  homeAssetChange: {
    fontSize: 12,
    color: '#10B981',
  },
  negativeChange: {
    color: '#EF4444',
  },
  
  // Transactions List Styles (matches mobile Home.js)
  homeTransactionsList: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default Dashboard;
