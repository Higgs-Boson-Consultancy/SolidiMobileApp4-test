/**
 * Transfer Data Model
 * Provides type-safe data structures and fallback data for the Transfer component
 */

/**
 * Transfer Asset Structure Definition
 * @typedef {Object} TransferAsset
 * @property {string} asset - Asset symbol (e.g., 'BTC', 'ETH', 'GBP')
 * @property {string} label - Display label for dropdown
 * @property {string} value - Value for dropdown (usually same as asset)
 * @property {boolean} withdrawalEnabled - Whether asset can be sent
 * @property {boolean} depositEnabled - Whether asset can be received
 * @property {string} [depositAddress] - Deposit address for receiving
 * @property {number} [minSendAmount] - Minimum amount that can be sent
 * @property {number} [maxSendAmount] - Maximum amount that can be sent
 * @property {string} [network] - Network type (e.g., 'mainnet', 'testnet')
 */

/**
 * Transfer capabilities for different assets
 */
export const TRANSFER_CAPABILITIES = {
  'BTC': {
    withdrawalEnabled: true,
    depositEnabled: true,
    minSendAmount: 0.0001,
    maxSendAmount: 10,
    network: 'mainnet',
    addressFormat: 'bitcoin',
  },
  'ETH': {
    withdrawalEnabled: true,
    depositEnabled: true,
    minSendAmount: 0.001,
    maxSendAmount: 50,
    network: 'ethereum',
    addressFormat: 'ethereum',
  },
  'LTC': {
    withdrawalEnabled: true,
    depositEnabled: true,
    minSendAmount: 0.001,
    maxSendAmount: 100,
    network: 'litecoin',
    addressFormat: 'litecoin',
  },
  'XRP': {
    withdrawalEnabled: true,
    depositEnabled: true,
    minSendAmount: 10,
    maxSendAmount: 10000,
    network: 'ripple',
    addressFormat: 'ripple',
  },
  'ADA': {
    withdrawalEnabled: true,
    depositEnabled: true,
    minSendAmount: 1,
    maxSendAmount: 5000,
    network: 'cardano',
    addressFormat: 'cardano',
  },
  'GBP': {
    withdrawalEnabled: true,
    depositEnabled: true,
    minSendAmount: 1,
    maxSendAmount: 10000,
    network: 'fiat',
    addressFormat: 'bank_account',
  },
  'USD': {
    withdrawalEnabled: true,
    depositEnabled: true,
    minSendAmount: 1,
    maxSendAmount: 10000,
    network: 'fiat',
    addressFormat: 'bank_account',
  },
  'EUR': {
    withdrawalEnabled: true,
    depositEnabled: true,
    minSendAmount: 1,
    maxSendAmount: 10000,
    network: 'fiat',
    addressFormat: 'bank_account',
  },
};

/**
 * Default deposit addresses for demo/fallback purposes
 * In production, these would be generated dynamically
 */
export const DEFAULT_DEPOSIT_ADDRESSES = {
  'BTC': 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  'ETH': '0x742d35Cc6634C0532925a3b8D2623CC78F4Ca5A0',
  'LTC': 'ltc1qw508d6qejxtdg4y5r3zarvary0c5xw7kyq2w5l',
  'XRP': 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
  'ADA': 'addr1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlhvv5g8zt2v5a2g',
  'GBP': 'UK-BANK-ACCOUNT-12345678',
  'USD': 'US-BANK-ACCOUNT-87654321',
  'EUR': 'EU-BANK-ACCOUNT-11223344',
};

/**
 * Asset display information for transfer dropdowns
 */
