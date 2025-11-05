// HistoryDataModel.js
// Data models for Transaction History with fallback values to prevent rendering failures

class TransactionDataModel {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.date = data.date || new Date().toISOString().split('T')[0];
    this.time = data.time || '00:00:00';
    this.code = data.code || 'PI'; // Default to 'Payment In'
    this.baseAsset = data.baseAsset || 'BTC';
    this.baseAssetVolume = data.baseAssetVolume || '0';
    this.quoteAsset = data.quoteAsset || '';
    this.quoteAssetVolume = data.quoteAssetVolume || '0';
    this.reference = data.reference || '{}';
    this.status = data.status || 'completed';
    this.description = data.description || '';
    this.fee = data.fee || '0';
    this.feeAsset = data.feeAsset || '';
    this.market = data.market || null;
    this.type = data.type || this.codeToType(this.code);
    
    // Parse reference safely
    this.parsedReference = this.parseReference();
  }

  generateId() {
    return 'txn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  parseReference() {
    try {
      const ref = JSON.parse(this.reference);
      if (ref && typeof ref === 'object' && ref.ref) {
        return ref.ref;
      }
      return '[none]';
    } catch (err) {
      return '[none]';
    }
  }

  codeToType(code) {
    const typeMap = {
      'PI': 'Payment In',
      'PO': 'Payment Out', 
      'FI': 'Funds In',
      'FO': 'Funds Out',
      'BY': 'Buy Order',
      'SL': 'Sell Order',
    };
    return typeMap[code] || 'Transaction';
  }

  getIcon() {
    const iconMap = {
      'PI': 'cash-plus',
      'PO': 'cash-minus',
      'FI': 'bank-transfer-in',
      'FO': 'bank-transfer-out',
      'BY': 'trending-up',
      'SL': 'trending-down',
    };
    return iconMap[this.code] || 'swap-horizontal';
  }

  getColor() {
    const colorMap = {
      'PI': '#4CAF50', // Green
      'PO': '#F44336', // Red
      'FI': '#2196F3', // Blue
      'FO': '#FF9800', // Orange
      'BY': '#9C27B0', // Purple
      'SL': '#607D8B', // Blue Grey
    };
    return colorMap[this.code] || '#757575';
  }

  // Format volume with proper decimal places
  getFormattedVolume(assetInfo = { decimalPlaces: 8 }) {
    try {
      const Big = require('big.js');
      return Big(this.baseAssetVolume).toFixed(assetInfo.decimalPlaces || 8);
    } catch (err) {
      return '0';
    }
  }
}

class OrderDataModel {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.market = data.market || 'BTC/USD';
    this.side = data.side || 'BUY';
    this.baseVolume = data.baseVolume || '0';
    this.quoteVolume = data.quoteVolume || '0';
    this.status = data.status || 'LIVE';
    this.date = data.date || new Date().toISOString().split('T')[0];
    this.time = data.time || '00:00:00';
    this.price = data.price || '0';
    this.type = data.type || 'IOC'; // Immediate or Cancel
    this.age = data.age || '';
    this.settlement1Id = data.settlement1Id || null;
    this.settlement1Status = data.settlement1Status || null;
    this.settlement2Id = data.settlement2Id || null;
    this.settlement2Status = data.settlement2Status || null;
    
    // Parse market
    this.parsedMarket = this.parseMarket();
  }

  generateId() {
    return 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  parseMarket() {
    try {
      const [baseAsset, quoteAsset] = this.market.split('/');
      return {
        baseAsset: baseAsset || 'BTC',
        quoteAsset: quoteAsset || 'USD'
      };
    } catch (err) {
      return {
        baseAsset: 'BTC',
        quoteAsset: 'USD'
      };
    }
  }

  getStatusColor() {
    const colorMap = {
      'LIVE': '#4CAF50',      // Green
      'SETTLED': '#2196F3',   // Blue
      'CANCELLED': '#F44336', // Red
      'PENDING': '#FF9800',   // Orange
      'PARTIAL': '#9C27B0',   // Purple
    };
    return colorMap[this.status] || '#757575';
  }

  getIcon() {
    return this.side === 'BUY' ? 'trending-up' : 'trending-down';
  }

  // Format volumes with proper decimal places
  getFormattedVolumes(baseAssetInfo = { decimalPlaces: 8 }, quoteAssetInfo = { decimalPlaces: 2 }) {
    try {
      const Big = require('big.js');
      return {
        baseVolume: Big(this.baseVolume).toFixed(baseAssetInfo.decimalPlaces || 8),
        quoteVolume: Big(this.quoteVolume).toFixed(quoteAssetInfo.decimalPlaces || 2)
      };
    } catch (err) {
      return {
        baseVolume: '0',
        quoteVolume: '0'
      };
    }
  }

  isClickable() {
    return this.status === 'SETTLED';
  }
}

