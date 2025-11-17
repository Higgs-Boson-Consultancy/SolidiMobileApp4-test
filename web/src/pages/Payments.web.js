// Payments/Withdraw Page - Shell
import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { AppStateContext } from '../context/AppState.web';
import theme from '../theme';

class Payments extends Component {
  static contextType = AppStateContext;

  state = {
    activeTab: 'withdraw', // 'withdraw' or 'deposit'
    amount: '',
    destination: '',
  };

  render() {
    const { isLoggedIn } = this.context;
    const { activeTab, amount, destination } = this.state;

    if (!isLoggedIn) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>Please log in to access payments</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Payments</Text>
          </View>

          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'withdraw' && styles.tabActive]}
              onPress={() => this.setState({ activeTab: 'withdraw' })}
            >
              <Text style={[styles.tabText, activeTab === 'withdraw' && styles.tabTextActive]}>
                Withdraw
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'deposit' && styles.tabActive]}
              onPress={() => this.setState({ activeTab: 'deposit' })}
            >
              <Text style={[styles.tabText, activeTab === 'deposit' && styles.tabTextActive]}>
                Deposit
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'withdraw' ? (
            <View style={styles.formCard}>
              <Text style={styles.cardTitle}>Withdraw Funds</Text>

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

              <View style={styles.formGroup}>
                <Text style={styles.label}>Destination</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Bank account or wallet address"
                  value={destination}
                  onChangeText={(text) => this.setState({ destination: text })}
                />
              </View>

              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Withdraw</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.formCard}>
              <Text style={styles.cardTitle}>Deposit Funds</Text>
              <Text style={styles.infoText}>
                Use the information below to deposit funds into your account
              </Text>
              
              <View style={styles.depositInfo}>
                <Text style={styles.depositLabel}>Account Number</Text>
                <Text style={styles.depositValue}>XXXX-XXXX-XXXX</Text>
              </View>

              <View style={styles.depositInfo}>
                <Text style={styles.depositLabel}>Sort Code</Text>
                <Text style={styles.depositValue}>XX-XX-XX</Text>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <View style={styles.card}>
              <Text style={styles.emptyText}>No recent transactions</Text>
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
  formCard: {
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
  infoText: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
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
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.body,
    backgroundColor: theme.colors.surface,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  submitButtonText: {
    fontSize: theme.typography.body,
    fontWeight: theme.typography.bold,
    color: theme.colors.textInverted,
  },
  depositInfo: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surfaceDark,
    borderRadius: theme.borderRadius.md,
  },
  depositLabel: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  depositValue: {
    fontSize: theme.typography.body,
    fontWeight: theme.typography.semiBold,
    color: theme.colors.text,
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

export default Payments;
