// Trading Page (Buy/Sell) - Shell
import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { AppStateContext } from '../context/AppState.web';
import theme from '../theme';

class Trading extends Component {
  static contextType = AppStateContext;

  state = {
    activeTab: 'buy', // 'buy' or 'sell'
    amount: '',
    selectedCrypto: 'BTC',
  };

  render() {
    const { isLoggedIn } = this.context;
    const { activeTab, amount, selectedCrypto } = this.state;

    if (!isLoggedIn) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>Please log in to trade</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Trade Crypto</Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'buy' && styles.tabActive]}
              onPress={() => this.setState({ activeTab: 'buy' })}
            >
              <Text style={[styles.tabText, activeTab === 'buy' && styles.tabTextActive]}>
                Buy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'sell' && styles.tabActive]}
              onPress={() => this.setState({ activeTab: 'sell' })}
            >
              <Text style={[styles.tabText, activeTab === 'sell' && styles.tabTextActive]}>
                Sell
              </Text>
            </TouchableOpacity>
          </View>

          {/* Trading Form */}
          <View style={styles.tradingCard}>
            <Text style={styles.cardTitle}>
              {activeTab === 'buy' ? 'Buy Crypto' : 'Sell Crypto'}
            </Text>

            {/* Crypto Selection */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Cryptocurrency</Text>
              <View style={styles.cryptoSelector}>
                <Text style={styles.cryptoText}>{selectedCrypto}</Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </View>
            </View>

            {/* Amount Input */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={amount}
                onChangeText={(text) => this.setState({ amount: text })}
                keyboardType="numeric"
              />
            </View>

            {/* Price Display */}
            <View style={styles.priceDisplay}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Current Price</Text>
                <Text style={styles.priceValue}>$0.00</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Total</Text>
                <Text style={styles.priceValue}>$0.00</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Fee</Text>
                <Text style={styles.priceValue}>$0.00</Text>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.tradeButton}>
              <Text style={styles.tradeButtonText}>
                {activeTab === 'buy' ? 'Buy Now' : 'Sell Now'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Market Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Market Overview</Text>
            
            <View style={styles.marketCard}>
              <View style={styles.marketRow}>
                <View style={styles.marketCoin}>
                  <Text style={styles.coinIcon}>₿</Text>
                  <View>
                    <Text style={styles.coinName}>Bitcoin</Text>
                    <Text style={styles.coinSymbol}>BTC</Text>
                  </View>
                </View>
                <View style={styles.marketPrice}>
                  <Text style={styles.priceAmount}>$0.00</Text>
                  <Text style={styles.priceChange}>+0.00%</Text>
                </View>
              </View>
            </View>

            <View style={styles.marketCard}>
              <View style={styles.marketRow}>
                <View style={styles.marketCoin}>
                  <Text style={styles.coinIcon}>Ξ</Text>
                  <View>
                    <Text style={styles.coinName}>Ethereum</Text>
                    <Text style={styles.coinSymbol}>ETH</Text>
                  </View>
                </View>
                <View style={styles.marketPrice}>
                  <Text style={styles.priceAmount}>$0.00</Text>
                  <Text style={styles.priceChange}>+0.00%</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Recent Orders */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <View style={styles.card}>
              <Text style={styles.emptyText}>No recent orders</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.h2,
    fontWeight: theme.typography.bold,
    color: theme.colors.text,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  tab: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.typography.body,
    fontWeight: theme.typography.semiBold,
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: theme.colors.textInverted,
  },
  tradingCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  cardTitle: {
    fontSize: theme.typography.h4,
    fontWeight: theme.typography.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  formGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.bodySmall,
    fontWeight: theme.typography.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  cryptoSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  cryptoText: {
    fontSize: theme.typography.body,
    fontWeight: theme.typography.semiBold,
    color: theme.colors.text,
  },
  dropdownIcon: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.body,
    backgroundColor: theme.colors.surface,
  },
  priceDisplay: {
    backgroundColor: theme.colors.surfaceDark,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  priceLabel: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
  },
  priceValue: {
    fontSize: theme.typography.body,
    fontWeight: theme.typography.semiBold,
    color: theme.colors.text,
  },
  tradeButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  tradeButtonText: {
    fontSize: theme.typography.body,
    fontWeight: theme.typography.bold,
    color: theme.colors.textInverted,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.h4,
    fontWeight: theme.typography.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  marketCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  marketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marketCoin: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  coinName: {
    fontSize: theme.typography.body,
    fontWeight: theme.typography.semiBold,
    color: theme.colors.text,
  },
  coinSymbol: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  marketPrice: {
    alignItems: 'flex-end',
  },
  priceAmount: {
    fontSize: theme.typography.body,
    fontWeight: theme.typography.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  priceChange: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.success,
    fontWeight: theme.typography.semiBold,
  },
  card: {
    ...theme.commonStyles.card,
  },
  emptyText: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    fontSize: theme.typography.body,
    color: theme.colors.error,
    textAlign: 'center',
    padding: theme.spacing.lg,
  },
});

export default Trading;
