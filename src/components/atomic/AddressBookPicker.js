// React imports
import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Text, HelperText } from 'react-native-paper';

// Internal imports
import { colors } from 'src/constants';
import { scaledWidth, scaledHeight, normaliseFont } from 'src/util/dimensions';
import AppStateContext from 'src/application/data';

let AddressBookPicker = ({ 
  selectedAsset = 'BTC', 
  onAddressSelect, 
  label = "Select from Address Book",
  placeholder = "Choose a saved address..."
}) => {
  console.log('🏠 AddressBookPicker: ===== COMPONENT MOUNTING =====');
  console.log('🏠 AddressBookPicker: Component rendering with selectedAsset:', selectedAsset);
  console.log('🏠 AddressBookPicker: Props received:', { selectedAsset, label, placeholder });
  
  // Get app state for API access
  let appState = useContext(AppStateContext);
  console.log('🏠 AddressBookPicker: AppState from context:', !!appState);
  console.log('🏠 AddressBookPicker: AppState object:', appState ? 'exists' : 'null');
  
  // Component state
  let [open, setOpen] = useState(false);
  let [value, setValue] = useState(null);
  let [items, setItems] = useState([]);
  let [addresses, setAddresses] = useState([]);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(null);

  // Function to load addresses from API
  let loadAddressesFromAPI = async (asset) => {
    console.log('🏠 AddressBookPicker: ===== loadAddressesFromAPI CALLED =====');
    console.log('🏠 AddressBookPicker: loadAddressesFromAPI called with asset:', asset);
    console.log('🏠 AddressBookPicker: Checking prerequisites...');
    
    if (!appState) {
      console.warn('🏠 AddressBookPicker: ❌ EARLY EXIT - No appState available');
      console.log('🏠 AddressBookPicker: appState is:', appState);
      setError('App state not available');
      return [];
    }
    console.log('🏠 AddressBookPicker: ✅ AppState check passed');

    if (!appState.state) {
      console.warn('🏠 AddressBookPicker: ❌ EARLY EXIT - No appState.state available');
      console.log('🏠 AddressBookPicker: appState.state is:', appState.state);
      setError('App state.state not available');
      return [];
    }
    console.log('🏠 AddressBookPicker: ✅ AppState.state check passed');

    if (!appState.state.apiClient) {
      console.warn('🏠 AddressBookPicker: ❌ EARLY EXIT - No API client available');
      console.log('🏠 AddressBookPicker: appState.state.apiClient is:', appState.state.apiClient);
      setError('API client not available');
      return [];
    }
    console.log('🏠 AddressBookPicker: ✅ API client check passed');
    console.log('🏠 AddressBookPicker: All prerequisites met, proceeding with API call...');

    try {
      setLoading(true);
      setError(null);
      console.log('🏠 AddressBookPicker: Loading addresses for asset:', asset);
      console.log('🏠 AddressBookPicker: API endpoint:', `addressBook/${asset}`);
      
      // Call the address book API
      let result = await appState.state.apiClient.privateMethod({
        httpMethod: 'GET',
        apiRoute: `addressBook/${asset}`,
        params: {}
      });
      
      console.log('🏠 AddressBookPicker: ===== ADDRESS BOOK API RESPONSE START =====');
      console.log('🏠 AddressBookPicker: Raw API Response:', result);
      console.log('🏠 AddressBookPicker: Response Type:', typeof result);
      console.log('🏠 AddressBookPicker: Response Keys:', result ? Object.keys(result) : 'null');
      
      if (result) {
        console.log('🏠 AddressBookPicker: Response Success:', result.success);
        console.log('🏠 AddressBookPicker: Response Data:', result.data);
        console.log('🏠 AddressBookPicker: Response Error:', result.error);
        console.log('🏠 AddressBookPicker: Response Status:', result.status);
        console.log('🏠 AddressBookPicker: Response Message:', result.message);
        
        if (result.data) {
          console.log('🏠 AddressBookPicker: Data Type:', typeof result.data);
          console.log('🏠 AddressBookPicker: Data Keys:', Object.keys(result.data));
          console.log('🏠 AddressBookPicker: Addresses Array:', result.data.addresses);
          console.log('🏠 AddressBookPicker: Addresses Count:', Array.isArray(result.data.addresses) ? result.data.addresses.length : 'Not an array');
          
          if (Array.isArray(result.data.addresses)) {
            result.data.addresses.forEach((addr, index) => {
              console.log(`🏠 AddressBookPicker: Address ${index + 1}:`, addr);
            });
          }
        }
      }
      console.log('🏠 AddressBookPicker: ===== ADDRESS BOOK API RESPONSE END =====');
      
      // Transform API result to our format
      let transformedAddresses = [];
      if (result && result.data && Array.isArray(result.data.addresses)) {
        transformedAddresses = result.data.addresses.map((addr, index) => ({
          id: `${asset.toLowerCase()}_${index}`,
          label: addr.label || `${asset} Address ${index + 1}`,
          address: addr.address,
          description: addr.description || `Saved ${asset} address`
        }));
        console.log('🏠 AddressBookPicker: Successfully transformed', transformedAddresses.length, 'addresses');
      } else {
        console.log('🏠 AddressBookPicker: No addresses found in API response');
        if (result && !result.data) {
          console.log('🏠 AddressBookPicker: No data field in response');
        }
        if (result && result.data && !Array.isArray(result.data.addresses)) {
          console.log('🏠 AddressBookPicker: Addresses field is not an array:', typeof result.data.addresses);
        }
      }
      
      console.log('🏠 AddressBookPicker: Final transformed addresses:', transformedAddresses);
      return transformedAddresses;
      
    } catch (error) {
      console.error('🏠 AddressBookPicker: Error loading addresses:', error);
      setError(`Failed to load ${selectedAsset} addresses`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Load addresses when selectedAsset changes
  useEffect(() => {
    console.log('🏠 AddressBookPicker: ===== TRANSFER PAGE RENDER TRIGGER =====');
    console.log('🏠 AddressBookPicker: useEffect triggered for asset:', selectedAsset);
    console.log('🏠 AddressBookPicker: AppState available:', !!appState);
    console.log('🏠 AddressBookPicker: API Client available:', !!(appState?.state?.apiClient));
    
    // Force load addresses regardless of state
    console.log('🏠 AddressBookPicker: About to load address book data from API...');
    
    let loadAddresses = async () => {
      console.log('🏠 AddressBookPicker: Starting address book API call for', selectedAsset);
      let addressesForAsset = await loadAddressesFromAPI(selectedAsset);
      console.log('🏠 AddressBookPicker: Address book API call completed for', selectedAsset);
      console.log('🏠 AddressBookPicker: Setting addresses state with', addressesForAsset.length, 'addresses');
      setAddresses(addressesForAsset);
      console.log('🏠 AddressBookPicker: Addresses state updated for Transfer page');
    };
    
    loadAddresses();
    console.log('🏠 AddressBookPicker: ===== TRANSFER PAGE RENDER TRIGGER END =====');
  }, [selectedAsset]); // Remove appState dependency to ensure it always runs

  // Force initial load on mount regardless of appState
  useEffect(() => {
    console.log('🏠 AddressBookPicker: ===== COMPONENT MOUNTED - FORCING INITIAL LOAD =====');
    console.log('🏠 AddressBookPicker: Component mounted with selectedAsset:', selectedAsset);
    console.log('🏠 AddressBookPicker: Forcing initial BTC address book load...');
    
    // Add a small delay to ensure appState is available
    const timer = setTimeout(() => {
      console.log('🏠 AddressBookPicker: Timer triggered - loading initial addresses');
      loadAddressesFromAPI(selectedAsset).then(addressesForAsset => {
        console.log('🏠 AddressBookPicker: Initial load completed with', addressesForAsset.length, 'addresses');
        setAddresses(addressesForAsset);
      });
    }, 100);
    
    return () => {
      console.log('🏠 AddressBookPicker: Component unmounting');
      clearTimeout(timer);
    };
  }, []); // Only run on mount

  // Get addresses for the selected asset with error handling
  let addressesForAsset = addresses;
  
  // Convert to dropdown format with safe array handling
  let dropdownItems = [];
  try {
    // Ensure we have a valid array of addresses
    const safeAddresses = Array.isArray(addressesForAsset) ? addressesForAsset.filter(addr => 
      addr && 
      typeof addr.label === 'string' && 
      typeof addr.address === 'string' && 
      addr.label.length > 0 && 
      addr.address.length > 0
    ) : [];
    
    // Always start with a consistent base structure
    dropdownItems = [];
    
    // Add placeholder item
    dropdownItems.push({
      label: safeAddresses.length > 0 ? placeholder : "No saved addresses available",
      value: null,
      disabled: true,
      key: 'placeholder_item'
    });
    
    // Add address items with guaranteed unique keys
    safeAddresses.forEach((addr, index) => {
      dropdownItems.push({
        label: `${addr.label} (${addr.address.substring(0, 8)}...)`,
        value: addr.address,
        key: `addr_${selectedAsset}_${index}_${addr.address.substring(0, 8)}`,
        description: addr.description || ''
      });
    });
    
  } catch (error) {
    console.error('🏠 AddressBookPicker: Error creating dropdown items:', error);
    dropdownItems = [
      {
        label: "Error loading addresses",
        value: null,
        disabled: true,
        key: 'error_fallback'
      }
    ];
  }
  
  console.log('🏠 AddressBookPicker: Dropdown items created:', dropdownItems.length, 'items');

  // Update the items state when dropdownItems change
  useEffect(() => {
    try {
      console.log('🏠 AddressBookPicker: Updating items state with', dropdownItems.length, 'items');
      setItems(dropdownItems);
    } catch (error) {
      console.error('🏠 AddressBookPicker: Error updating items state:', error);
      setItems([{label: "Error", value: null, disabled: true, key: 'error'}]);
    }
  }, [selectedAsset, addressesForAsset.length]);

  let handleValueChange = (selectedValue) => {
    try {
      console.log('🏠 AddressBookPicker: Value changed to:', selectedValue);
      setValue(selectedValue);
      if (selectedValue && onAddressSelect) {
        // Find the full address details
        let selectedAddress = addressesForAsset.find(addr => addr.address === selectedValue);
        console.log('🏠 AddressBookPicker: Selected address details:', selectedAddress);
        onAddressSelect(selectedValue, selectedAddress);
      }
    } catch (error) {
      console.error('🏠 AddressBookPicker: Error in handleValueChange:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={{color: '#ff0000', fontSize: 12}}>DEBUG: AddressBookPicker component loaded</Text>
      <Text style={{color: '#0000ff', fontSize: 12}}>Asset: {selectedAsset}, Addresses: {addressesForAsset.length}</Text>
      <Text style={{color: '#008000', fontSize: 12}}>Items in dropdown: {items.length}</Text>
      <Text style={{color: '#800080', fontSize: 12}}>Loading: {loading ? 'true' : 'false'}, Error: {error || 'none'}</Text>
      
      {loading && (
        <View style={[styles.dropdown, {justifyContent: 'center', alignItems: 'center'}]}>
          <Text style={{color: '#666666', fontSize: 14}}>Loading addresses...</Text>
        </View>
      )}
      
      {error && !loading && (
        <View style={[styles.dropdown, {justifyContent: 'center', alignItems: 'center'}]}>
          <Text style={{color: '#cc0000', fontSize: 14}}>{error}</Text>
        </View>
      )}
      
      {!loading && !error && items.length > 0 ? (
        <View style={{zIndex: 3000, elevation: 3000}}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            onChangeValue={handleValueChange}
            placeholder={addressesForAsset.length > 0 ? placeholder : "No addresses available"}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            textStyle={styles.dropdownText}
            placeholderStyle={styles.placeholderText}
            disabled={addressesForAsset.length === 0}
            zIndex={3000}
            zIndexInverse={1000}
            listMode="SCROLLVIEW"
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
          />
        </View>
      ) : !loading && !error && (
        <View style={[styles.dropdown, {justifyContent: 'center', alignItems: 'center'}]}>
          <Text style={{color: '#666666', fontSize: 14}}>No dropdown items available</Text>
        </View>
      )}
      
      {addressesForAsset.length === 0 && !loading && !error && (
        <HelperText type="info" visible={true} style={styles.helperText}>
          No saved addresses for {selectedAsset}
        </HelperText>
      )}
      
      {addressesForAsset.length > 0 && !loading && (
        <HelperText type="info" visible={true} style={styles.helperText}>
          {addressesForAsset.length} saved address{addressesForAsset.length > 1 ? 'es' : ''} available
        </HelperText>
      )}
      
      {loading && (
        <HelperText type="info" visible={true} style={styles.helperText}>
          Loading {selectedAsset} addresses...
        </HelperText>
      )}
      
      {error && (
        <HelperText type="error" visible={true} style={styles.helperText}>
          {error}
        </HelperText>
      )}
    </View>
  );
};

let styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    zIndex: 3000,
    backgroundColor: '#f0f0f0', // Temporary debug background
    padding: 8,
    borderRadius: 4
  },
  label: {
    fontSize: normaliseFont(14),
    fontWeight: '600',
    color: '#000', // Temporary solid color
    marginBottom: 8
  },
  dropdown: {
    backgroundColor: '#ffffff', // Temporary solid white
    borderColor: '#cccccc', // Temporary solid border
    borderWidth: 2, // Make border more visible
    borderRadius: 4,
    minHeight: 48
  },
  dropdownContainer: {
    backgroundColor: '#ffffff', // Temporary solid white
    borderColor: '#cccccc', // Temporary solid border
    borderWidth: 2, // Make border more visible
    borderRadius: 4,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  dropdownText: {
    fontSize: normaliseFont(14),
    color: '#000' // Temporary solid color
  },
  placeholderText: {
    fontSize: normaliseFont(14),
    color: '#666666' // Temporary solid color
  },
  helperText: {
    fontSize: normaliseFont(12),
    marginTop: 4
  }
});

export default AddressBookPicker;