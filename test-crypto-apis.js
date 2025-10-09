// Test multiple APIs to understand what cryptocurrencies are supported
const https = require('https');

async function makeHTTPSRequest(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    if (res.statusCode === 200) {
                        const json = JSON.parse(data);
                        resolve(json);
                    } else {
                        resolve({ error: `HTTP ${res.statusCode}`, body: data });
                    }
                } catch (error) {
                    resolve({ error: 'JSON Parse Error', body: data });
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
    });
}

async function testCryptoAPIs() {
    console.log('🔍 Testing multiple APIs to understand crypto support...\n');
    
    // Test dev server (current app configuration)
    const baseUrl = 'https://t2.solidi.co/v1';
    
    const apis = [
        { name: 'Market API', url: `${baseUrl}/market`, description: 'Available trading pairs' },
        { name: 'Asset Info API', url: `${baseUrl}/asset_info`, description: 'Supported cryptocurrencies' },
        { name: 'Ticker API', url: `${baseUrl}/ticker`, description: 'Current prices (requires auth)' }
    ];
    
    for (const api of apis) {
        console.log(`\n📊 Testing ${api.name}: ${api.description}`);
        console.log(`   URL: ${api.url}`);
        
        try {
            const result = await makeHTTPSRequest(api.url);
            
            if (result.error) {
                console.log(`   ❌ Error: ${result.error}`);
                if (result.body.includes('401')) {
                    console.log('   🔒 Requires authentication');
                } else if (result.body.includes('404')) {
                    console.log('   📍 Route not found');
                } else {
                    console.log(`   📄 Response: ${result.body.substring(0, 100)}...`);
                }
            } else {
                console.log(`   ✅ Success! Response type: ${typeof result}`);
                
                if (Array.isArray(result)) {
                    console.log(`   📋 Array with ${result.length} items:`);
                    result.slice(0, 5).forEach((item, i) => {
                        console.log(`     ${i + 1}. ${JSON.stringify(item)}`);
                    });
                    if (result.length > 5) console.log(`     ... and ${result.length - 5} more`);
                } else if (typeof result === 'object') {
                    console.log(`   📋 Object with keys: ${Object.keys(result).join(', ')}`);
                    if (Object.keys(result).length <= 5) {
                        console.log(`   📄 Full data: ${JSON.stringify(result, null, 2)}`);
                    }
                } else {
                    console.log(`   📄 Response: ${JSON.stringify(result)}`);
                }
            }
        } catch (error) {
            console.log(`   ❌ Request failed: ${error.message}`);
        }
    }
    
    console.log('\n🎯 Analysis Summary:');
    console.log('- /market API should tell us what trading pairs exist (BTC/GBP, ETH/GBP, etc.)');
    console.log('- /asset_info API should show all supported cryptocurrencies');  
    console.log('- /ticker API requires authentication but should have live prices');
    console.log('- Trade page expects: BTC, ETH, LTC, XRP vs GBP, EUR, USD');
    console.log('- Sample data suggests: BTC/GBP, ETH/GBP, BTC/EUR should work');
}

testCryptoAPIs().catch(console.error);