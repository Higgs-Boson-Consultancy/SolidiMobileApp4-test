// React imports
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Material Design imports
import {
  Card,
  Text,
  useTheme,
  Button,
  IconButton,
  Divider,
  Chip
} from 'react-native-paper';

// Internal imports
import AppStateContext from 'src/application/data';
import { colors, sharedStyles, sharedColors } from 'src/constants';
import { scaledWidth, scaledHeight, normaliseFont } from 'src/util/dimensions';
import { Title } from 'src/components/shared';
import { PriceGraph } from 'src/components/atomic';
import misc from 'src/util/misc';

// Logger
import logger from 'src/util/logger';
let logger2 = logger.extend('CryptoContent');
let {deb, dj, log, lj} = logger.getShortcuts(logger2);

let CryptoContent = () => {
  let appState = useContext(AppStateContext);
  const materialTheme = useTheme();
  let [renderCount, triggerRender] = useState(0);
  let stateChangeID = appState.stateChangeID;

  // Get crypto data from app state (passed when navigating)
  const cryptoData = appState.selectedCrypto || {};
  const {
    asset = 'BTC',
    name = 'Bitcoin',
    symbol = 'BTC',
    balance = '0.15420000',
    currentPrice = 45000,
    priceChange = 5.23,
    portfolioValue = '6939.00'
  } = cryptoData;

  // Dummy data for the page
  const marketData = {
    marketCap: '$850,234,567,890',
    volume24h: '$28,456,789,123',
    circulatingSupply: '19.8M BTC',
    totalSupply: '21M BTC',
    rank: '#1',
    high24h: currentPrice * 1.05,
    low24h: currentPrice * 0.95,
    ath: currentPrice * 1.2,
    atl: currentPrice * 0.3
  };

  const cryptoIconConfig = {
    'BTC': { name: 'bitcoin', color: '#F7931A' },
    'ETH': { name: 'ethereum', color: '#627EEA' },
    'LTC': { name: 'litecoin', color: '#BFBBBB' },
    'XRP': { name: 'currency-eth', color: '#23292F' },
    'ADA': { name: 'heart', color: '#0033AD' },
    'DOT': { name: 'circle-multiple', color: '#E6007A' },
    'LINK': { name: 'link', color: '#2A5ADA' },
    'UNI': { name: 'unicorn', color: '#FF007A' }
  };

  const goBack = () => {
    appState.setMainPanelState({
      mainPanelState: 'Assets',
      pageName: 'default'
    });
  };

  const renderHeader = () => {
    const iconConfig = cryptoIconConfig[asset] || { name: 'circle', color: '#6b7280' };
    const isPositiveChange = priceChange >= 0;

    return (
      <Card style={{ marginBottom: 16, elevation: 3 }}>
        <Card.Content style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <TouchableOpacity onPress={goBack} style={{ marginRight: 12 }}>
              <IconButton 
                icon="arrow-left" 
                iconColor={materialTheme.colors.onSurface}
                size={24}
              />
            </TouchableOpacity>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: `${iconConfig.color}20`,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16
            }}>
              <Icon
                name={iconConfig.name}
                size={28}
                color={iconConfig.color}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="headlineSmall" style={{ fontWeight: '600' }}>
                {name}
              </Text>
              <Text variant="bodyMedium" style={{ color: materialTheme.colors.onSurfaceVariant }}>
                {symbol}
              </Text>
            </View>
            <Chip mode="outlined" textStyle={{ fontSize: 12 }}>
              {marketData.rank}
            </Chip>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Text variant="displaySmall" style={{ fontWeight: '700', marginBottom: 4 }}>
              £{currentPrice.toLocaleString()}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon 
                name={isPositiveChange ? "trending-up" : "trending-down"}
                size={20}
                color={isPositiveChange ? '#4CAF50' : '#F44336'}
                style={{ marginRight: 4 }}
              />
              <Text style={{ 
                color: isPositiveChange ? '#4CAF50' : '#F44336',
                fontWeight: '600'
              }}>
                {isPositiveChange ? '+' : ''}{priceChange}%
              </Text>
              <Text style={{ color: materialTheme.colors.onSurfaceVariant, marginLeft: 8 }}>
                24h
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <Button mode="contained" onPress={() => console.log('Buy')}>
              Buy
            </Button>
            <Button mode="outlined" onPress={() => console.log('Sell')}>
              Sell
            </Button>
            <Button mode="outlined" onPress={() => console.log('Send')}>
              Send
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderPortfolio = () => (
    <Card style={{ marginBottom: 16, elevation: 2 }}>
      <Card.Content style={{ padding: 20 }}>
        <Text variant="titleMedium" style={{ fontWeight: '600', marginBottom: 16 }}>
          Your Holdings
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text variant="bodyMedium" style={{ color: materialTheme.colors.onSurfaceVariant }}>
            Balance
          </Text>
          <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
            {balance} {symbol}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text variant="bodyMedium" style={{ color: materialTheme.colors.onSurfaceVariant }}>
            Portfolio Value
          </Text>
          <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
            £{portfolioValue}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  const renderMarketStats = () => (
    <Card style={{ marginBottom: 16, elevation: 2 }}>
      <Card.Content style={{ padding: 20 }}>
        <Text variant="titleMedium" style={{ fontWeight: '600', marginBottom: 16 }}>
          Market Statistics
        </Text>
        
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text variant="bodyMedium" style={{ color: materialTheme.colors.onSurfaceVariant }}>
              Market Cap
            </Text>
            <Text variant="bodyMedium" style={{ fontWeight: '500' }}>
              {marketData.marketCap}
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text variant="bodyMedium" style={{ color: materialTheme.colors.onSurfaceVariant }}>
              24h Volume
            </Text>
            <Text variant="bodyMedium" style={{ fontWeight: '500' }}>
              {marketData.volume24h}
            </Text>
          </View>

          <Divider style={{ marginVertical: 8 }} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text variant="bodyMedium" style={{ color: materialTheme.colors.onSurfaceVariant }}>
              24h High
            </Text>
            <Text variant="bodyMedium" style={{ fontWeight: '500' }}>
              £{marketData.high24h.toLocaleString()}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text variant="bodyMedium" style={{ color: materialTheme.colors.onSurfaceVariant }}>
              24h Low
            </Text>
            <Text variant="bodyMedium" style={{ fontWeight: '500' }}>
              £{marketData.low24h.toLocaleString()}
            </Text>
          </View>

          <Divider style={{ marginVertical: 8 }} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text variant="bodyMedium" style={{ color: materialTheme.colors.onSurfaceVariant }}>
              Circulating Supply
            </Text>
            <Text variant="bodyMedium" style={{ fontWeight: '500' }}>
              {marketData.circulatingSupply}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text variant="bodyMedium" style={{ color: materialTheme.colors.onSurfaceVariant }}>
              Total Supply
            </Text>
            <Text variant="bodyMedium" style={{ fontWeight: '500' }}>
              {marketData.totalSupply}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderPriceGraph = () => (
    <View style={{ marginBottom: 16 }}>
      <Text variant="titleMedium" style={{ 
        fontWeight: '600', 
        marginBottom: 8,
        marginLeft: 8,
        color: materialTheme.colors.onSurface 
      }}>
        Price Chart
      </Text>
      <PriceGraph 
        assetBA={asset}
        assetQA="GBP"
        historic_prices={appState.apiData?.historic_prices || {}}
      />
    </View>
  );

  const renderAbout = () => (
    <Card style={{ marginBottom: 16, elevation: 2 }}>
      <Card.Content style={{ padding: 20 }}>
        <Text variant="titleMedium" style={{ fontWeight: '600', marginBottom: 16 }}>
          About {name}
        </Text>
        <Text variant="bodyMedium" style={{ 
          lineHeight: 22, 
          color: materialTheme.colors.onSurfaceVariant 
        }}>
          {asset === 'BTC' ? 
            "Bitcoin is the world's first cryptocurrency, created in 2009 by an unknown person or group using the pseudonym Satoshi Nakamoto. It operates on a decentralized peer-to-peer network without the need for a central authority or government. Bitcoin transactions are verified by network nodes through cryptography and recorded in a public distributed ledger called a blockchain." :
            `${name} is a digital cryptocurrency that operates on blockchain technology. It enables secure, decentralized transactions and has gained significant adoption in the cryptocurrency ecosystem.`
          }
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={{ flex: 1, backgroundColor: materialTheme.colors.background }}>
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderPriceGraph()}
        {renderPortfolio()}
        {renderMarketStats()}
        {renderAbout()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CryptoContent;