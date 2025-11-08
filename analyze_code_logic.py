#!/usr/bin/env python3
"""
Code Logic and Algorithm Analyzer for Solidi Mobile App
Extracts and documents key algorithms, business logic, and architectural patterns
"""

import os
import re
import json
from collections import defaultdict

PROJECT_ROOT = '/Users/henry/Solidi/SolidiMobileApp4'

def analyze_authentication_logic(file_path):
    """Extract authentication and security logic"""
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    findings = {
        'hmac_signing': [],
        'login_flow': [],
        'biometric_auth': [],
        'credential_storage': []
    }
    
    # Find HMAC signature generation
    hmac_patterns = [
        r'(createHmac.*?\.digest.*?)',
        r'(HmacSHA256.*?)',
        r'(generateSignature.*?{[\s\S]{100,1000}?})',
    ]
    
    for pattern in hmac_patterns:
        matches = re.finditer(pattern, content, re.MULTILINE)
        for match in matches:
            findings['hmac_signing'].append(match.group(1)[:200])
    
    # Find login flow
    if 'login_mobile' in content or 'this.login' in content:
        login_match = re.search(r'(this\.login\s*=.*?{[\s\S]{200,2000}?})', content)
        if login_match:
            findings['login_flow'].append('login_function_found')
    
    # Find biometric/PIN logic
    if 'biometric' in content.lower() or 'pincode' in content.lower():
        findings['biometric_auth'].append('biometric_auth_present')
    
    # Find credential storage
    if 'Keychain' in content or 'AsyncStorage' in content:
        findings['credential_storage'].append('credential_storage_found')
    
    return findings

def analyze_trading_algorithms(file_path):
    """Extract trading and order logic"""
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    findings = {
        'buy_logic': [],
        'sell_logic': [],
        'price_calculation': [],
        'order_validation': []
    }
    
    # Find buy/sell functions
    buy_match = re.search(r'(sendBuyOrder.*?{[\s\S]{200,1500}?})', content)
    if buy_match:
        findings['buy_logic'].append('buy_order_logic_found')
    
    sell_match = re.search(r'(sendSellOrder.*?{[\s\S]{200,1500}?})', content)
    if sell_match:
        findings['sell_logic'].append('sell_order_logic_found')
    
    # Find price calculations
    price_patterns = [
        r'(calculateGBPValue.*?)',
        r'(best_volume_price.*?)',
        r'(volume_price.*?)',
    ]
    
    for pattern in price_patterns:
        if re.search(pattern, content):
            findings['price_calculation'].append(pattern)
    
    return findings

def analyze_wallet_logic(file_path):
    """Extract wallet and balance management logic"""
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    findings = {
        'balance_calculation': [],
        'withdrawal_logic': [],
        'address_validation': [],
        'fee_calculation': []
    }
    
    # Find balance logic
    if 'loadBalances' in content or 'getBalanceData' in content:
        findings['balance_calculation'].append('balance_logic_found')
    
    # Find withdrawal logic
    withdraw_match = re.search(r'(sendWithdraw.*?{[\s\S]{200,1500}?})', content)
    if withdraw_match:
        findings['withdrawal_logic'].append('withdraw_logic_found')
    
    # Find address validation
    if 'validateAddress' in content or 'isValidAddress' in content:
        findings['address_validation'].append('address_validation_found')
    
    # Find fee calculation
    if 'loadFees' in content or 'calculateFee' in content:
        findings['fee_calculation'].append('fee_calculation_found')
    
    return findings

def analyze_state_management(file_path):
    """Extract state management patterns"""
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    findings = {
        'navigation_logic': [],
        'state_transitions': [],
        'caching_strategy': [],
        'error_handling': []
    }
    
    # Find navigation
    if 'navigateTo' in content or 'changeMainPanelState' in content:
        findings['navigation_logic'].append('navigation_logic_found')
    
    # Find state transitions
    state_patterns = [
        r'(changeMainPanelState.*?)',
        r'(setState.*?)',
    ]
    
    for pattern in state_patterns:
        if re.search(pattern, content):
            findings['state_transitions'].append(pattern)
    
    # Find caching
    if 'cache' in content.lower() or 'AsyncStorage' in content:
        findings['caching_strategy'].append('caching_found')
    
    # Find error handling
    if 'try.*catch' in content or 'catch' in content:
        findings['error_handling'].append('error_handling_present')
    
    return findings

def extract_key_functions(file_path):
    """Extract key function signatures and purposes"""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        functions = []
        
        # Pattern for function definitions
        patterns = [
            r'(this\.\w+\s*=\s*async\s*\([^)]*\)\s*=>)',
            r'(const\s+\w+\s*=\s*async\s*\([^)]*\)\s*=>)',
            r'(function\s+\w+\s*\([^)]*\))',
        ]
        
        for pattern in patterns:
            matches = re.finditer(pattern, content)
            for match in matches:
                functions.append(match.group(1))
        
        return functions[:50]  # Limit to first 50
    except:
        return []

def main():
    print("=" * 80)
    print("CODE LOGIC & ALGORITHM ANALYZER")
    print("=" * 80)
    
    # Key files to analyze
    key_files = {
        'AppState': 'src/application/data/AppState.js',
        'SolidiRestAPI': 'src/api/SolidiRestAPIClientLibrary.js',
        'Home': 'src/application/SolidiMobileApp/components/MainPanel/components/Home/Home.js',
        'Wallet': 'src/application/SolidiMobileApp/components/MainPanel/components/Assets/Assets.js',
        'Buy': 'src/application/SolidiMobileApp/components/MainPanel/components/Buy/Buy.js',
        'Sell': 'src/application/SolidiMobileApp/components/MainPanel/components/Sell/Sell.js',
    }
    
    analysis_results = {}
    
    for name, rel_path in key_files.items():
        file_path = os.path.join(PROJECT_ROOT, rel_path)
        if not os.path.exists(file_path):
            print(f"⚠️  {name}: File not found")
            continue
        
        print(f"\n📄 Analyzing {name}...")
        
        result = {
            'file': rel_path,
            'size': os.path.getsize(file_path),
            'lines': len(open(file_path).readlines())
        }
        
        # Analyze different aspects
        if 'AppState' in name or 'API' in name:
            result['authentication'] = analyze_authentication_logic(file_path)
            result['state_mgmt'] = analyze_state_management(file_path)
        
        if 'Buy' in name or 'Sell' in name or 'Home' in name:
            result['trading'] = analyze_trading_algorithms(file_path)
        
        if 'Wallet' in name or 'Assets' in name or 'AppState' in name:
            result['wallet'] = analyze_wallet_logic(file_path)
        
        # Extract key functions
        result['key_functions'] = extract_key_functions(file_path)
        
        analysis_results[name] = result
        
        print(f"   ✅ {result['lines']} lines analyzed")
    
    # Save results
    output_file = os.path.join(PROJECT_ROOT, 'code_analysis_results.json')
    with open(output_file, 'w') as f:
        json.dump(analysis_results, f, indent=2)
    
    print(f"\n📄 Analysis results saved to: code_analysis_results.json")
    
    # Print summary
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    
    total_lines = sum(r['lines'] for r in analysis_results.values())
    print(f"Total lines analyzed: {total_lines:,}")
    print(f"Files analyzed: {len(analysis_results)}")
    
    print("\n✅ Analysis complete!")

if __name__ == '__main__':
    main()
