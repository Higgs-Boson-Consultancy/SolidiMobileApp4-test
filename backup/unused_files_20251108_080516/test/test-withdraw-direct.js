// Direct test of withdraw API to debug the issue
const { SolidiRestAPIClientLibrary } = require('../src/api/SolidiRestAPIClientLibrary');

async function testWithdrawDirect() {
  console.log('🧪 Testing withdraw API directly...');
  
  try {
    // Initialize the API client
    const api = new SolidiRestAPIClientLibrary();
    
    // Test the privateMethod call directly with the withdraw parameters
    const result = await api.privateMethod({
      httpMethod: 'POST',
      apiRoute: 'withdraw/BTC',
      params: {
        volume: '0.00001',  // Small test amount
        address: 'tb1qumc274tp6vjd6mvldcjavjjqd2xzak00eh4ell',
        priority: 'normal'
      },
      functionName: 'test-withdraw-direct'
    });
    
    console.log('✅ Success! API Response:', result);
    
  } catch (error) {
    console.log('❌ Error occurred:');
    console.log('Error message:', error.message);
    console.log('Error stack:', error.stack);
    console.log('Error details:', error);
    
    // Check if it's a response error with details
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
  }
}

testWithdrawDirect();