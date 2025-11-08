// React imports
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Platform, ScrollView } from 'react-native';
import { TouchableNativeFeedback, TouchableOpacity } from 'react-native';

// Material Design imports
import {
  Card,
  Text,
  useTheme,
  SegmentedButtons,
  Avatar,
  Chip,
  Button,
  Surface,
} from 'react-native-paper';

// Other imports
import _ from 'lodash';
import Big from 'big.js';

// Internal imports
import AppStateContext from 'src/application/data';
import { colors } from 'src/constants';
import { Spinner } from 'src/components/atomic';
import { Title } from 'src/components/shared';
import { scaledWidth, scaledHeight, normaliseFont } from 'src/util/dimensions';
import misc from 'src/util/misc';
import HistoryDataModel, { TransactionDataModel, OrderDataModel } from './HistoryDataModel';

// Logger
import logger from 'src/util/logger';
let logger2 = logger.extend('History');
let {deb, dj, log, lj} = logger.getShortcuts(logger2);


let Touchable = Platform.select({
  ios: TouchableOpacity,
  android: TouchableNativeFeedback,
  // Note: TouchableNativeFeedback expects exactly 1 child element e.g. <View/>
});




let History = () => {

  let appState = useContext(AppStateContext);
  let [renderCount, triggerRender] = useState(0);
  let stateChangeID = appState.stateChangeID;
  let [isLoading, setIsLoading] = useState(true);
  let [historyDataModel, setHistoryDataModel] = useState(new HistoryDataModel());
  let [selectedHistoryCategory, setSelectedHistoryCategory] = useState('Transactions');
  let [transactionsData, setTransactionsData] = useState([]);  // Add state for transaction data


  // Check pageName to see if a category has been specified as this panel is loaded.
  let selectedCategory = 'orders'; // default value.
  let categories = 'orders transactions'.split(' ');
  let pageName = appState.pageName;
  if (pageName !== 'default') {
    if (! categories.includes(pageName)) {
      throw Error(`Unrecognised category: ${pageName}`);
    }
    selectedCategory = pageName;
  }


  // Dropdown state: Category
  let [open, setOpen] = useState(false);
  let [category, setCategory] = useState(selectedCategory);
  let [categoryItems, setCategoryItems] = useState([
    {label: 'Orders', value: 'orders'},
    {label: 'All Transactions', value: 'transactions'},
  ]);


  // Initial setup.
  useEffect(() => {
    setup();
  }, []); // Pass empty array so that this only runs once on mount.


  const setup = async () => {
    console.log('[HISTORY] Setup - loading transaction history and orders');
    
    try {
      // Check if API client is available
      if (!appState.apiClient) {
        console.log('[HISTORY] ❌ API client not available yet');
        setIsLoading(false);
        return;
      }
      
      // Create data model
      const dataModel = new HistoryDataModel();
      
      // Load transactions from API
      console.log('[HISTORY] � REQUEST: /transaction');
      console.log('[HISTORY] 📤 REQUEST PARAMS:', {
        apiRoute: 'transaction',
        functionName: 'History.setup.transactions'
      });
      
      let transactionResponse = await appState.privateMethod({
        apiRoute: 'transaction',
        functionName: 'History.setup.transactions'
      });
      
      console.log('[HISTORY] 📥 RESPONSE: /transaction');
      console.log('[HISTORY] 📥 RESPONSE TYPE:', typeof transactionResponse);
      console.log('[HISTORY] 📥 RESPONSE DATA:', transactionResponse);
      
      if (transactionResponse && !transactionResponse.error) {
        const loadedTransactions = dataModel.loadTransactions(transactionResponse);
        console.log(`[HISTORY] ✅ Transactions loaded - Count: ${loadedTransactions.length}`);
        
        // Analyze transaction types to help identify bank transfer orders
        const buyTransactions = loadedTransactions.filter(t => t.code === 'BY');
        const sellTransactions = loadedTransactions.filter(t => t.code === 'SL');
        const pendingTransactions = loadedTransactions.filter(t => t.status && t.status.toLowerCase().includes('pending'));
        
        console.log(`[HISTORY] 📊 Transaction breakdown:`);
        console.log(`[HISTORY] 📊   - BUY (BY): ${buyTransactions.length}`);
        console.log(`[HISTORY] 📊   - SELL (SL): ${sellTransactions.length}`);
        console.log(`[HISTORY] 📊   - PENDING status: ${pendingTransactions.length}`);
        
        if (pendingTransactions.length > 0) {
          console.log(`[HISTORY] 💡 Found ${pendingTransactions.length} pending transactions - these might be bank transfer orders!`);
          console.log(`[HISTORY] 💡 Pending transactions:`, pendingTransactions);
        }
      } else {
        console.log('[HISTORY] ⚠️ Error loading transactions:', transactionResponse?.error);
      }
      
      // Load orders from API
      console.log('[HISTORY] � REQUEST: /open_orders');
      console.log('[HISTORY] 📤 REQUEST PARAMS:', {
        apiRoute: 'open_orders',
        functionName: 'History.setup.orders'
      });
      
      let orderResponse = await appState.privateMethod({
        apiRoute: 'open_orders',
        functionName: 'History.setup.orders'
      });
      
      console.log('[HISTORY] 📥 RESPONSE: /open_orders');
      console.log('[HISTORY] 📥 RESPONSE TYPE:', typeof orderResponse);
      console.log('[HISTORY] 📥 RESPONSE DATA:', orderResponse);
      
      if (orderResponse && !orderResponse.error) {
        const loadedOrders = dataModel.loadOrders(orderResponse);
        console.log(`[HISTORY] ✅ Orders loaded - Count: ${loadedOrders.length}`);
      } else {
        console.log('[HISTORY] ⚠️ Error loading orders:', orderResponse?.error);
      }
      
      // Bank transfer orders appear in either /transaction or /open_orders
      // No separate settlement endpoint needed
      console.log('[HISTORY] 💡 Bank transfer orders are included in /transaction (pending) or /open_orders');
      
      setHistoryDataModel(dataModel);
      console.log('[HISTORY] ✅ History data loaded successfully');
      
      // Log final summary
      console.log('[HISTORY] 📊 FINAL SUMMARY:');
      console.log('[HISTORY] 📊 Total transactions:', dataModel.getTransactions()?.length || 0);
      console.log('[HISTORY] 📊 Total orders:', dataModel.getOrders()?.length || 0);
      console.log('[HISTORY] 📊 Transactions list:', dataModel.getTransactions());
      console.log('[HISTORY] 📊 Orders list:', dataModel.getOrders());
      
      setIsLoading(false);
    } catch (error) {
      console.log('[HISTORY] ❌ Exception loading transaction history:', error);
      setIsLoading(false);
    }
  }


  let displayHistoryControls = () => {
    // Get data counts
    const transactions = historyDataModel?.getTransactions() || [];
    const orders = historyDataModel?.getOrders() || [];
    
    // Analyze transaction types
    const buyTransactions = transactions.filter(t => t.code === 'BY');
    const sellTransactions = transactions.filter(t => t.code === 'SL');
    const pendingTransactions = transactions.filter(t => t.status && t.status.toLowerCase().includes('pending'));
    
    return (
      <View>
        {/* Main Controls */}
        <Card style={{ marginBottom: 16, elevation: 2 }}>
          <Card.Content>
            <SegmentedButtons
              value={selectedHistoryCategory}
              onValueChange={setSelectedHistoryCategory}
              buttons={[
                {
                  value: 'Transactions',
                  label: 'Transactions',
                  icon: 'swap-horizontal',
                  style: selectedHistoryCategory === 'Transactions' ? { backgroundColor: '#10b981' } : {},
                  labelStyle: selectedHistoryCategory === 'Transactions' ? { color: 'white', fontWeight: '600' } : { fontWeight: '500' }
                },
                {
                  value: 'PendingOrders',
                  label: 'Orders',
                  icon: 'clock-outline',
                  style: selectedHistoryCategory === 'PendingOrders' ? { backgroundColor: '#ff9800' } : {},
                  labelStyle: selectedHistoryCategory === 'PendingOrders' ? { color: 'white', fontWeight: '600' } : { fontWeight: '500' }
                },
              ]}
              style={{ marginBottom: 8 }}
            />
            <Button 
              mode="outlined" 
              icon="refresh" 
              onPress={() => {
                console.log('[HISTORY] 🔄 Manual refresh triggered');
                setIsLoading(true);
                setup();
              }}
              style={{ marginTop: 8 }}
            >
              Refresh History
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }


  let codeToType = (code) => {
    let convert = {
      'PI': 'Receive', // == deposit
      'PO': 'Send', // == withdrawal
      'FI': 'Fees',
      'FO': 'Fees',
      'BY': 'Buy',
      'SL': 'Sell',
    }
    let type = convert[code];
    return type;
  }


  let renderTransactions = () => {
    console.log('🔍 renderTransactions called');
    console.log('🔍 historyDataModel exists:', !!historyDataModel);
    
    if (!historyDataModel) {
      console.log('🔍 No historyDataModel - showing no data card');
      return (
        <Card>
          <Card.Content style={{ alignItems: 'center', paddingVertical: 32 }}>
            <Avatar.Icon icon="history" size={64} style={{ marginBottom: 16 }} />
            <Text variant="titleMedium" style={{ marginBottom: 8 }}>
              No transaction data
            </Text>
            <Text variant="bodyMedium" style={{ textAlign: 'center', color: 'rgba(0,0,0,0.6)' }}>
              Unable to load transaction history at this time.
            </Text>
          </Card.Content>
        </Card>
      );
    }
    
    let data = historyDataModel.getTransactions();
    console.log('🔍 Transaction data:', data);
    console.log('🔍 Transaction data length:', data?.length);
    console.log('🔍 Transaction data type:', typeof data);
    console.log('🔍 Transaction data isArray:', Array.isArray(data));
    console.log('🔍 First item:', data?.[0]);
    console.log('🔍 Second item:', data?.[1]);
    
    if (!data || data.length === 0) {
      console.log('🔍 No transaction data - showing empty card');
      return (
        <Card>
          <Card.Content style={{ alignItems: 'center', paddingVertical: 32 }}>
            <Avatar.Icon icon="history" size={64} style={{ marginBottom: 16 }} />
            <Text variant="titleMedium" style={{ marginBottom: 8 }}>
              No transactions found
            </Text>
            <Text variant="bodyMedium" style={{ textAlign: 'center', color: 'rgba(0,0,0,0.6)' }}>
              Your transaction history will appear here once you make some transactions.
            </Text>
          </Card.Content>
        </Card>
      );
    }
    
    console.log('🔍 Rendering', data.length, 'transactions');
    
    // Render transactions directly (parent ScrollView handles scrolling)
    return (
      <View>
        {data.map((item, index) => (
          <View key={item.id || index.toString()}>
            {renderTransactionItem({ item })}
          </View>
        ))}
      </View>
    );
  }


  let renderTransactionItem = ({ item }) => {
    console.log('🎨 renderTransactionItem starting for:', item?.baseAsset);
    
    // Handle error items
    if (item?.error) {
      console.log('❌ Item has error, returning error card');
      return (
        <Card style={{ marginBottom: 8 }}>
          <Card.Content style={{ paddingVertical: 12 }}>
            <Text style={{ color: 'red' }}>Invalid transaction data</Text>
          </Card.Content>
        </Card>
      );
    }
    
    try {
      if (!item) {
        console.log('❌ Item is null/undefined');
        return (
          <Card style={{ marginBottom: 8 }}>
            <Card.Content style={{ paddingVertical: 12 }}>
              <Text style={{ color: 'red' }}>Invalid transaction data</Text>
            </Card.Content>
          </Card>
        );
      }
      
      let txnDate = item.date;
      let txnTime = item.time;
      let txnCode = item.code;
      let baseAsset = item.baseAsset;
      
      // Safe asset info retrieval
      let assetInfo = appState.getAssetInfo(baseAsset) || { decimalPlaces: 8, displayString: baseAsset };
      
      // Use _original reference to call methods if available, otherwise use precomputed values
      let baseAssetVolume;
      if (item._original && item._original.getFormattedVolume) {
        baseAssetVolume = item._original.getFormattedVolume(assetInfo);
      } else {
        // Fallback formatting with 9 significant digits max
        try {
          const Big = require('big.js');
          let volume = Big(item.baseAssetVolume || '0');
          
          // Format to 9 significant digits
          let formatted;
          if (volume.eq(0)) {
            formatted = '0';
          } else if (volume.abs().gte(1)) {
            // For numbers >= 1, use toPrecision(9) and remove trailing zeros
            formatted = volume.toPrecision(9).replace(/\.?0+$/, '');
          } else {
            // For numbers < 1, use toFixed with appropriate decimal places
            let decimalPlaces = Math.min(9, assetInfo.decimalPlaces || 8);
            formatted = volume.toFixed(decimalPlaces).replace(/\.?0+$/, '');
          }
          
          baseAssetVolume = formatted;
        } catch (err) {
          baseAssetVolume = item.baseAssetVolume || '0';
        }
      }
      
      let reference = item.parsedReference;
    
    const getTransactionIcon = (code) => {
      return item.icon || 'swap-horizontal';
    };

    const getTransactionColor = (code) => {
      return item.color || '#757575';
    };
    
    console.log('🎨 About to return transaction card JSX for:', baseAsset, baseAssetVolume);
    
    // Determine if this is a payment in or out
    const isPaymentIn = txnCode === 'PI' || txnCode === 'BY'; // Payment In or Buy
    const isPaymentOut = txnCode === 'PO' || txnCode === 'SL'; // Payment Out or Sell
    
    // Color scheme for payment direction
    const colors = {
      paymentIn: {
        primary: '#10b981',      // Green
        background: '#ecfdf5',   // Light green background
        text: '#047857'          // Dark green text
      },
      paymentOut: {
        primary: '#ef4444',      // Red
        background: '#fef2f2',   // Light red background
        text: '#dc2626'          // Dark red text
      },
      neutral: {
        primary: '#6b7280',      // Gray
        background: '#f9fafb',   // Light gray background
        text: '#374151'          // Dark gray text
      }
    };
    
    const currentColors = isPaymentIn ? colors.paymentIn : 
                         isPaymentOut ? colors.paymentOut : 
                         colors.neutral;
    
    return (
      <Card 
        style={{ 
          marginBottom: 12, 
          borderRadius: 16,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          backgroundColor: '#ffffff',
          borderLeftWidth: 4,
          borderLeftColor: currentColors.primary
        }}
      >
        <Card.Content style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={{ 
                width: 48, 
                height: 48, 
                borderRadius: 24, 
                backgroundColor: currentColors.background,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
                borderWidth: 2,
                borderColor: currentColors.primary + '40'
              }}>
                <Avatar.Icon 
                  icon={getTransactionIcon(txnCode)}
                  size={24}
                  style={{ 
                    backgroundColor: 'transparent',
                    margin: 0
                  }}
                  color={currentColors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text 
                  variant="titleMedium" 
                  style={{ 
                    fontWeight: '600', 
                    fontSize: 16,
                    color: '#1a1a1a',
                    marginBottom: 4
                  }}
                >
                  {item.type}
                </Text>
                <Text 
                  variant="bodyMedium" 
                  style={{ 
                    color: '#666666',
                    fontSize: 14,
                    marginBottom: 2
                  }}
                >
                  {txnDate} • {txnTime}
                </Text>
                <Text 
                  variant="bodySmall" 
                  style={{ 
                    color: '#999999',
                    fontSize: 12
                  }}
                >
                  Ref: {reference}
                </Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text 
                variant="titleMedium" 
                style={{ 
                  fontWeight: '700',
                  fontSize: 18,
                  color: currentColors.primary
                }}
              >
                {isPaymentOut ? '-' : '+'}{baseAssetVolume}
              </Text>
              <Text 
                variant="bodySmall" 
                style={{ 
                  color: '#999999',
                  fontSize: 12,
                  marginTop: 2
                }}
              >
                {assetInfo.displayString || baseAsset}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
    } catch (error) {
      console.log('❌ Error rendering transaction item:', error);
      return (
        <Card style={{ marginBottom: 8 }}>
          <Card.Content style={{ paddingVertical: 12 }}>
            <Text style={{ color: 'red' }}>Error loading transaction</Text>
          </Card.Content>
        </Card>
      );
    }
  }


  let renderOrders = () => {
    console.log('[HISTORY] 🔍 renderOrders called');
    console.log('[HISTORY] 🔍 historyDataModel exists:', !!historyDataModel);
    
    if (!historyDataModel) {
      console.log('[HISTORY] 🔍 No historyDataModel - showing no data card');
      return (
        <Card>
          <Card.Content style={{ alignItems: 'center', paddingVertical: 32 }}>
            <Avatar.Icon icon="shopping-outline" size={64} style={{ marginBottom: 16 }} />
            <Text variant="titleMedium" style={{ marginBottom: 8 }}>
              No order data
            </Text>
            <Text variant="bodyMedium" style={{ textAlign: 'center', color: 'rgba(0,0,0,0.6)' }}>
              Unable to load order history at this time.
            </Text>
          </Card.Content>
        </Card>
      );
    }
    
    let data = historyDataModel.getOrders();
    console.log('[HISTORY] 🔍 Order data:', data);
    console.log('[HISTORY] 🔍 Order data length:', data?.length);
    console.log('[HISTORY] 🔍 Order data type:', typeof data);
    console.log('[HISTORY] 🔍 Order data isArray:', Array.isArray(data));
    console.log('[HISTORY] 🔍 First order:', data?.[0]);
    console.log('[HISTORY] 🔍 Second order:', data?.[1]);
    console.log('[HISTORY] 🔍 All orders:', JSON.stringify(data, null, 2));
    
    if (!data || data.length === 0) {
      console.log('[HISTORY] 🔍 No order data - showing empty card');
      return (
        <View>
          <Card>
            <Card.Content style={{ alignItems: 'center', paddingVertical: 32 }}>
              <Avatar.Icon icon="shopping-outline" size={64} style={{ marginBottom: 16 }} />
              <Text variant="titleMedium" style={{ marginBottom: 8 }}>
                No orders found
              </Text>
              <Text variant="bodyMedium" style={{ textAlign: 'center', color: 'rgba(0,0,0,0.6)' }}>
                Your trading orders will appear here once you make some trades.
              </Text>
            </Card.Content>
          </Card>
        </View>
      );
    }
    
    console.log(`[HISTORY] 🔍 Rendering ${data.length} orders`);
    
    // Render each order
    return (
      <View>
        <Card style={{ marginBottom: 16, backgroundColor: '#e8f5e9', borderLeftWidth: 4, borderLeftColor: '#4caf50' }}>
          <Card.Content>
            <Text variant="titleSmall" style={{ fontWeight: 'bold', marginBottom: 8, color: '#2e7d32' }}>
              ✅ Found {data.length} Orders
            </Text>
            <Text variant="bodySmall" style={{ color: '#2e7d32' }}>
              Scroll down to view all orders
            </Text>
          </Card.Content>
        </Card>
        
        {data.map((item, index) => {
          console.log(`[HISTORY] 🎨 Mapping order ${index + 1}/${data.length}:`, item);
          return (
            <View key={item?.id || `order-${index}`}>
              {renderOrderItem({ item, index })}
            </View>
          );
        })}
      </View>
    );
  }


  let renderOrderItem = ({ item, index }) => {
    // item is already an OrderDataModel instance with safe fallbacks
    console.log(`[HISTORY] 🎨 Rendering order ${index + 1}:`, item);
    
    if (!item) {
      console.log(`[HISTORY] ❌ Order ${index + 1} is null/undefined`);
      return (
        <Card style={{ marginBottom: 12, borderRadius: 16, backgroundColor: '#ffebee' }}>
          <Card.Content>
            <Text style={{ color: '#c62828' }}>Error: Order data is missing</Text>
          </Card.Content>
        </Card>
      );
    }
    
    try {
      let orderID = item.id || `order-${index}`;
      let market = item.market || 'UNKNOWN/UNKNOWN';
      let orderSide = item.side || 'UNKNOWN';
      let baseAsset = item.parsedMarket?.baseAsset || item.market?.split('/')[0] || 'BTC';
      let quoteAsset = item.parsedMarket?.quoteAsset || item.market?.split('/')[1] || 'GBP';
      
      console.log(`[HISTORY] 🎨 Order ${index + 1} details:`, {
        orderID,
        market,
        orderSide,
        baseAsset,
        quoteAsset,
        status: item.status,
        type: item.type,
        baseVolume: item.baseVolume,
        quoteVolume: item.quoteVolume
      });
      
      // Safe asset info retrieval
      let baseAssetInfo = { decimalPlaces: 8, displayString: baseAsset };
      let quoteAssetInfo = { decimalPlaces: 2, displayString: quoteAsset };
      
      try {
        baseAssetInfo = appState.getAssetInfo(baseAsset) || baseAssetInfo;
        quoteAssetInfo = appState.getAssetInfo(quoteAsset) || quoteAssetInfo;
      } catch (err) {
        console.log(`[HISTORY] ⚠️ Could not get asset info:`, err);
      }
      
      let baseVolume = item.baseVolume || '0';
      let quoteVolume = item.quoteVolume || '0';
      
      try {
        const formatted = item.getFormattedVolumes(baseAssetInfo, quoteAssetInfo);
        baseVolume = formatted.baseVolume;
        quoteVolume = formatted.quoteVolume;
      } catch (err) {
        console.log(`[HISTORY] ⚠️ Could not format volumes:`, err);
      }
      
      let orderStatus = item.status || 'UNKNOWN';
      let orderDate = item.date || 'Unknown';
      let orderTime = item.time || '00:00:00';
      let orderType = item.type || 'UNKNOWN';
    
    const getStatusColor = () => {
      try {
        return item.getStatusColor();
      } catch (err) {
        return '#757575';
      }
    };

    const getOrderIcon = () => {
      try {
        return item.getIcon();
      } catch (err) {
        return orderSide === 'BUY' ? 'trending-up' : 'trending-down';
      }
    };

    return (
      <Card style={{ 
        marginBottom: 12, 
        borderRadius: 16,
        elevation: 2,
        backgroundColor: '#ffffff',
        borderLeftWidth: 4,
        borderLeftColor: orderSide === 'BUY' ? '#4caf50' : '#f44336'
      }}>
        <Card.Content style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={{ 
                width: 48, 
                height: 48, 
                borderRadius: 24, 
                backgroundColor: orderSide === 'BUY' ? '#e8f5e9' : '#ffebee',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}>
                <Avatar.Icon 
                  icon={getOrderIcon(orderSide)}
                  size={24}
                  style={{ backgroundColor: 'transparent' }}
                  color={orderSide === 'BUY' ? '#4caf50' : '#f44336'}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="titleMedium" style={{ fontWeight: '600', fontSize: 16, marginBottom: 4 }}>
                  {orderSide} {baseAsset}
                </Text>
                <Text variant="bodySmall" style={{ color: '#666', fontSize: 12 }}>
                  {market} • {orderType}
                </Text>
              </View>
            </View>
            <Chip 
              mode="flat"
              textStyle={{ fontSize: 11, fontWeight: '600' }}
              style={{ 
                backgroundColor: `${getStatusColor(orderStatus)}20`,
                borderWidth: 1,
                borderColor: getStatusColor(orderStatus)
              }}
            >
              {orderStatus}
            </Chip>
          </View>
          
          <View style={{ 
            backgroundColor: '#f5f5f5', 
            padding: 12, 
            borderRadius: 8,
            marginBottom: 8
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text variant="bodySmall" style={{ color: '#666' }}>Amount:</Text>
              <Text variant="bodySmall" style={{ fontWeight: '600' }}>
                {baseVolume} {baseAsset}
              </Text>
            </View>
            {quoteVolume !== '0' && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text variant="bodySmall" style={{ color: '#666' }}>Value:</Text>
                <Text variant="bodySmall" style={{ fontWeight: '600' }}>
                  {quoteVolume} {quoteAsset}
                </Text>
              </View>
            )}
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Avatar.Icon 
                icon="clock-outline" 
                size={16} 
                style={{ backgroundColor: 'transparent', marginRight: 4 }} 
                color="#999"
              />
              <Text variant="bodySmall" style={{ color: '#999', fontSize: 11 }}>
                {orderDate} {orderTime}
              </Text>
            </View>
            <Text variant="bodySmall" style={{ color: '#999', fontSize: 11 }}>
              ID: {orderID}
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
    } catch (error) {
      console.log('Error rendering order item:', error);
      return (
        <Surface style={{ marginBottom: 8, borderRadius: 12 }} elevation={1}>
          <View style={{ padding: 16 }}>
            <Text style={{ color: 'red' }}>Error loading order</Text>
          </View>
        </Surface>
      );
    }
  }


  const materialTheme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: materialTheme.colors.background }}>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>

      { isLoading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <Spinner/>
        </View>
      )}

      {! isLoading && displayHistoryControls()}

      {! isLoading && selectedHistoryCategory === 'PendingOrders' && renderOrders()}

      {! isLoading && selectedHistoryCategory === 'Transactions' && renderTransactions()}
      </ScrollView>
    </View>
  );

}


let styles = StyleSheet.create({
  panelContainer: {
    width: '100%',
    height: '100%',
    paddingTop: scaledHeight(15),
    paddingHorizontal: scaledWidth(15),
  },
  heading: {
    alignItems: 'center',
  },
  heading1: {
    marginTop: scaledHeight(10),
    marginBottom: scaledHeight(30),
  },
  headingText: {
    fontSize: normaliseFont(20),
    fontWeight: 'bold',
  },
  basicText: {
    fontSize: normaliseFont(14),
  },
  mediumText: {
    fontSize: normaliseFont(16),
  },
  dropdownText: {
    fontSize: normaliseFont(14),
  },
  historySection: {
    height: '100%',
    //borderWidth: 1, // testing
  },
  historyControls: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: "space-between",
    zIndex: 1,
  },
  historyCategoryWrapper: {
    width: '50%',
    //borderWidth: 1, // testing
  },
  historyCategory: {
    height: scaledHeight(40),
  },
  segmentedButtonLabel: {
    fontSize: normaliseFont(12),
    fontWeight: '500',
  },
  flatListWrapper: {
    height: '80%',
    //borderWidth: 1, // testing
  },
  flatListItem: {
    marginTop: scaledHeight(10),
    paddingHorizontal: scaledWidth(10),
    paddingVertical: scaledHeight(10),
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
  },
  orderTopWrapper: {
    flexDirection: 'row',
    justifyContent: "space-between",
  },
  settledOrderStatus: {
    color: 'blue',
    fontWeight: '500',
  },
  liveOrderStatus: {
    color: 'green',
    fontWeight: '500',
  },
  cancelledOrderStatus: {
    color: 'darkgrey',
    fontWeight: '500',
  },
  typeField: {
    fontWeight: 'bold',
  },
})


export default History;
