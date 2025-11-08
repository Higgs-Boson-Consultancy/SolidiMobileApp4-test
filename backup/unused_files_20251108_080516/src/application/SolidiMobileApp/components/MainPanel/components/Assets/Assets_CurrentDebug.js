import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AppStateContext from 'src/application/data';

const Assets = () => {
  console.log('🔍 Assets component starting to render...');
  
  let appState;
  try {
    appState = useContext(AppStateContext);
    console.log('🔍 AppState context loaded:', !!appState);
  } catch (error) {
    console.log('❌ Error getting AppState context:', error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'red', fontSize: 16, textAlign: 'center' }}>
          Error loading app context
        </Text>
      </View>
    );
  }
  
  if (!appState) {
    console.log('⚠️ AppState is null/undefined');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#666' }}>Loading app state...</Text>
      </View>
    );
  }
  
  console.log('🔍 Checking authentication...');
  
  let isAuthenticated;
  try {
    isAuthenticated = appState.user?.isAuthenticated;
    console.log('🔍 Authentication status:', isAuthenticated);
    console.log('🔍 Full user object:', appState.user);
  } catch (error) {
    console.log('❌ Error checking authentication:', error);
    isAuthenticated = false;
  }
  
  if (!isAuthenticated) {
    console.log('🔐 User not authenticated, showing login prompt');
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
      }}>
        <View style={{
          backgroundColor: '#FF6B6B',
          paddingVertical: 20,
          paddingHorizontal: 30,
          borderRadius: 12,
          marginBottom: 30,
        }}>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: 'bold', 
            color: 'white',
            textAlign: 'center',
            marginBottom: 10
          }}>
            🔒 Please Login First
          </Text>
          <Text style={{ 
            fontSize: 16, 
            color: 'white',
            textAlign: 'center'
          }}>
            Authentication required to view assets
          </Text>
        </View>
        
        <TouchableOpacity 
          style={{
            backgroundColor: '#007AFF',
            paddingHorizontal: 30,
            paddingVertical: 15,
            borderRadius: 8,
          }}
          onPress={() => {
            try {
              console.log('🔐 Attempting to redirect to login...');
              appState.setMainPanelState('Login');
            } catch (error) {
              console.log('❌ Error redirecting to login:', error);
              alert('Please navigate to login manually');
            }
          }}
        >
          <Text style={{ 
            color: 'white', 
            fontWeight: 'bold', 
            fontSize: 16,
            textAlign: 'center' 
          }}>
            Go to Login
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  console.log('✅ User authenticated, showing assets page');
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20
    }}>
      <Text style={{ 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#000',
        marginBottom: 20,
        textAlign: 'center'
      }}>
        ✅ Assets Page
      </Text>
      
      <Text style={{ 
        fontSize: 16, 
        color: '#666',
        textAlign: 'center'
      }}>
        You are authenticated!{'\n'}Assets functionality would go here.
      </Text>
    </View>
  );
};

export default Assets;