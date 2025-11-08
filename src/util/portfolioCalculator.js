/**
 * Portfolio Calculator - Pure function to calculate total portfolio value
 * 
 * This is a global utility function that calculates the total portfolio value
 * in GBP from fiat and crypto balances. It starts fresh each time (no caching)
 * to avoid accumulation errors.
 */

/**
 * Calculate total portfolio value in GBP
 * @param {Object} balanceData - Balance data structure { BTC: {total: X}, GBP: {total: Y}, ... }
 * @param {Object} appState - Application state with calculateCryptoGBPValue method
 * @returns {Object} { total: number, fiatTotal: number, cryptoTotal: number, breakdown: Object }
 */
export const calculatePortfolioValue = (balanceData, appState) => {
  console.log('📊 ===== PORTFOLIO CALCULATION START (PURE FUNCTION) =====');
  console.log('📊 Balance data received:', JSON.stringify(balanceData, null, 2));
  
  // Initialize fresh totals - IMPORTANT: Start from zero each time, no caching
  let freshFiatTotal = 0;
  let freshCryptoTotal = 0;
  const breakdown = {
    fiat: {},
    crypto: {}
  };
  
  // Helper function to determine if an asset is cryptocurrency
  const isCryptoCurrency = (currency) => {
    // Fiat currencies
    const fiatCurrencies = ['GBP', 'EUR', 'USD', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD'];
    // If it's not fiat, it's crypto
    return !fiatCurrencies.includes(currency);
  };
  
  try {
    // Get all currencies from balanceData
    const allCurrencies = Object.keys(balanceData);
    console.log('� All currencies in balance:', allCurrencies);
    
    // Separate into fiat and crypto currencies
    const fiatCurrencies = allCurrencies.filter(c => !isCryptoCurrency(c));
    const cryptoCurrencies = allCurrencies.filter(c => isCryptoCurrency(c));
    
    console.log('💷 Fiat currencies found:', fiatCurrencies);
    console.log('₿ Crypto currencies found:', cryptoCurrencies);
    
    // STEP 1: Calculate fiat balances (direct addition for GBP, others need exchange rates)
    console.log('💷 Step 1: Calculating fiat balances...');
    
    for (let currency of fiatCurrencies) {
      let balance = parseFloat(balanceData[currency].total) || 0;
      console.log(`💷 ${currency}: raw balance = ${balance}`);
      
      if (balance > 0) {
        if (currency === 'GBP') {
          freshFiatTotal += balance;
          breakdown.fiat[currency] = balance;
          console.log(`💷 ${currency}: £${balance.toFixed(2)} ADDED to fiat total`);
          console.log(`💷 Running fiat total: £${freshFiatTotal.toFixed(2)}`);
        } else {
          // For other fiat currencies, we'd need exchange rates
          console.log(`💵 ${currency}: ${balance.toFixed(2)} (exchange rate needed - NOT ADDED)`);
          breakdown.fiat[currency] = 0; // Not converted yet
        }
      }
    }
    
    console.log(`💷 ===== FIAT TOTAL: £${freshFiatTotal.toFixed(2)} =====`);
    
    // STEP 2: Calculate crypto values using best_volume_price API (parallel)
    console.log('₿ Step 2: Calculating crypto balances...');
    
    if (cryptoCurrencies.length === 0) {
      console.log('₿ No crypto currencies found, skipping crypto calculation');
    } else {
      // Calculate crypto values using CACHED prices from AppState (same as balance cards!)
      console.log('₿ Using CACHED crypto prices from AppState for consistency...');
      
      cryptoCurrencies.forEach((currency) => {
        let balance = parseFloat(balanceData[currency].total) || 0;
        
        if (balance <= 0) {
          console.log(`₿ ${currency}: Zero balance, skipping`);
          return;
        }
        
        // Use the same cached calculation method as balance cards
        const gbpValue = appState.calculateCryptoGBPValue(currency, balance);
        
        if (gbpValue > 0) {
          const pricePerUnit = gbpValue / balance;
          console.log(`₿ ${currency}: ${balance} ${currency} = £${gbpValue.toFixed(2)} (cached sell price: £${pricePerUnit.toFixed(2)} per ${currency})`);
          console.log(`₿ Adding ${currency}: £${gbpValue.toFixed(2)} to crypto total`);
          freshCryptoTotal += gbpValue;
          breakdown.crypto[currency] = {
            balance,
            pricePerUnit: pricePerUnit,
            gbpValue: gbpValue
          };
          console.log(`₿ Running crypto total: £${freshCryptoTotal.toFixed(2)}`);
        } else {
          console.log(`⚠️ ${currency}: Could not calculate GBP value (cached price not available)`);
        }
      });
    }
    
    console.log(`₿ ===== CRYPTO TOTAL: £${freshCryptoTotal.toFixed(2)} =====`);
    
    // STEP 3: Calculate final total (fresh calculation, no accumulation)
    const finalTotal = freshFiatTotal + freshCryptoTotal;
    
    console.log(`💼 ===== FINAL PORTFOLIO CALCULATION =====`);
    console.log(`💼 Fiat (GBP): £${freshFiatTotal.toFixed(2)}`);
    console.log(`💼 Crypto (all): £${freshCryptoTotal.toFixed(2)}`);
    console.log(`💼 TOTAL: £${freshFiatTotal.toFixed(2)} + £${freshCryptoTotal.toFixed(2)} = £${finalTotal.toFixed(2)}`);
    console.log(`💼 Breakdown:`, breakdown);
    console.log(`💼 ===== END PORTFOLIO CALCULATION =====`);
    
    return {
      total: finalTotal,
      fiatTotal: freshFiatTotal,
      cryptoTotal: freshCryptoTotal,
      breakdown
    };
    
  } catch (error) {
    console.log('📊 Error calculating portfolio value:', error);
    return {
      total: 0,
      fiatTotal: 0,
      cryptoTotal: 0,
      breakdown,
      error: error.message
    };
  }
};