class HistoryDataModel {
  constructor() {
    this.transactions = [];
    this.orders = [];
  }

  // Load transactions with fallback data
  loadTransactions(data) {
    try {
      if (!data) {
        this.transactions = this.getDefaultTransactions();
        return this.transactions;
      }

      // Handle different data structures flexibly
      let transactionData = [];
      
      if (Array.isArray(data)) {
        // Direct array format: [txn1, txn2, ...]
        transactionData = data;
      } else if (data.txns && Array.isArray(data.txns)) {
        // Nested format: { txns: [txn1, txn2, ...] }
        transactionData = data.txns;
      } else if (data.transactions && Array.isArray(data.transactions)) {
        // Alternative nested format: { transactions: [txn1, txn2, ...] }
        transactionData = data.transactions;
      } else if (typeof data === 'object' && data !== null) {
        // Single transaction object
        transactionData = [data];
      } else {
        // Unknown format, use default
        transactionData = [];
      }

      this.transactions = transactionData.map(txn => new TransactionDataModel(txn));
      
      // If no real data, provide sample data for testing
      if (this.transactions.length === 0) {
        this.transactions = this.getDefaultTransactions();
      }

      return this.transactions;
    } catch (err) {
      console.log('Error loading transactions:', err);
      this.transactions = this.getDefaultTransactions();
      return this.transactions;
    }
  }

