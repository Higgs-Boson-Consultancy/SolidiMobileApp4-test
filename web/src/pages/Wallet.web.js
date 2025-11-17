// Wallet Page - Shell
import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { AppStateContext } from '../context/AppState.web';
import theme from '../theme';

class Wallet extends Component {
  static contextType = AppStateContext;

  render() {
    const { isLoggedIn } = this.context;

    if (!isLoggedIn) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>Please log in to view wallets</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>My Wallets</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Add Wallet</Text>
            </TouchableOpacity>
          </View>

          {/* Total Balance Card */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceValue}>$0.00 USD</Text>
            <Text style={styles.balanceChange}>+$0.00 (0.00%) today</Text>
          </View>

          {/* Wallet List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Wallets</Text>
            
            {/* Placeholder wallet cards */}
            <View style={styles.walletCard}>
              <View style={styles.walletHeader}>
                <View style={styles.coinIcon}>
                  <Text style={styles.coinSymbol}>₿</Text>
                </View>
                <View style={styles.walletInfo}>
                  <Text style={styles.walletName}>Bitcoin</Text>
                  <Text style={styles.walletSymbol}>BTC</Text>
                </View>
                <View style={styles.walletBalance}>
                  <Text style={styles.walletAmount}>0.00000000 BTC</Text>
                  <Text style={styles.walletValue}>$0.00 USD</Text>
                </View>
              </View>
            </View>

            <View style={styles.walletCard}>
              <View style={styles.walletHeader}>
                <View style={styles.coinIcon}>
                  <Text style={styles.coinSymbol}>Ξ</Text>
                </View>
                <View style={styles.walletInfo}>
                  <Text style={styles.walletName}>Ethereum</Text>
                  <Text style={styles.walletSymbol}>ETH</Text>
                </View>
                <View style={styles.walletBalance}>
                  <Text style={styles.walletAmount}>0.000000 ETH</Text>
                  <Text style={styles.walletValue}>$0.00 USD</Text>
                </View>
              </View>
            </View>

            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No wallets yet. Add a wallet to get started.</Text>
            </View>
          </View>

          {/* Transactions Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <View style={styles.card}>
              <Text style={styles.emptyText}>No transactions yet</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.h2,
    fontWeight: theme.typography.bold,
    color: theme.colors.text,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  addButtonText: {
    color: theme.colors.textInverted,
    fontWeight: theme.typography.semiBold,
    fontSize: theme.typography.body,
  },
  balanceCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  balanceLabel: {
    fontSize: theme.typography.body,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: theme.spacing.xs,
  },
  balanceValue: {
    fontSize: theme.typography.h1,
    fontWeight: theme.typography.bold,
    color: theme.colors.textInverted,
    marginBottom: theme.spacing.xs,
  },
  balanceChange: {
    fontSize: theme.typography.bodySmall,
    color: 'rgba(255, 255, 255, 0.9)',
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
  walletCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  coinSymbol: {
    fontSize: 24,
    color: theme.colors.textInverted,
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    fontSize: theme.typography.body,
    fontWeight: theme.typography.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  walletSymbol: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  walletBalance: {
    alignItems: 'flex-end',
  },
  walletAmount: {
    fontSize: theme.typography.body,
    fontWeight: theme.typography.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  walletValue: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  card: {
    ...theme.commonStyles.card,
  },
  emptyCard: {
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

export default Wallet;
