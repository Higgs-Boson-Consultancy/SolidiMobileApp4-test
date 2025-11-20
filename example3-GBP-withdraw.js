/*
 *  Solidi NodeJS Example client
 *  GBP Withdraw
 *
 *
 * Copyright(C) 2021-2025 Solidi Ltd
 *
 */

let winston = require('winston');
global.logger = new winston.Logger({
  level: 'info',
  transports: [new (winston.transports.Console)()]
});
let solidifx = require('solidifx.js');
let program  = require('commander');
let path     = require('path');


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function message(msg) {
    console.log('\n')
    console.log("=".repeat(100))
    console.log(msg)
    console.log("=".repeat(100))
}
let print = logger.info;
let json_pretty_print = solidifx.SolidiFXAPI.json_pretty_print;


program
  .requiredOption('-k, --key <keyfile>', 'Key to use (default key.key)', 'key.key')
  .requiredOption('-s, --server <url>', 'Server/Endpoint to connect to', 't3.solidi.co')
program.parse(process.argv);
let {key, server} = program;



//
// Step 1 - Create new instance and connect to test server
//
message("Step 1 - Create new instance and connect to test server")
let userAgent = "Solidi NodeJS Example client";
let api = new solidifx.SolidiFXAPI(userAgent, null, null, keyfile=key, endpoint=server);

async function main() {

    //
    // Step 1 - Check balance of account
    //
    message("Step 1 - Check balance of account.")
    result = await api.private_method('POST', "balance", {}, {},{}, 'v2');
    result = JSON.parse(result)['data'];
    print(`JSON = `+JSON.stringify(result, null, '\t'));
    // Example result:
    // {'BTC': '0.31800000', 'GBP': '3000.00', 'LTC': '4.00000000', 'XRP': '0.000000'}
    for(let uuid in result) {
        curobj = result[uuid]
        if(curobj['acctype']==1) {
            let cur = curobj['currency'];
            let bal = curobj['cur'][cur]['balance'];
            let gbp = curobj['local_balance'];
            let rate = 0;
            if(cur!=0) {
                rate = gbp/bal;
            }
            print(`${bal} ${cur} with GBP value ${gbp} (rate=${rate})`);
        } else if (curobj['acctype']==4) {
            let gbp = curobj['local_balance'];
            print(`CryptoBasket balance = ${gbp}`);
        } else {
            print(`Unrecognised account type ${curobj['acctype']} for uuid=${uuid}`);
        }
    }
    message("Check balance of parent account - Done")

    let withdrawCurrency='GBP';

    //
    // Step 2 - Add a new withdraw address
    // 
    message("Step 2 - Add a new withdraw address.")
    addressParams = {
        'name': 'My address nickname',
        'type': 'BANK',
        'asset': 'GBP',
        'network': 'GBPFPS',
        'address': {
            'firstname': null,
            'lastname': null,
            'business': 'My Company Name',

            'accountname':   'Joe Bloggs',
            'sortcode':      '040004',
            'accountnumber': '01234567',
            'reference':     'hello',

            'dtag': null,  // Ripple only, but needed
            'vasp': null,  // If sending a a VASP
        },
        'thirdparty': false, // If sending to a third party (i.e. not your own account)
    }
    result = await api.private_method('POST', "addressBook/GBP/BANK", addressParams);
    print(json_pretty_print(result));

// Version 2.0 - we'll migrate to this eventually.
//    result = await api.private_method('POST', "addressBook/GBP/GBPFPS/BANK", addressParams, {}, {}, version='v2');
//    print(json_pretty_print(result));


    //
    // Step 3 - List the withdraw addresses
    // 
    message("Step 3 - List the withdraw addresses.")
    result = await api.private_method('GET', `addressBook/${withdrawCurrency}`, {});
    print(json_pretty_print(result));
    // Store addresses for next step
    let addresses = JSON.parse(result)['data'];


    //
    // Step 4 - List the withdraw fees
    //
    message("Step 4 - List the withdraw fees.")
    result = await api.private_method('POST', 'fee', {});
    print(json_pretty_print(result));
    withdraw_fee = JSON.parse(result)['data'][withdrawCurrency]['withdraw']['lowFee'];

    //
    // Step 5 - Queue a GBP withdraw.
    // 
    message("Step 5 - Queue a withdraw.")
    qty = '2'; // Amount to withdraw in GBP
    qty_minus_fee = parseFloat(qty)-parseFloat(withdraw_fee)
    priority = 'low';
    uuid = addresses[addresses.length-1]['uuid'];
    params = {
        'address': uuid,
        'volume': qty_minus_fee.toString(),
        'priority': priority,
    }
    result = await api.private_method('POST', `withdraw/${withdrawCurrency}`, params);
    print(json_pretty_print(result));
}

async function asyncMain() {
    try {
        await main();
    } catch (e) {
        print('Error = '+e.stack);
        return;
    }
}
asyncMain();


