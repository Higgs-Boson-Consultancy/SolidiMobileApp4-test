// React imports
import React, { useState, useContext, useEffect } from 'react';
import { 
  Text, 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  Dimensions 
} from 'react-native';
import { Title, IconButton, Card, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Internal imports
import { scaledWidth, scaledHeight, normaliseFont } from 'src/util/dimensions';
import { colors } from 'src/constants';
import AppStateContext from 'src/application/data';

// Logger
import logger from 'src/util/logger';
let logger2 = logger.extend('AddressBookSelectionModal');
let {deb, dj, log, lj} = logger.getShortcuts(logger2);

const { height: screenHeight } = Dimensions.get('window');

let AddressBookSelectionModal = ({ visible, onClose, onSelectAddress, selectedAsset }) => {
  // Get app state for API access
  let appState = useContext(AppStateContext);
  
  // Component state
  let [addresses, setAddresses] = useState([]);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(null);

  // Load addresses when modal opens
  useEffect(() => {
    if (visible && selectedAsset) {
      loadAddresses();
    }
  }, [visible, selectedAsset]);

  let loadAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      log('📖 Loading addresses for asset:', selectedAsset);
      
      if (appState.loadAddressBook) {
        const addressBookResult = await appState.loadAddressBook(selectedAsset);
        
        if (addressBookResult && Array.isArray(addressBookResult)) {
          const transformedAddresses = addressBookResult.map((addr, index) => {
            // Parse the address JSON string to get the actual wallet address
            let addressInfo = {};
            try {
              if (typeof addr.address === 'string') {
                addressInfo = JSON.parse(addr.address);
              } else {
                addressInfo = addr.address || {};
              }
            } catch (e) {
              addressInfo = { address: addr.address };
            }
            
            return {
              id: addr.uuid || `${selectedAsset.toLowerCase()}_${index}`,
              uuid: addr.uuid,
              recipient: addr.recipient || 'Unknown',
              firstName: addr.firstName || '',
              lastName: addr.lastName || '',
              displayName: `${addr.firstName || ''} ${addr.lastName || ''}`.trim() || addr.recipient || 'Unknown',
              address: addressInfo.address || addr.address,
              asset: selectedAsset,
              rawData: addr
            };
          });
          
          setAddresses(transformedAddresses);
          log('✅ Loaded addresses:', transformedAddresses.length);
        } else {
          setAddresses([]);
          log('ℹ️ No addresses found for asset:', selectedAsset);
        }
      } else {
        setError('Address book function not available');
      }
    } catch (err) {
      log('❌ Error loading addresses:', err);
      setError(err.message || 'Failed to load addresses');
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  let handleAddressSelect = (address) => {
    log('📍 Address selected:', address);
    onSelectAddress(address.address, address);
    onClose();
  };

  let renderAddressItem = (address) => (
    <TouchableOpacity
      key={address.id}
      style={styles.addressItem}
      onPress={() => handleAddressSelect(address)}
      activeOpacity={0.7}
    >
      <View style={styles.addressItemContent}>
        <View style={styles.addressHeader}>
          <View style={styles.addressInfo}>
            <Text style={styles.addressName}>{address.displayName}</Text>
            {address.recipient && address.recipient !== address.displayName && (
              <Text style={styles.addressRecipient}>({address.recipient})</Text>
            )}
          </View>
          <View style={styles.assetBadge}>
            <Text style={styles.assetBadgeText}>{address.asset}</Text>
          </View>
        </View>
        <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">
          {address.address || 'No address'}
        </Text>
      </View>
      <Icon name="chevron-right" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Title style={styles.title}>Choose from Address Book</Title>
          <IconButton
            icon="close"
            size={24}
            onPress={onClose}
            style={styles.closeButton}
          />
        </View>

        {/* Asset Info */}
        <View style={styles.assetInfo}>
          <Text style={styles.assetInfoText}>
            Showing addresses for {selectedAsset || 'Unknown Asset'}
          </Text>
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
          {loading ? (
            <View style={styles.centerContent}>
              <Text style={styles.loadingText}>Loading addresses...</Text>
            </View>
          ) : error ? (
            <View style={styles.centerContent}>
              <Icon name="alert-circle" size={48} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadAddresses}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : addresses.length === 0 ? (
            <View style={styles.centerContent}>
              <Icon name="book-outline" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No saved addresses found</Text>
              <Text style={styles.emptySubtext}>
                Add addresses using the + button in the Transfer page
              </Text>
            </View>
          ) : (
            <View style={styles.addressList}>
              <Text style={styles.sectionTitle}>
                {addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}
              </Text>
              {addresses.map(renderAddressItem)}
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.defaultBackground,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scaledWidth(20),
    paddingVertical: scaledHeight(15),
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  title: {
    fontSize: normaliseFont(20),
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    margin: 0,
  },
  assetInfo: {
    paddingHorizontal: scaledWidth(20),
    paddingVertical: scaledHeight(10),
    backgroundColor: colors.primary + '10',
  },
  assetInfoText: {
    fontSize: normaliseFont(14),
    color: colors.primary,
    fontWeight: '500',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: scaledWidth(20),
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scaledHeight(60),
  },
  loadingText: {
    fontSize: normaliseFont(16),
    color: colors.textSecondary,
    marginTop: scaledHeight(16),
  },
  errorText: {
    fontSize: normaliseFont(16),
    color: colors.error,
    marginTop: scaledHeight(16),
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: scaledWidth(20),
    paddingVertical: scaledHeight(10),
    borderRadius: 6,
    marginTop: scaledHeight(16),
  },
  retryButtonText: {
    color: colors.white,
    fontSize: normaliseFont(14),
    fontWeight: '600',
  },
  emptyText: {
    fontSize: normaliseFont(18),
    color: colors.textSecondary,
    marginTop: scaledHeight(16),
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: normaliseFont(14),
    color: colors.textSecondary,
    marginTop: scaledHeight(8),
    textAlign: 'center',
    paddingHorizontal: scaledWidth(40),
  },
  addressList: {
    paddingBottom: scaledHeight(20),
  },
  sectionTitle: {
    fontSize: normaliseFont(16),
    fontWeight: '600',
    color: colors.text,
    marginBottom: scaledHeight(16),
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: scaledWidth(16),
    marginBottom: scaledHeight(8),
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addressItemContent: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaledHeight(6),
  },
  addressInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressName: {
    fontSize: normaliseFont(16),
    fontWeight: '600',
    color: colors.text,
    marginRight: scaledWidth(8),
  },
  addressRecipient: {
    fontSize: normaliseFont(12),
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  assetBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: scaledWidth(8),
    paddingVertical: scaledHeight(4),
    borderRadius: 4,
  },
  assetBadgeText: {
    fontSize: normaliseFont(10),
    color: colors.white,
    fontWeight: '600',
  },
  addressText: {
    fontSize: normaliseFont(14),
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  footer: {
    padding: scaledWidth(20),
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  cancelButton: {
    backgroundColor: colors.lightGray,
    paddingVertical: scaledHeight(12),
    paddingHorizontal: scaledWidth(20),
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: normaliseFont(16),
    fontWeight: '600',
    color: colors.text,
  },
});

export default AddressBookSelectionModal;