export const TRANSFER_ASSET_DISPLAY = {
  'BTC': { label: 'Bitcoin (BTC)', value: 'BTC', icon: 'bitcoin' },
  'ETH': { label: 'Ethereum (ETH)', value: 'ETH', icon: 'ethereum' },
  'LTC': { label: 'Litecoin (LTC)', value: 'LTC', icon: 'litecoin' },
  'XRP': { label: 'Ripple (XRP)', value: 'XRP', icon: 'ripple' },
  'ADA': { label: 'Cardano (ADA)', value: 'ADA', icon: 'cardano' },
  'DOT': { label: 'Polkadot (DOT)', value: 'DOT', icon: 'polkadot' },
  'LINK': { label: 'Chainlink (LINK)', value: 'LINK', icon: 'chainlink' },
  'UNI': { label: 'Uniswap (UNI)', value: 'UNI', icon: 'uniswap' },
  'GBP': { label: 'British Pound (GBP)', value: 'GBP', icon: 'pound' },
  'USD': { label: 'US Dollar (USD)', value: 'USD', icon: 'dollar' },
  'EUR': { label: 'Euro (EUR)', value: 'EUR', icon: 'euro' },
};

/**
 * Default transfer data model class
 * Provides safe fallback methods and data structures
 */
export class TransferDataModel {
  constructor() {
    this.assets = Object.keys(TRANSFER_CAPABILITIES);
    this.capabilities = TRANSFER_CAPABILITIES;
    this.addresses = DEFAULT_DEPOSIT_ADDRESSES;
    this.displayInfo = TRANSFER_ASSET_DISPLAY;
  }

  /**
   * Get all assets that support withdrawals (sending)
   * @returns {Array<string>} Array of asset symbols
   */
  getWithdrawalEnabledAssets() {
    try {
      return this.assets.filter(asset => 
        this.capabilities[asset] && this.capabilities[asset].withdrawalEnabled
      );
    } catch (error) {
      console.warn('Error getting withdrawal assets:', error);
      return ['BTC', 'ETH', 'GBP']; // Safe fallback
    }
  }

  /**
   * Get all assets that support deposits (receiving)
   * @returns {Array<string>} Array of asset symbols
   */
  getDepositEnabledAssets() {
    try {
      return this.assets.filter(asset => 
        this.capabilities[asset] && this.capabilities[asset].depositEnabled
      );
    } catch (error) {
      console.warn('Error getting deposit assets:', error);
      return ['BTC', 'ETH', 'GBP']; // Safe fallback
    }
  }

  /**
   * Get deposit address for an asset
   * @param {string} asset - Asset symbol
   * @returns {string} Deposit address or fallback
   */
  getDepositAddress(asset) {
    try {
      if (!asset || typeof asset !== 'string') {
        return 'demo-address-12345';
      }
      
      return this.addresses[asset.toUpperCase()] || `demo-${asset.toLowerCase()}-address-12345`;
    } catch (error) {
      console.warn('Error getting deposit address:', error);
      return 'demo-address-12345';
    }
  }

  /**
   * Get transfer capabilities for an asset
   * @param {string} asset - Asset symbol
   * @returns {Object} Transfer capabilities or safe defaults
   */
  getAssetCapabilities(asset) {
    try {
      if (!asset || typeof asset !== 'string') {
        return {
          withdrawalEnabled: false,
          depositEnabled: false,
          minSendAmount: 0,
          maxSendAmount: 0,
        };
      }
      
      return this.capabilities[asset.toUpperCase()] || {
        withdrawalEnabled: false,
        depositEnabled: false,
        minSendAmount: 0,
        maxSendAmount: 0,
      };
    } catch (error) {
      console.warn('Error getting asset capabilities:', error);
      return {
        withdrawalEnabled: false,
        depositEnabled: false,
        minSendAmount: 0,
        maxSendAmount: 0,
      };
    }
  }

  /**
   * Get display information for an asset
   * @param {string} asset - Asset symbol
   * @returns {Object} Display information
   */
  getAssetDisplayInfo(asset) {
    try {
      if (!asset || typeof asset !== 'string') {
        return { label: 'Unknown Asset', value: 'UNKNOWN', icon: 'help-circle' };
      }
      
      const upperAsset = asset.toUpperCase();
      return this.displayInfo[upperAsset] || {
        label: `${asset} (${upperAsset})`,
        value: upperAsset,
        icon: 'help-circle'
      };
    } catch (error) {
      console.warn('Error getting display info:', error);
      return { label: 'Unknown Asset', value: 'UNKNOWN', icon: 'help-circle' };
    }
  }

