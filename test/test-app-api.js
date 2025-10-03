// Simple test to debug API authentication and withdraw calls
// This mimics what the app does internally

console.log('🔍 Starting API authentication and withdraw test...');

// Test login first
async function testLoginAndWithdraw() {
  try {
    console.log('1. 📧 Testing login with demo credentials...');
    
    // Import the SolidiRestAPIClientLibrary
    const { SolidiRestAPIClientLibrary } = require('../src/api/SolidiRestAPIClientLibrary');
    
    // Create API client like the app does
    const userAgent = 'SolidiMobileApp4/dev-test';
    const domain = 'api-dev.solidi.co'; // Development domain
    
    const apiClient = new SolidiRestAPIClientLibrary({
      userAgent, 
      apiKey: '', 
      apiSecret: '', 
      domain
    });
    
    console.log('2. 🔐 Attempting login...');
    
    // Try login with demo credentials
    const loginResponse = await apiClient.privateMethod({
      httpMethod: 'POST',
      apiRoute: 'login',
      params: {
        email: 'johnqfish@foo.com',
        password: 'bigFish6'
      },
      functionName: 'test-login'
    });
    
    console.log('✅ Login response:', loginResponse);
    
    if (loginResponse && loginResponse.data && loginResponse.data.apiKey) {
      console.log('3. 🔑 Got API credentials! Testing withdraw...');
      
      // Update API client with credentials
      apiClient.apiKey = loginResponse.data.apiKey;
      apiClient.apiSecret = loginResponse.data.apiSecret;
      
      console.log('4. 🚀 Testing withdraw API call...');
      
      // Test withdraw call
      const withdrawResponse = await apiClient.privateMethod({
        httpMethod: 'POST',
        apiRoute: 'withdraw/BTC',
        params: {
          volume: '0.00001',
          address: 'tb1qumc274tp6vjd6mvldcjavjjqd2xzak00eh4ell',
          priority: 'normal'
        },
        functionName: 'test-withdraw'
      });
      
      console.log('🎉 Withdraw response:', withdrawResponse);
      
    } else {
      console.log('❌ Login failed - no API credentials received');
      console.log('Login response:', JSON.stringify(loginResponse, null, 2));
    }
    
  } catch (error) {
    console.log('💥 Error during test:', error);
    console.log('Error message:', error.message);
    console.log('Error stack:', error.stack);
  }
}

testLoginAndWithdraw();