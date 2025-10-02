// Live Exchange Rate Utility
// Shared utility for getting live cryptocurrency exchange rates
// Used by both Assets and Trade pages

import logger from 'src/util/logger';
let logger2 = logger.extend('LiveRates');
let {deb, dj, log, lj} = logger.getShortcuts(logger2);

/**
 * Gets live exchange rate from CoinGecko API
 * @param {Object} appState - Application state context
 * @param {string} cryptoAsset - Cryptocurrency symbol (BTC, ETH, etc.)
 * @param {string} fiatAsset - Fiat currency symbol (GBP, USD, EUR)
 * @returns {Promise<number|null>} Live exchange rate or null if unavailable
 */
export const getLiveExchangeRate = async (appState, cryptoAsset, fiatAsset) => {
  try {
    log(`Getting live rate for ${cryptoAsset}/${fiatAsset}`);
    
    // Load fresh CoinGecko data
    await appState.loadCoinGeckoPrices();
    
    // Get the rate from ticker data (CoinGecko data is merged into ticker)
    const tickerData = appState.apiData?.ticker || {};
    const marketKey = `${cryptoAsset}/${fiatAsset}`;
    
    if (tickerData[marketKey] && tickerData[marketKey].price && tickerData[marketKey].source === 'coingecko') {
      const rate = parseFloat(tickerData[marketKey].price);
      log(`✅ Live CoinGecko rate found: 1 ${cryptoAsset} = ${rate} ${fiatAsset}`);
      return rate;
    }
    
    log(`❌ No live CoinGecko rate found for ${marketKey}`);
    return null;
  } catch (error) {
    log(`Error getting live exchange rate: ${error.message}`);
    return null;
  }
};

/**
 * Gets the best available price for an asset with source indication
 * @param {Object} appState - Application state context
 * @param {string} asset - Asset symbol
 * @param {string} quoteCurrency - Quote currency (default: GBP)
 * @returns {Object} Price info with value and source
 */
export const getAssetPriceWithSource = (appState, asset, quoteCurrency = 'GBP') => {
  try {
    const tickerData = appState.apiData?.ticker || {};
    const marketKey = `${asset}/${quoteCurrency}`;
    
    if (tickerData[marketKey]) {
      const marketData = tickerData[marketKey];
      
      // Prioritize CoinGecko live rates
      if (marketData.source === 'coingecko' && marketData.price && marketData.price !== "DOWN") {
        return {
          price: parseFloat(marketData.price),
          source: 'coingecko',
          status: 'live',
          icon: '🟢',
          label: 'LIVE'
        };
      }
      
      // Check if we have a direct price field (non-CoinGecko)
      if (marketData.price && marketData.price !== "DOWN") {
        return {
          price: parseFloat(marketData.price),
          source: 'api',
          status: 'api',
          icon: '🟡',
          label: 'API'
        };
      }
      
      // Check if we can use bid/ask prices
      if (marketData.bid && marketData.bid !== "DOWN" && marketData.ask && marketData.ask !== "DOWN") {
        const bidPrice = parseFloat(marketData.bid);
        const askPrice = parseFloat(marketData.ask);
        const midPrice = (bidPrice + askPrice) / 2;
        return {
          price: midPrice,
          source: 'api',
          status: 'api',
          icon: '🟡',
          label: 'API'
        };
      }
      
      // Market is down
      if (marketData.bid === "DOWN" || marketData.ask === "DOWN") {
        return {
          price: null,
          source: 'down',
          status: 'down',
          icon: '📉',
          label: 'DOWN'
        };
      }
    }
    
    // No live data available
    return {
      price: null,
      source: 'none',
      status: 'demo',
      icon: '🔴',
      label: 'DEMO'
    };
    
  } catch (error) {
    log(`Error getting asset price: ${error.message}`);
    return {
      price: null,
      source: 'error',
      status: 'demo',
      icon: '🔴',
      label: 'DEMO'
    };
  }
};

/**
 * Calculates conversion between two assets using live rates
 * @param {Object} appState - Application state context
 * @param {string} fromAsset - Source asset symbol
 * @param {string} toAsset - Target asset symbol
 * @param {number} amount - Amount to convert
 * @returns {Promise<Object>} Conversion result with rate and source info
 */
export const convertAssets = async (appState, fromAsset, toAsset, amount) => {
  try {
    // If converting to the same asset
    if (fromAsset === toAsset) {
      return {
        amount: amount,
        rate: 1,
        source: 'direct',
        status: 'direct'
      };
    }
    
    // Try to get direct rate
    const directRate = await getLiveExchangeRate(appState, fromAsset, toAsset);
    if (directRate) {
      return {
        amount: amount * directRate,
        rate: directRate,
        source: 'coingecko',
        status: 'live'
      };
    }
    
    // Try reverse rate
    const reverseRate = await getLiveExchangeRate(appState, toAsset, fromAsset);
    if (reverseRate) {
      const rate = 1 / reverseRate;
      return {
        amount: amount * rate,
        rate: rate,
        source: 'coingecko',
        status: 'live'
      };
    }
    
    // No live rate available
    return {
      amount: null,
      rate: null,
      source: 'none',
      status: 'unavailable'
    };
    
  } catch (error) {
    log(`Error converting assets: ${error.message}`);
    return {
      amount: null,
      rate: null,
      source: 'error',
      status: 'error'
    };
  }
};

/**
 * Refreshes live rates for specified assets
 * @param {Object} appState - Application state context
 * @param {Array<string>} assets - Assets to refresh rates for
 * @returns {Promise<boolean>} Success status
 */
export const refreshLiveRates = async (appState, assets = ['BTC', 'ETH', 'LTC', 'XRP']) => {
  try {
    log(`Refreshing live rates for: ${assets.join(', ')}`);
    
    // Load fresh CoinGecko data
    await appState.loadCoinGeckoPrices();
    
    // Verify data was loaded
    const tickerData = appState.apiData?.ticker || {};
    const liveRatesFound = assets.some(asset => {
      const marketKey = `${asset}/GBP`;
      return tickerData[marketKey]?.source === 'coingecko';
    });
    
    if (liveRatesFound) {
      log('✅ Live rates refreshed successfully');
      return true;
    } else {
      log('⚠️ No live rates found after refresh');
      return false;
    }
    
  } catch (error) {
    log(`Error refreshing live rates: ${error.message}`);
    return false;
  }
};

export default {
  getLiveExchangeRate,
  getAssetPriceWithSource,
  convertAssets,
  refreshLiveRates
};