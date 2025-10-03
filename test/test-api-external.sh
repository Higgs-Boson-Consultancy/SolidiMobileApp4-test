#!/bin/bash

# External API test using curl
# Let's test the withdraw API to see what responses we get

echo "🧪 Testing Withdraw API Endpoints..."
echo ""

# Test BTC withdraw endpoint (should get authentication error)
echo "1. Testing BTC withdraw endpoint:"
echo "POST /api2/v1/withdraw/BTC"
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "volume": "0.00001",
    "address": "tb1qumc274tp6vjd6mvldcjavjjqd2xzak00eh4ell",
    "priority": "normal"
  }' \
  https://api.solidi.co/api2/v1/withdraw/BTC \
  2>/dev/null | jq . 2>/dev/null || echo "Response (raw):"

echo ""
echo "----------------------------------------"
echo ""

# Test ETH withdraw endpoint (should get authentication error)
echo "2. Testing ETH withdraw endpoint:"
echo "POST /api2/v1/withdraw/ETH"
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "volume": "0.001",
    "address": "0x742D35Cc6abC8C38D1b31Bb0E0F8B8B72F8b4E1F",
    "priority": "normal"
  }' \
  https://api.solidi.co/api2/v1/withdraw/ETH \
  2>/dev/null | jq . 2>/dev/null || echo "Response (raw):"

echo ""
echo "----------------------------------------"
echo ""

# Test with missing parameters to see parameter validation
echo "3. Testing with missing parameters:"
echo "POST /api2/v1/withdraw/BTC (missing priority)"
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "volume": "0.00001",
    "address": "tb1qumc274tp6vjd6mvldcjavjjqd2xzak00eh4ell"
  }' \
  https://api.solidi.co/api2/v1/withdraw/BTC \
  2>/dev/null | jq . 2>/dev/null || echo "Response (raw):"

echo ""
echo "----------------------------------------"
echo ""

# Test with missing address
echo "4. Testing with missing address:"
echo "POST /api2/v1/withdraw/BTC (missing address)"
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "volume": "0.00001",
    "priority": "normal"
  }' \
  https://api.solidi.co/api2/v1/withdraw/BTC \
  2>/dev/null | jq . 2>/dev/null || echo "Response (raw):"

echo ""
echo "🏁 Test completed!"