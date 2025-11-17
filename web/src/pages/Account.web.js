// Account/Profile Page - Shell
import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { AppStateContext } from '../context/AppState.web';
import theme from '../theme';

class Account extends Component {
  static contextType = AppStateContext;

  state = {
    isEditing: false,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
  };

  handleLogout = () => {
    const { logout } = this.context;
    if (logout) {
      logout();
    }
  };

  render() {
    const { isLoggedIn, username } = this.context;
    const { isEditing, name, email, phone } = this.state;

    if (!isLoggedIn) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>Please log in to access your account</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Account</Text>
          </View>

          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(username || name || 'U').charAt(0).toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{username || name}</Text>
              <Text style={styles.profileEmail}>{email}</Text>
            </View>

            {!isEditing && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => this.setState({ isEditing: true })}
              >
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            )}
          </View>

          {isEditing && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Edit Profile</Text>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={(text) => this.setState({ name: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(text) => this.setState({ email: text })}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={(text) => this.setState({ phone: text })}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => this.setState({ isEditing: false })}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => this.setState({ isEditing: false })}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>
            <View style={styles.card}>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>Change Password</Text>
                <Text style={styles.menuItemIcon}>›</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>Two-Factor Authentication</Text>
                <Text style={styles.menuItemIcon}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.card}>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>Notifications</Text>
                <Text style={styles.menuItemIcon}>›</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>Language</Text>
                <Text style={styles.menuItemIcon}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={this.handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
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
    maxWidth: 800,
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
  profileCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: theme.typography.bold,
    color: theme.colors.textInverted,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  profileName: {
    fontSize: theme.typography.h4,
    fontWeight: theme.typography.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  profileEmail: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
  },
  editButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  editButtonText: {
    fontSize: theme.typography.body,
    fontWeight: theme.typography.semiBold,
    color: theme.colors.textInverted,
  },
  card: {
    ...theme.commonStyles.card,
    marginBottom: theme.spacing.lg,
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
  input: {
    ...theme.commonStyles.input,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  cancelButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelButtonText: {
    fontSize: theme.typography.body,
    fontWeight: theme.typography.semiBold,
    color: theme.colors.text,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  saveButtonText: {
    fontSize: theme.typography.body,
    fontWeight: theme.typography.semiBold,
    color: theme.colors.textInverted,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.h4,
    fontWeight: theme.typography.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  menuItemText: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
  },
  menuItemIcon: {
    fontSize: 24,
    color: theme.colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  logoutButtonText: {
    fontSize: theme.typography.body,
    fontWeight: theme.typography.bold,
    color: theme.colors.textInverted,
  },
  errorText: {
    fontSize: theme.typography.body,
    color: theme.colors.error,
    textAlign: 'center',
    padding: theme.spacing.lg,
  },
});

export default Account;
