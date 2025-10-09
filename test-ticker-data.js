// Quick ticker data inspection
const https = require('https');

async function testTicker() {
    console.log('🔍 Testing /ticker API data structure...');
    
    const url = 'https://t2.solidi.co/v1/ticker';
    
    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    console.log('📊 Raw API Response:');
                    console.log(JSON.stringify(json, null, 2));
                    
                    console.log('\n🔍 Data structure analysis:');
                    console.log('Response type:', typeof json);
                    console.log('Has error field:', 'error' in json);
                    console.log('Has data field:', 'data' in json);
                    
                    if (json.data) {
                        console.log('\n📈 Markets in data field:');
                        Object.keys(json.data).forEach(market => {
                            console.log(`  ${market}:`, json.data[market]);
                        });
                    } else {
                        console.log('\n📈 Top-level markets:');
                        Object.keys(json).forEach(key => {
                            if (key !== 'error') {
                                console.log(`  ${key}:`, json[key]);
                            }
                        });
                    }
                    
                    resolve(json);
                } catch (error) {
                    console.log('❌ JSON Parse Error:', error);
                    console.log('Raw data:', data);
                    reject(error);
                }
            });
        });
        
        req.on('error', (error) => {
            console.log('❌ Request Error:', error);
            reject(error);
        });
    });
}

testTicker().catch(console.error);