  // Load orders with fallback data
  loadOrders(data) {
    try {
      console.log('[HISTORY-MODEL] 📦 loadOrders called');
      console.log('[HISTORY-MODEL] 📦 Raw data type:', typeof data);
      console.log('[HISTORY-MODEL] 📦 Raw data:', JSON.stringify(data, null, 2));
      console.log('[HISTORY-MODEL] 📦 Is Array?:', Array.isArray(data));
      console.log('[HISTORY-MODEL] 📦 Has data property?:', data?.data);
      console.log('[HISTORY-MODEL] 📦 Has orders property?:', data?.orders);
      console.log('[HISTORY-MODEL] 📦 Has error?:', data?.error);
      console.log('[HISTORY-MODEL] 📦 Object keys:', data && typeof data === 'object' ? Object.keys(data) : 'N/A');
      
      // Handle different data structures flexibly
      let orderData = [];
      
      if (Array.isArray(data)) {
        // Direct array format: [order1, order2, ...]
        console.log('[HISTORY-MODEL] ✅ Format: Direct array');
        orderData = data;
      } else if (data && data.data && Array.isArray(data.data)) {
        // API response format: { error: null, data: [order1, order2, ...] }
        console.log('[HISTORY-MODEL] ✅ Format: API response with data property');
        orderData = data.data;
      } else if (data && data.orders && Array.isArray(data.orders)) {
        // Alternative nested format: { orders: [order1, order2, ...] }
        console.log('[HISTORY-MODEL] ✅ Format: Nested orders property');
        orderData = data.orders;
      } else if (data && typeof data === 'object' && data !== null) {
        // Check if data is an object with numeric/string keys (like { "0": {...}, "1": {...} })
        const keys = Object.keys(data).filter(k => k !== 'error' && k !== 'data');
        console.log('[HISTORY-MODEL] 🔍 Checking object keys:', keys);
        
        if (keys.length > 0 && typeof data[keys[0]] === 'object') {
          console.log('[HISTORY-MODEL] ✅ Format: Object with order keys (converting to array)');
          // Convert object to array
          orderData = keys.map(key => {
            const orderObj = data[key];
            return { ...orderObj, id: orderObj.id || key };
          });
        } else if (!data.error) {
          // Single order object
          console.log('[HISTORY-MODEL] ✅ Format: Single order object');
          orderData = [data];
        }
      } else {
        // Unknown format or error
        console.log('[HISTORY-MODEL] ⚠️ No valid order data found');
        orderData = [];
      }

      console.log(`[HISTORY-MODEL] 📦 Processing ${orderData.length} orders`);
      console.log(`[HISTORY-MODEL] 📦 Order data array:`, JSON.stringify(orderData, null, 2));
      
      // Map API order format to OrderDataModel format
      this.orders = orderData.map((order, index) => {
        console.log(`[HISTORY-MODEL] 🔄 Processing order ${index + 1}:`, order);
        
        // API returns: { id, amount, currency_pair, price, type, unixtime }
        // type: "0" or 0 = BUY, "1" or 1 = SELL
        const baseAsset = 'BTC'; // Default to BTC if not provided
        const quoteAsset = 'GBP'; // Default to GBP if not provided
        const market = `${baseAsset}/${quoteAsset}`;
        const side = (order.type === 0 || order.type === "0") ? 'BUY' : 'SELL';
        
        // Convert Unix timestamp to date and time
        let date = new Date().toISOString().split('T')[0];
        let time = '00:00:00';
        
        if (order.unixtime) {
          try {
            const timestamp = parseInt(order.unixtime) * 1000; // Convert to milliseconds
            const dateObj = new Date(timestamp);
            
            // Format date as DD MMM YYYY
            const day = String(dateObj.getDate()).padStart(2, '0');
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const month = monthNames[dateObj.getMonth()];
            const year = dateObj.getFullYear();
            date = `${day} ${month} ${year}`;
            
            // Format time as HH:MM
            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            time = `${hours}:${minutes}`;
            
            console.log(`[HISTORY-MODEL] 🕐 Converted timestamp ${order.unixtime} to ${date} ${time}`);
          } catch (err) {
            console.log(`[HISTORY-MODEL] ⚠️ Error converting timestamp:`, err);
          }
        }
        
        const orderModel = new OrderDataModel({
          id: order.id,
          market: market,
          side: side,
          baseVolume: order.amount || '0',
          quoteVolume: '0', // Not provided by API
          status: 'LIVE', // Open orders are live
          date: date,
          time: time,
          price: order.price || '0',
          type: 'LIMIT' // Open orders are typically limit orders
        });
        
        console.log(`[HISTORY-MODEL] ✅ Created OrderDataModel ${index + 1}:`, orderModel);
        return orderModel;
      });
      
      // Sort orders by timestamp descending (newest first)
      this.orders.sort((a, b) => {
        // Extract original unixtime from the source data for accurate sorting
        const orderA = orderData.find(o => o.id === a.id);
        const orderB = orderData.find(o => o.id === b.id);
        const timestampA = parseInt(orderA?.unixtime || 0);
        const timestampB = parseInt(orderB?.unixtime || 0);
        return timestampB - timestampA; // Descending order (newest first)
      });
      
      console.log(`[HISTORY-MODEL] ✅ Sorted ${this.orders.length} orders by datetime (newest first)`);
      
      // Don't use default sample data - show empty if no real data
      // if (this.orders.length === 0) {
      //   console.log('⚠️ No orders loaded, using default sample data');
      //   this.orders = this.getDefaultOrders();
      // }

      console.log(`[HISTORY-MODEL] ✅ Successfully loaded ${this.orders.length} orders from /open_orders`);
      return this.orders;
    } catch (err) {
      console.log('[HISTORY-MODEL] ❌ Error loading orders:', err);
      // Don't use default data on error
      return [];
    }
  }

