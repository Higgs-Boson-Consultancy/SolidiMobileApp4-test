// React imports
import React from 'react';
import { StyleSheet, View, Modal, Dimensions, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';

// Internal imports
import AddressBookForm from './AddressBookForm';
import { colors } from 'src/constants';
import { scaledWidth, scaledHeight } from 'src/util/dimensions';

// Logger
import logger from 'src/util/logger';
let logger2 = logger.extend('AddressBookModal');
let {deb, dj, log, lj} = logger.getShortcuts(logger2);

const { height: screenHeight } = Dimensions.get('window');

/**
 * AddressBookModal - Modal wrapper for AddressBook form
 * Used in Transfer page to add new withdrawal addresses
 * Uses the shared AddressBookForm component
 * 
 * @param {boolean} visible - Whether the modal is visible
 * @param {Function} onClose - Callback when modal closes
 * @param {string} selectedAsset - Pre-selected asset from Transfer page
 * @param {Function} onAddressAdded - Callback when address is successfully added
 */
let AddressBookModal = ({ visible, onClose, onAddressAdded, selectedAsset }) => {
  
  // Handle successful address addition
  let handleSuccess = (addressData) => {
    log('✅ Address added successfully from modal:', addressData);
    
    // Call the callback
    if (onAddressAdded) {
      onAddressAdded(addressData);
    }
    
    // Close the modal after a short delay
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 1500);
  };

  // Handle cancel
  let handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Header with close button */}
        <View style={styles.modalHeader}>
          <IconButton
            icon="close"
            size={24}
            onPress={onClose}
            style={styles.closeButton}
          />
        </View>

        {/* Address Book Form */}
        <View style={styles.formContainer}>
          <AddressBookForm
            selectedAsset={selectedAsset}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            showHeader={true}
            standalone={false}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: scaledWidth(10),
    paddingTop: scaledHeight(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  closeButton: {
    margin: 0,
  },
  formContainer: {
    flex: 1,
  },
});

export default AddressBookModal;
