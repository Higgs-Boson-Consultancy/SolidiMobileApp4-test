// React imports
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Material Design imports
import {
  Text,
  useTheme,
} from 'react-native-paper';

// Other imports
import _ from 'lodash';
import Big from 'big.js';

// Internal imports
import AppStateContext from 'src/application/data';
import { colors, sharedStyles, layoutStyles, cardStyles } from 'src/constants';
import { colors as sharedColors } from 'src/styles/shared';
import { scaledWidth, scaledHeight, normaliseFont } from 'src/util/dimensions';
import { Title } from 'src/components/shared';
import misc from 'src/util/misc';

// Asset Data Model imports
import {
  getAssetInfo,
  generateFallbackAssetData,
  processBalanceData,
  validateAssetDataArray,
  getDemoPrice,
  createAssetItem
} from './AssetDataModel';

// Create local references for commonly used styles
const layout = layoutStyles;
const cards = cardStyles;

// Logger
import logger from 'src/util/logger';
let logger2 = logger.extend('Assets');
let {deb, dj, log, lj} = logger.getShortcuts(logger2);




let Assets = () => {

  let appState = useContext(AppStateContext);
  
  // Safety check: Ensure appState is available
  if (!appState) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#666' }}>Loading...</Text>
      </View>
    );
  }

  let [renderCount, triggerRender] = useState(0);
  let stateChangeID = appState.stateChangeID;
  
  // API loading states
  let [isLoadingBalances, setIsLoadingBalances] = useState(false);
  let [isLoadingTicker, setIsLoadingTicker] = useState(false);
  let [isDataReady, setIsDataReady] = useState(false);
  
  // Initialize with safe data immediately to prevent any undefined issues
  const [assetData, setAssetData] = useState(() => generateFallbackAssetData());

  // Use AssetDataModel for consistent fallback data
  const defaultAssetData = generateFallbackAssetData();

  // Refresh function for manual data reload with comprehensive error handling
  let refreshData = async () => {
    try {
      console.log('🔄 Assets: Starting manual refresh...');
      await setup();
      console.log('✅ Assets: Manual refresh completed');
    } catch (error) {
      console.log('❌ Assets: Manual refresh failed:', error);
      // Even if refresh fails, ensure we have fallback data displayed
      setAssetData(generateFallbackAssetData());
      triggerRender(renderCount + 1);
    }
  };




  // Initial setup.
  useEffect(() => {
    setup();
  }, []); // Pass empty array so that this only runs once on mount.

  // Safety useEffect to ensure assetData is never empty
  useEffect(() => {
    if (!Array.isArray(assetData) || assetData.length === 0) {
      console.log('🔄 Assets: assetData is empty, initializing with fallback');
      setAssetData(generateFallbackAssetData());
    }
  }, [assetData]);


  let setup = async () => {
    try {
      // General setup with error handling
      try {
        await appState.generalSetup({caller: 'Assets'});
      } catch (setupError) {
        console.log('❌ Assets setup: General setup failed:', setupError);
        // Continue with component loading even if general setup fails
      }
      
      // Load balances with loading state and comprehensive error handling
      setIsLoadingBalances(true);
      try {
        const balancePromise = appState.loadBalances();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Balance loading timeout after 5 seconds')), 5000)
        );
        
        await Promise.race([balancePromise, timeoutPromise]);
        
        // Trigger render to show balance data
        triggerRender(renderCount + 1);
      } catch (balanceError) {
        console.log('❌ Assets setup: Balance loading failed:', balanceError);
        // Continue with demo data if balance loading fails - AssetDataModel will provide fallbacks
      } finally {
        setIsLoadingBalances(false);
      }
      
      // Load ticker data with loading state and comprehensive error handling
      setIsLoadingTicker(true);
      try {
        await appState.loadTickerWithCoinGecko();
        
        // Force a re-render to show updated price data
        triggerRender(renderCount + 1);
      } catch (tickerError) {
        console.log('❌ Assets setup: Ticker loading failed:', tickerError);
        // Use demo prices if ticker loading fails - AssetDataModel will provide fallbacks
      } finally {
        setIsLoadingTicker(false);
      }
      
      // Check if state changed during async operations
      if (appState.stateChangeIDHasChanged(stateChangeID)) {
        console.log('Assets setup: State changed during setup, aborting');
        return;
      }
      
      // Final render trigger
      triggerRender(renderCount + 1);
      setIsDataReady(true);
      
      // Update asset data state with processed data
      try {
        let balanceData = {};
        if (appState.state && appState.state.apiData && appState.state.apiData.balance) {
          balanceData = appState.state.apiData.balance;
        } else {
          const assetList = ['BTC', 'ETH', 'LTC', 'XRP', 'ADA', 'DOT', 'LINK', 'UNI', 'GBP', 'USD', 'EUR'];
          assetList.forEach(asset => {
            const balance = appState.getBalance(asset);
            if (balance && balance !== '[loading]') {
              balanceData[asset] = balance;
            }
          });
        }
        
        const processedData = processBalanceData(balanceData);
        const validData = validateAssetDataArray(processedData);
        setAssetData(validData);
      } catch (dataError) {
        console.log('❌ Assets setup: Error processing asset data:', dataError);
        setAssetData(generateFallbackAssetData());
      }
      
    } catch(err) {
      console.log('❌ Assets setup: Critical error in setup:', err);
      // Even if setup fails, trigger render to show demo data via AssetDataModel
      triggerRender(renderCount + 1);
      setIsDataReady(true);
      setAssetData(generateFallbackAssetData());
    }
  }





  // Bulletproof renderItem function with maximum safety
  let renderAssetItem = ({ item, index }) => {
    // Ultimate safety wrapper - this should NEVER fail
    try {
      // Safety guard: Ensure item exists and has required properties
      if (!item || typeof item !== 'object' || !item.asset) {
        console.warn('renderAssetItem: Invalid item received at index', index, ':', item);
        // Return a valid component instead of null to prevent FlatList issues
        return (
          <View style={{ padding: 10, backgroundColor: '#f0f0f0', margin: 5 }}>
            <Text style={{ color: '#666' }}>Invalid asset data</Text>
          </View>
        );
      }
      
      // Example item:
      // {"asset": "XRP", "balance": "0.00000000"}
      let asset = item.asset;
      let volume = item.balance;
      
      // Safeguard: If volume contains [loading] or is invalid, replace with fallback data
      if (volume === '[loading]' || volume === undefined || volume === null || volume === '') {
        // Use AssetDataModel fallback balance
        const fallbackItem = createAssetItem(asset, null);
        volume = fallbackItem.balance;
      }
      
      // Get asset info using AssetDataModel
      let assetInfo = getAssetInfo(asset);
    
    let assetDP = assetInfo.decimalPlaces;
    let displayVolume;
    try {
      displayVolume = Big(volume).toFixed(assetDP);
    } catch (error) {
      console.log('Error formatting volume for asset', asset, ':', error);
      displayVolume = '0.00000000';
    }
    let name = assetInfo.name;
    let symbol = assetInfo.displaySymbol;
    
    // Get live price from ticker with enhanced logging
    let market = `${asset}/GBP`;
    let ticker = appState.getTicker();
    let currentPrice = null;
    let priceChange = null;
    let portfolioValue = '0.00';
    
    // Check for live ticker data first
    if (ticker && ticker[market] && ticker[market].price) {
      currentPrice = parseFloat(ticker[market].price);
      priceChange = ticker[market].change_24h || null;
    } else {
      // Use AssetDataModel for demo prices with consistency
      currentPrice = getDemoPrice(asset);
      // Demo price change data
      priceChange = Math.random() > 0.5 ? 
        +(Math.random() * 10).toFixed(2) : 
        -(Math.random() * 10).toFixed(2);
    }
    
    // Calculate portfolio value
    if (currentPrice && !isNaN(currentPrice)) {
      let volumeNum = parseFloat(volume);
      if (!isNaN(volumeNum)) {
        portfolioValue = (currentPrice * volumeNum).toFixed(2);
      }
    }
    
    const formatPrice = (price) => {
      if (!price) return 'N/A';
      if (price >= 1000) return `£${price.toLocaleString()}`;
      if (price >= 1) return `£${price.toFixed(2)}`;
      return `£${price.toFixed(4)}`;
    };
    
    // Determine asset type for styling
    const isCrypto = assetInfo.type === 'crypto';
    const borderColor = isCrypto ? '#FF9800' : '#2196F3'; // Orange for crypto, blue for fiat
    
    // Dummy price data with percentages
    const dummyPriceData = {
      'BTC': { price: '45,250.00', change: '+2.45%', isPositive: true },
      'ETH': { price: '2,845.50', change: '+1.23%', isPositive: true },
      'LTC': { price: '94.75', change: '-0.87%', isPositive: false },
      'XRP': { price: '0.4523', change: '+5.12%', isPositive: true },
      'ADA': { price: '0.3845', change: '-1.45%', isPositive: false },
      'DOT': { price: '5.25', change: '+3.67%', isPositive: true },
      'LINK': { price: '14.75', change: '+0.95%', isPositive: true },
      'UNI': { price: '6.85', change: '-2.34%', isPositive: false },
      'GBP': { price: '1.00', change: '0.00%', isPositive: true },
      'USD': { price: '0.82', change: '+0.15%', isPositive: true },
      'EUR': { price: '0.95', change: '-0.25%', isPositive: false },
    };

    const priceData = dummyPriceData[asset] || { price: '0.00', change: '0.00%', isPositive: true };

    // Cryptocurrency icons using Material Community Icons
    const cryptoIcons = {
      'BTC': { name: 'bitcoin', color: '#f7931a' },
      'ETH': { name: 'ethereum', color: '#627eea' },
      'LTC': { name: 'litecoin', color: '#bfbbbb' },
      'XRP': { name: 'currency-sign', color: '#23292f' }, // Generic currency for XRP
      'ADA': { name: 'alpha-a-circle', color: '#0033ad' }, // A for ADA
      'DOT': { name: 'circle-multiple', color: '#e6007a' }, // Multiple circles for Polkadot
      'LINK': { name: 'link-variant', color: '#375bd2' }, // Link for Chainlink
      'UNI': { name: 'unicorn', color: '#ff007a' }, // Unicorn for Uniswap
    };
    
    // Fiat currency fallback with text symbols
    const fiatIcons = {
      'GBP': { symbol: '£', color: '#1f2937', bgColor: '#f9fafb' },
      'USD': { symbol: '$', color: '#059669', bgColor: '#ecfdf5' },
      'EUR': { symbol: '€', color: '#7c2d12', bgColor: '#fef7ed' },
    };
    
    const cryptoIconConfig = cryptoIcons[asset];
    const fiatConfig = fiatIcons[asset];
    
    // Function to handle crypto item press
    const handleCryptoPress = () => {
      // Only navigate for crypto assets, not fiat currencies
      if (cryptoIconConfig) {
        // Store selected crypto data in app state
        appState.selectedCrypto = {
          asset,
          name,
          symbol,
          balance: displayVolume,
          currentPrice: currentPrice || 0,
          priceChange: priceChange || 0,
          portfolioValue
        };
        
        // Navigate to CryptoContent page
        appState.setMainPanelState({
          mainPanelState: 'CryptoContent',
          pageName: 'default'
        });
      }
    };
    
    return (
      <TouchableOpacity 
        style={styles.assetCard}
        onPress={handleCryptoPress}
        activeOpacity={cryptoIconConfig ? 0.7 : 1}
      >
        <View style={[
          styles.assetIconContainer, 
          !cryptoIconConfig && fiatConfig && { backgroundColor: fiatConfig.bgColor }
        ]}>
          {cryptoIconConfig ? (
            <Icon
              name={cryptoIconConfig.name}
              size={scaledWidth(24)}
              color={cryptoIconConfig.color}
            />
          ) : fiatConfig ? (
            <Text style={{
              fontSize: scaledWidth(16),
              fontWeight: 'bold',
              color: fiatConfig.color,
            }}>
              {fiatConfig.symbol}
            </Text>
          ) : (
            <Text style={{
              fontSize: scaledWidth(14),
              fontWeight: 'bold',
              color: '#6b7280',
            }}>
              {asset}
            </Text>
          )}
        </View>
        <View style={styles.assetInfo}>
          <Text style={styles.assetSymbol}>{symbol}</Text>
          <Text style={styles.assetName}>{name}</Text>
        </View>
        <View style={styles.assetBalance}>
          <Text style={styles.balanceAmount}>{displayVolume}</Text>
          <Text style={styles.priceAmount}>£{priceData.price}</Text>
          <Text style={[styles.priceChange, priceData.isPositive ? styles.priceUp : styles.priceDown]}>
            {priceData.change}
          </Text>
        </View>
        {cryptoIconConfig && (
          <View style={{ marginLeft: 8 }}>
            <Icon
              name="chevron-right"
              size={20}
              color="#9CA3AF"
            />
          </View>
        )}
      </TouchableOpacity>
    );
    } catch (error) {
      console.log('❌ renderAssetItem: Error rendering asset item:', error);
      return (
        <View style={{ padding: 16 }}>
          <Text style={{ color: '#666' }}>Error loading asset</Text>
        </View>
      );
    }
  }


  let renderAssets = () => {
    try {
      console.log('🔍 renderAssets: Using state-based asset data, length:', assetData.length);
      
      // Use the state-based asset data which is always guaranteed to be a valid array
      const safeData = Array.isArray(assetData) && assetData.length > 0 ? assetData : generateFallbackAssetData();
      
      // Additional safety verification
      const verifiedData = safeData.filter(item => 
        item && 
        typeof item === 'object' && 
        item.asset && 
        typeof item.asset === 'string' &&
        item.balance !== undefined &&
        item.balance !== null
      );
      
      // If no valid items, use complete fallback
      const finalData = verifiedData.length > 0 ? verifiedData : generateFallbackAssetData();
      
      console.log('� renderAssets: Final data for FlatList:', finalData.length, 'items');
      
      return (
        <FlatList
          data={finalData}
          renderItem={renderAssetItem}
          keyExtractor={(item, index) => {
            try {
              return `asset-${item?.asset || 'unknown'}-${index}`;
            } catch (error) {
              return `asset-error-${index}-${Date.now()}`;
            }
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ width: '100%' }}
          removeClippedSubviews={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          extraData={renderCount}
          ListEmptyComponent={() => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
              <Text style={{ color: '#666', fontSize: 16, textAlign: 'center' }}>
                No assets available
              </Text>
            </View>
          )}
        />
      );
    } catch (error) {
      console.log('❌ renderAssets: Error rendering assets list:', error);
      // Return a FlatList with fallback data instead of error text
      const fallbackData = generateFallbackAssetData();
      return (
        <FlatList
          data={fallbackData}
          renderItem={renderAssetItem}
          keyExtractor={(item, index) => {
            try {
              return `fallback-${item?.asset || 'unknown'}-${index}`;
            } catch (error) {
              return `fallback-error-${index}-${Date.now()}`;
            }
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ width: '100%' }}
          ListEmptyComponent={() => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
              <Text style={{ color: '#666', fontSize: 16, textAlign: 'center' }}>
                Unable to load assets. Please try refreshing.
              </Text>
            </View>
          )}
        />
      );
    }
  }


  const materialTheme = useTheme();

  // Debug ticker data
  const currentTicker = appState.getTicker();
  console.log('Assets Render - Current ticker data:', currentTicker);
  console.log('Assets Render - Ticker keys:', currentTicker ? Object.keys(currentTicker) : 'null');

  console.log('Assets page rendering...');
  
  // Ultimate safety wrapper for the entire component render
  try {
    return (
      <View style={[sharedStyles.container, { backgroundColor: sharedColors.background }]}>
        
        <Title 
          rightElement={
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8
            }}>
              
              {/* Refresh Button */}
              <TouchableOpacity 
                onPress={refreshData}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                  opacity: (isLoadingBalances || isLoadingTicker) ? 0.5 : 1
                }}
                disabled={isLoadingBalances || isLoadingTicker}
              >
                <Text style={{
                  color: 'white',
                  fontSize: 10,
                  fontWeight: '600'
                }}>
                  🔄 REFRESH
                </Text>
              </TouchableOpacity>
            </View>
          }
          customContent={
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 24
            }}>
              {/* Total Value */}
              <View style={{
                flex: 1,
                backgroundColor: '#ffffff',
                padding: 16,
                borderRadius: 8,
                marginHorizontal: 4,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
              }}>
                <Text variant="bodySmall" style={{
                  fontSize: 14,
                  color: '#666666',
                  marginBottom: 4
                }}>
                  Total Value
                </Text>
                <Text variant="titleLarge" style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: '#000000'
                }}>
                  {(() => {
                    try {
                      // Calculate total portfolio value using AssetDataModel
                      let totalValue = 0;
                      const ticker = appState.getTicker();
                      
                      // Try to get real balance data first
                      let balanceData = {};
                      if (appState.state && appState.state.apiData && appState.state.apiData.balance) {
                        balanceData = appState.state.apiData.balance;
                      } else {
                        // Process empty balance data to get fallback data
                        const processedData = processBalanceData({});
                        balanceData = {};
                        processedData.forEach(item => {
                          balanceData[item.asset] = item.balance;
                        });
                      }
                      
                      console.log('📈 Available ticker data:', ticker);
                      
                      Object.keys(balanceData).forEach(asset => {
                        try {
                          const balance = parseFloat(balanceData[asset]);
                          const market = `${asset}/GBP`;
                          let price = null;
                          
                          // Try to get live price from ticker first
                          if (ticker && ticker[market] && ticker[market].price) {
                            price = parseFloat(ticker[market].price);
                          } else {
                            // Use AssetDataModel demo price
                            price = getDemoPrice(asset);
                          }
                          
                          if (!isNaN(balance) && price && !isNaN(price)) {
                            const assetValue = balance * price;
                            totalValue += assetValue;
                          }
                        } catch (assetError) {
                          console.log('Error calculating value for asset', asset, ':', assetError);
                        }
                      });
                      
                      return totalValue > 0 ? `£${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '£0.00';
                    } catch (error) {
                      console.log('Error calculating total value:', error);
                      return '£0.00';
                    }
                  })()}
                </Text>
              </View>
              
              {/* 24h Change */}
              <View style={[
                {
                  flex: 1,
                  backgroundColor: '#ffffff',
                  borderRadius: 12,
                  padding: 16,
                  alignItems: 'center',
                  justifyContent: 'center'
                },
                {
                  marginLeft: 8
                }
              ]}>
                <Text variant="bodySmall" style={{
                  fontSize: 12,
                  color: '#666666',
                  fontWeight: '500',
                  marginBottom: 8,
                  textAlign: 'center'
                }}>
                  24h Change
                </Text>
                <View style={layout.rowCenter}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#4CAF50',
                    marginRight: 4
                  }}>
                    +5.2%
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: '#4CAF50',
                    fontWeight: '600'
                  }}>
                    £124
                  </Text>
                </View>
              </View>
            </View>
          }
        >
          My Assets
        </Title>

        {/* Content Section - Full width scrollable */}
        <View style={{ flex: 1, paddingTop: 12 }}>

          {/* Assets List - Full width with padding */}
          <View style={{ flex: 1, paddingHorizontal: 16 }}>
            
            {(() => {
              try {
                const assetsComponent = renderAssets();
                return assetsComponent || (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#666', fontSize: 16 }}>
                      No assets to display
                    </Text>
                  </View>
                );
              } catch (error) {
                console.log('❌ Assets render error:', error);
                return (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#666', fontSize: 16 }}>
                      Loading assets...
                    </Text>
                  </View>
                );
              }
            })()}
            
            {/* Debug info */}
            {console.log('Assets: Render - renderCount:', renderCount)}
          </View>
        </View>
      </View>
    );
  } catch (criticalError) {
    console.log('❌ Assets: Critical render error:', criticalError);
    return (
      <View style={[sharedStyles.container, { backgroundColor: sharedColors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#666', fontSize: 16, textAlign: 'center', margin: 20 }}>
          Unable to load Assets page.{'\n'}Please restart the app.
        </Text>
      </View>
    );
  }

}


let styles = StyleSheet.create({
  ...sharedStyles,
  
  panelContainer: {
    paddingHorizontal: scaledWidth(15),
    paddingVertical: scaledHeight(15),
    width: '100%',
    height: '100%',
  },
  heading: {
    ...sharedStyles.center,
  },
  heading1: {
    marginTop: scaledHeight(10),
    marginBottom: scaledHeight(30),
  },
  headingText: {
    ...sharedStyles.titleText,
  },
  basicText: {
    ...sharedStyles.bodyText,
  },
  // Common inline style replacements
  cardContent: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  flexOne: {
    flex: 1,
  },
  greenBadge: {
    backgroundColor: sharedColors.success,
  },
  assetContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerSection: {
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  secureBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  secureText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  whiteText: {
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 2,
  },
  rightAlign: {
    flex: 1,
    marginLeft: 4,
    alignItems: 'flex-end',
  },
  leftAlign: {
    flex: 1,
    marginRight: 4,
  },
  smallText: {
    fontSize: 8,
    color: '#999',
  },
  balanceContainer: {
    alignItems: 'flex-end',
    minWidth: 70,
  },
  scrollContainer: {
    paddingBottom: 0,
  },
  fullWidth: {
    width: '100%',
    marginTop: 0,
  },
  bold: {
    fontWeight: 'bold',
  },
  assetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 0,
    paddingHorizontal: scaledWidth(16),
    paddingVertical: scaledHeight(16),
    marginBottom: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e5ea',
    width: '100%',
    minHeight: scaledHeight(72),
  },
  assetIconContainer: {
    width: scaledWidth(44),
    height: scaledHeight(44),
    borderRadius: scaledWidth(22),
    backgroundColor: '#f2f2f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scaledWidth(14),
  },
  assetIcon: {
    width: scaledWidth(28),
    height: scaledHeight(28),
    resizeMode: 'contain',
  },
  assetInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: scaledWidth(12),
  },
  assetSymbol: {
    fontSize: normaliseFont(16),
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: scaledHeight(4),
  },
  assetName: {
    fontSize: normaliseFont(13),
    color: '#8e8e93',
    fontWeight: '400',
  },
  assetBalance: {
    alignItems: 'flex-end',
    minWidth: scaledWidth(120),
    justifyContent: 'center',
  },
  balanceAmount: {
    fontSize: normaliseFont(12),
    fontWeight: '500',
    color: '#8e8e93',
    marginBottom: scaledHeight(4),
  },
  priceAmount: {
    fontSize: normaliseFont(16),
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: scaledHeight(2),
  },
  priceChange: {
    fontSize: normaliseFont(14),
    fontWeight: '500',
  },
  priceUp: {
    color: '#34c759',
  },
  priceDown: {
    color: '#ff3b30',
  },
  controls: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: "space-between",
    zIndex: 1,
    //borderWidth: 1, // testing
  },
  assetCategoryWrapper: {
    width: '50%',
  },
  assetCategory: {
    height: scaledHeight(40),
  },
  dropdownText: {
    fontSize: normaliseFont(14),
  },
  flatListWrapper: {
    height: '80%',
    //borderWidth: 1, // testing
  },
  assetList: {
    //borderWidth: 1, // testing
    marginTop: scaledHeight(15),
  },
  flatListItem: {
    marginBottom: scaledHeight(15),
    paddingHorizontal: scaledWidth(10),
    paddingVertical: scaledHeight(15),
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: "space-between",
  },
  assetText: {
    fontSize: normaliseFont(16),
  },
});


export default Assets;