  // Load incomplete settlements (orders awaiting payment like bank transfers)
  loadIncompleteSettlements(data) {
    try {
      console.log('[HISTORY-MODEL] 📦 loadIncompleteSettlements called');
      console.log('[HISTORY-MODEL] 📦 Raw data type:', typeof data);
      console.log('[HISTORY-MODEL] 📦 Raw data:', JSON.stringify(data, null, 2));
      
      // Handle different data structures flexibly
      let settlementData = [];
      
      if (Array.isArray(data)) {
        // Direct array format
        console.log('[HISTORY-MODEL] ✅ Format: Direct array');
        settlementData = data;
      } else if (data && data.data && Array.isArray(data.data)) {
        // API response format: { error: null, data: [...] }
        console.log('[HISTORY-MODEL] ✅ Format: API response with data property');
        settlementData = data.data;
      } else if (data && data.settlements && Array.isArray(data.settlements)) {
        // Alternative nested format: { settlements: [...] }
        console.log('[HISTORY-MODEL] ✅ Format: Nested settlements property');
        settlementData = data.settlements;
      } else if (typeof data === 'object' && data !== null && !data.error) {
        // Single settlement object
        console.log('[HISTORY-MODEL] ✅ Format: Single settlement object');
        settlementData = [data];
      } else {
        console.log('[HISTORY-MODEL] ⚠️ No valid settlement data found');
        settlementData = [];
      }

      console.log(`[HISTORY-MODEL] 📦 Processing ${settlementData.length} incomplete settlements`);
      console.log(`[HISTORY-MODEL] 📦 Settlement data array:`, JSON.stringify(settlementData, null, 2));
      
      // Convert settlements to OrderDataModel format and add to existing orders
      const settlementOrders = settlementData.map((settlement, index) => {
        console.log(`[HISTORY-MODEL] 🔄 Processing settlement ${index + 1}:`, settlement);
        
        // Parse settlement data - adjust based on actual API response format
        // Common fields: id, amount, market/currency_pair, datetime, status, reference
        const market = settlement.market || settlement.currency_pair || 'BTC/GBP';
        const [baseAsset, quoteAsset] = market.toUpperCase().split(/[/_]/);
        const side = settlement.side || settlement.type || 'BUY';
        const [date, time] = (settlement.datetime || settlement.created_at || '').split(' ');
        
        const orderModel = new OrderDataModel({
          id: settlement.id || settlement.settlementID || settlement.settlement_id,
          market: `${baseAsset}/${quoteAsset}`,
          side: side.toUpperCase(),
          baseVolume: settlement.amount || settlement.base_volume || settlement.baseVolume || '0',
          quoteVolume: settlement.quote_volume || settlement.quoteVolume || '0',
          status: 'PENDING', // Incomplete settlements are pending payment
          date: date || new Date().toISOString().split('T')[0],
          time: time || '00:00:00',
          price: settlement.price || '0',
          type: 'SETTLEMENT' // Mark as settlement order
        });
        
        console.log(`[HISTORY-MODEL] ✅ Created OrderDataModel from settlement ${index + 1}:`, orderModel);
        return orderModel;
      });
      
      // Add settlement orders to existing orders
      this.orders = [...this.orders, ...settlementOrders];
      
      console.log(`[HISTORY-MODEL] ✅ Total orders after adding settlements: ${this.orders.length}`);
      return settlementOrders;
    } catch (err) {
      console.log('[HISTORY-MODEL] ❌ Error loading incomplete settlements:', err);
      return [];
    }
  }

  // Default transactions for testing/fallback
  getDefaultTransactions() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];

    return [
      new TransactionDataModel({
        id: 'demo_txn_1',
        date: today,
        time: time,
        code: 'PI',
        baseAsset: 'BTC',
        baseAssetVolume: '0.01',
        reference: JSON.stringify({ ref: 'DEMO001', paymeth: 1, txntype: 'standard' }),
        status: 'completed'
      }),
      new TransactionDataModel({
        id: 'demo_txn_2',
        date: today,
        time: time,
        code: 'BY',
        baseAsset: 'ETH',
        baseAssetVolume: '0.5',
        reference: JSON.stringify({ ref: 'DEMO002', paymeth: 2, txntype: 'buy' }),
        status: 'completed'
      }),
    ];
  }

  // Default orders for testing/fallback
  getDefaultOrders() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];

    return [
      new OrderDataModel({
        id: 'demo_order_1',
        market: 'BTC/USD',
        side: 'BUY',
        baseVolume: '0.01',
        quoteVolume: '650.00',
        status: 'SETTLED',
        date: today,
        time: time,
        price: '65000.00'
      }),
      new OrderDataModel({
        id: 'demo_order_2',
        market: 'ETH/USD',
        side: 'SELL',
        baseVolume: '0.5',
        quoteVolume: '1250.00',
        status: 'LIVE',
        date: today,
        time: time,
        price: '2500.00'
      }),
    ];
  }

  getTransactions() {
    return this.transactions;
  }

  getOrders() {
    return this.orders;
  }

  // Get safe transactions data structure for backward compatibility
  getTransactionsData() {
    return {
      txns: this.transactions
    };
  }

  // Alternative method to provide transactions directly from appState call
  static createFromAppState(appState) {
    const model = new HistoryDataModel();
    
    try {
      // Get data directly from appState methods (might return null/undefined)
      const transactionsData = appState.getTransactions();
      const ordersData = appState.getOrders();
      
      model.loadTransactions(transactionsData);
      model.loadOrders(ordersData);
    } catch (err) {
      console.log('Error creating HistoryDataModel from appState:', err);
      // Use default data if appState calls fail
      model.loadTransactions(null);
      model.loadOrders(null);
    }
    
    return model;
  }
}

export { TransactionDataModel, OrderDataModel, HistoryDataModel };
export default HistoryDataModel;