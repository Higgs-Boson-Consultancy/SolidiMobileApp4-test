import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Alert,
  Linking
} from 'react-native';
import Contacts from 'react-native-contacts';
import { colors } from 'src/constants';
import { scaledWidth, scaledHeight, normaliseFont } from 'src/util/dimensions';

const ContactPickerModal = ({ visible, onSelect, onCancel }) => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  console.log('📱 ContactPickerModal render - filteredContacts:', filteredContacts);

  useEffect(() => {
    if (visible) {
      loadContacts();
    }
  }, [visible]);

  useEffect(() => {
    console.log('📱 ContactPickerModal useEffect - searchQuery:', searchQuery, 'contacts:', contacts);
    
    if (!Array.isArray(contacts)) {
      console.log('📱 ContactPickerModal useEffect - contacts is not an array, setting empty array');
      setFilteredContacts([]);
      return;
    }
    
    if (searchQuery.trim() === '') {
      console.log('📱 ContactPickerModal useEffect - no search query, setting all contacts');
      setFilteredContacts(contacts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = contacts.filter(contact => {
        if (!contact) return false;
        const fullName = `${contact.givenName || ''} ${contact.familyName || ''}`.toLowerCase();
        return fullName.includes(query);
      });
      console.log('📱 ContactPickerModal useEffect - filtered:', filtered.length, 'contacts');
      setFilteredContacts(filtered);
    }
  }, [searchQuery, contacts]);

  const loadContacts = async () => {
    try {
      console.log('📱 ContactPickerModal: Starting to load contacts');
      setLoading(true);

      // Check/request permission
      let permissionStatus;
      console.log('📱 ContactPickerModal: Platform is', Platform.OS);
      
      if (Platform.OS === 'android') {
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts Permission',
            message: 'This app needs access to your contacts to help you select recipients.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          }
        );
        permissionStatus = permission === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const status = await Contacts.checkPermission();
        if (status === 'undefined') {
          permissionStatus = (await Contacts.requestPermission()) === 'authorized';
        } else {
          permissionStatus = status === 'authorized';
        }
      }
      
      if (!permissionStatus) {
        Alert.alert(
          'Permission Denied',
          'Contact access is required to select recipients. Please go to Settings > Privacy & Security > Contacts and enable access for this app.',
          [
            { text: 'Cancel', onPress: onCancel, style: 'cancel' },
            { 
              text: 'Open Settings', 
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                }
                onCancel();
              }
            }
          ]
        );
        return;
      }

      // Load contacts
      console.log('📱 ContactPickerModal: Permission granted, fetching contacts');
      const allContacts = await Contacts.getAll();
      console.log('📱 ContactPickerModal: Fetched', allContacts.length, 'contacts');
      
      // Log first contact structure for debugging
      if (allContacts.length > 0) {
        console.log('📱 ContactPickerModal: First raw contact:', JSON.stringify(allContacts[0]));
      }
      
      // Filter and validate contacts with strict checks
      const validContacts = allContacts
        .filter(c => {
          // Ensure contact object is valid
          if (!c || typeof c !== 'object') return false;
          if (!c.givenName || typeof c.givenName !== 'string') return false;
          if (!c.familyName || typeof c.familyName !== 'string') return false;
          if (!c.recordID) return false;
          return true;
        })
        .sort((a, b) => {
          const aName = `${a.givenName} ${a.familyName}`.toLowerCase();
          const bName = `${b.givenName} ${b.familyName}`.toLowerCase();
          return aName.localeCompare(bName);
        });

      console.log('📱 ContactPickerModal: Valid contacts count:', validContacts.length);
      
      // Log first valid contact
      if (validContacts.length > 0) {
        console.log('📱 ContactPickerModal: First valid contact:', JSON.stringify(validContacts[0]));
      }
      
      // Always set state, even if empty
      setContacts(validContacts || []);
      setFilteredContacts(validContacts || []);
      
      if (validContacts.length === 0) {
        console.log('📱 ContactPickerModal: No valid contacts found');
        setLoading(false);
        Alert.alert(
          'No Valid Contacts',
          'No contacts with both first and last names found.',
          [{ text: 'OK', onPress: onCancel }]
        );
        return;
      }
      
      console.log('📱 ContactPickerModal: Contacts loaded successfully');
    } catch (error) {
      console.error('📱 ERROR in ContactPickerModal loadContacts:', error);
      console.error('📱 ERROR stack:', error.stack);
      
      // Set empty array on error
      setContacts([]);
      setFilteredContacts([]);
      setLoading(false);
      
      Alert.alert(
        'Error',
        'Could not load contacts. Please try again.',
        [{ text: 'OK', onPress: onCancel }]
      );
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleSelectContact = (contact) => {
    onSelect({
      firstName: contact.givenName,
      lastName: contact.familyName
    });
  };

  const renderContactItem = ({ item }) => {
    // Defensive check - return empty View if item is invalid
    if (!item || !item.givenName || !item.familyName) {
      return <View style={{ height: 0 }} />;
    }
    
    return (
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => handleSelectContact(item)}
      >
        <View style={styles.contactAvatar}>
          <Text style={styles.contactInitial}>
            {item.givenName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>
            {item.givenName || ''} {item.familyName || ''}
          </Text>
          {item.phoneNumbers && item.phoneNumbers.length > 0 && (
            <Text style={styles.contactPhone}>
              {item.phoneNumbers[0].number}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onCancel}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Contact</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        {/* Contact List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading contacts...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.countText}>
              {Array.isArray(filteredContacts) ? filteredContacts.length : 0} contact{Array.isArray(filteredContacts) && filteredContacts.length !== 1 ? 's' : ''}
              {searchQuery ? ' found' : ''}
            </Text>
            {Array.isArray(filteredContacts) && filteredContacts.length > 0 ? (
              <ScrollView style={styles.list}>
                {filteredContacts.map((item, index) => {
                  if (!item || !item.givenName || !item.familyName) return null;
                  
                  const key = item.recordID ? String(item.recordID) : `contact-${index}`;
                  
                  return (
                    <TouchableOpacity
                      key={key}
                      style={styles.contactItem}
                      onPress={() => handleSelectContact(item)}
                    >
                      <View style={styles.contactAvatar}>
                        <Text style={styles.contactInitial}>
                          {item.givenName.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.contactInfo}>
                        <Text style={styles.contactName}>
                          {item.givenName} {item.familyName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchQuery ? 'No contacts found matching your search' : 'No contacts available'}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? scaledHeight(50) : scaledHeight(20),
    paddingBottom: scaledHeight(15),
    paddingHorizontal: scaledWidth(20),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  cancelButton: {
    paddingVertical: scaledHeight(5),
    paddingHorizontal: scaledWidth(10),
    minWidth: scaledWidth(70),
  },
  cancelText: {
    fontSize: normaliseFont(16),
    color: colors.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: normaliseFont(18),
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    minWidth: scaledWidth(70),
  },
  searchContainer: {
    paddingHorizontal: scaledWidth(20),
    paddingVertical: scaledHeight(15),
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: scaledWidth(15),
    paddingVertical: scaledHeight(12),
    fontSize: normaliseFont(16),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  countText: {
    paddingHorizontal: scaledWidth(20),
    paddingVertical: scaledHeight(10),
    fontSize: normaliseFont(14),
    color: '#666',
    backgroundColor: '#f9f9f9',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: scaledHeight(20),
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scaledHeight(12),
    paddingHorizontal: scaledWidth(20),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  contactAvatar: {
    width: scaledWidth(45),
    height: scaledWidth(45),
    borderRadius: scaledWidth(22.5),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scaledWidth(15),
  },
  contactInitial: {
    fontSize: normaliseFont(20),
    fontWeight: 'bold',
    color: '#fff',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: normaliseFont(16),
    fontWeight: '600',
    color: '#333',
    marginBottom: scaledHeight(3),
  },
  contactPhone: {
    fontSize: normaliseFont(14),
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scaledHeight(50),
  },
  loadingText: {
    marginTop: scaledHeight(15),
    fontSize: normaliseFont(16),
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scaledHeight(50),
    paddingHorizontal: scaledWidth(40),
  },
  emptyText: {
    fontSize: normaliseFont(16),
    color: '#999',
    textAlign: 'center',
  },
});

export default ContactPickerModal;