  /**
   * Generate dropdown items for send assets
   * @returns {Array<Object>} Dropdown items
   */
  generateSendAssetItems() {
    try {
      const sendAssets = this.getWithdrawalEnabledAssets();
      return sendAssets.map(asset => {
        const displayInfo = this.getAssetDisplayInfo(asset);
        return {
          label: displayInfo.label,
          value: displayInfo.value,
          icon: displayInfo.icon,
        };
      });
    } catch (error) {
      console.warn('Error generating send asset items:', error);
      return [
        { label: 'Bitcoin (BTC)', value: 'BTC', icon: 'bitcoin' },
        { label: 'Ethereum (ETH)', value: 'ETH', icon: 'ethereum' },
        { label: 'British Pound (GBP)', value: 'GBP', icon: 'pound' },
      ];
    }
  }

  /**
   * Generate dropdown items for receive assets
   * @returns {Array<Object>} Dropdown items
   */
  generateReceiveAssetItems() {
    try {
      const receiveAssets = this.getDepositEnabledAssets();
      return receiveAssets.map(asset => {
        const displayInfo = this.getAssetDisplayInfo(asset);
        return {
          label: displayInfo.label,
          value: displayInfo.value,
          icon: displayInfo.icon,
        };
      });
    } catch (error) {
      console.warn('Error generating receive asset items:', error);
      return [
        { label: 'Bitcoin (BTC)', value: 'BTC', icon: 'bitcoin' },
        { label: 'Ethereum (ETH)', value: 'ETH', icon: 'ethereum' },
        { label: 'British Pound (GBP)', value: 'GBP', icon: 'pound' },
      ];
    }
  }

  /**
   * Validate send amount for an asset
   * @param {string} asset - Asset symbol
   * @param {string|number} amount - Amount to validate
   * @returns {Object} Validation result
   */
  validateSendAmount(asset, amount) {
    try {
      const capabilities = this.getAssetCapabilities(asset);
      const numAmount = parseFloat(amount);
      
      if (isNaN(numAmount) || numAmount <= 0) {
        return { valid: false, error: 'Please enter a valid amount' };
      }
      
      if (numAmount < capabilities.minSendAmount) {
        return { 
          valid: false, 
          error: `Minimum send amount is ${capabilities.minSendAmount} ${asset}` 
        };
      }
      
      if (numAmount > capabilities.maxSendAmount) {
        return { 
          valid: false, 
          error: `Maximum send amount is ${capabilities.maxSendAmount} ${asset}` 
        };
      }
      
      return { valid: true, error: null };
    } catch (error) {
      console.warn('Error validating send amount:', error);
      return { valid: false, error: 'Amount validation failed' };
    }
  }

  /**
   * Format asset amount for display
   * @param {string} asset - Asset symbol
   * @param {string|number} amount - Amount to format
   * @returns {string} Formatted amount
   */
  formatAmount(asset, amount) {
    try {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount)) return '0.00';
      
      const capabilities = this.getAssetCapabilities(asset);
      const isCrypto = capabilities.network !== 'fiat';
      const decimals = isCrypto ? 6 : 2;
      
      return numAmount.toFixed(decimals);
    } catch (error) {
      console.warn('Error formatting amount:', error);
      return '0.00';
    }
  }
}

/**
 * Singleton instance for use throughout the application
 */
export const transferDataModel = new TransferDataModel();

/**
 * Export utility functions for easy access
 */
export const TransferUtils = {
  getWithdrawalAssets: () => transferDataModel.getWithdrawalEnabledAssets(),
  getDepositAssets: () => transferDataModel.getDepositEnabledAssets(),
  getDepositAddress: (asset) => transferDataModel.getDepositAddress(asset),
  generateSendItems: () => transferDataModel.generateSendAssetItems(),
  generateReceiveItems: () => transferDataModel.generateReceiveAssetItems(),
  validateAmount: (asset, amount) => transferDataModel.validateSendAmount(asset, amount),
  formatAmount: (asset, amount) => transferDataModel.formatAmount(asset, amount),
};

export default TransferDataModel;