// Super minimal Assets component for debugging
import React, { useContext, useState } from 'react';
import { FlatList, View, Text } from 'react-native';
import AppStateContext from 'src/application/data';

const Assets = () => {
  const appState = useContext(AppStateContext);
  
  // Super simple hardcoded data
  const testData = [
    { id: '1', name: 'Bitcoin', amount: '0.05' },
    { id: '2', name: 'Ethereum', amount: '2.5' },
    { id: '3', name: 'GBP', amount: '1000' },
  ];

  const renderItem = ({ item }) => (
    <View style={{ padding: 20, borderBottomWidth: 1, borderColor: '#eee' }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
      <Text style={{ fontSize: 14, color: '#666' }}>{item.amount}</Text>
    </View>
  );

  console.log('📱 Assets: Rendering with test data:', testData);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 20, backgroundColor: '#f0f0f0' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Assets Test</Text>
      </View>
      
      <FlatList
        data={testData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default Assets;