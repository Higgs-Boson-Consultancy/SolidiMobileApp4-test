/*
 *  Solidi NodeJS Example client
 *
 *
 * Copyright(C) 2021-2024 Solidi Ltd
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
  .requiredOption('-e, --email <email>', 'Email address of the new subuser', 'someone@gmail.com')
  .requiredOption('-s, --server <url>', 'Server/Endpoint to connect to', 't3.solidi.co')
program.parse(process.argv);
let {key, email, server} = program;



//
// Step 1 - Create new instance and connect to test server
//
message("Step 1 - Create new instance and connect to test server")
let userAgent = "Solidi NodeJS Example client";
let api = new solidifx.SolidiFXAPI(userAgent, null, null, keyfile=key, endpoint=server);

async function main() {
	//
	// Step 2 - Test connect to public API method
	//
	message("Step 2 - Test connect to public API method")
	let result = await api.public_method('GET', 'hello', {});
	console.log(result);
	print(json_pretty_print(result));

	//
	// Step 2b - Connect to the private API and retrieve our account details
	//
	message("Step 2b - Connect to the private API and retrieve our account details")
	result = await api.private_method('POST', 'user', {});
	console.log(result);
	print(json_pretty_print(result));

	//
	// Step 3 -  Sign up a new sub account
	//
	message("Step 3 - Sign up a new sub account")
	signupemail = email
	params = {
		'userData': {
			"email": email,
			"firstName": "Test",
			"lastName": "Person",
			"dateOfBirth": "08/08/2000",
			"gender": "Male",
			"citizenship":"GB",
			"password": "123456Qq",
			"mobileNumber": "07781234567",
			"emailPreferences": [
				'newsAndFeatureUpdates',
				'promotionsAndSpecialOffers',
			],
		}
	}
	try {
		result = await api.private_method('POST', "register_sub_user/"+signupemail, params)
		print(json_pretty_print(result));
	} catch (e) {
		logger.error(e);
	}

	//
	// Step 4 - List of sub accounts
	//
	message("Step 4 - List of sub accounts")
	result = await api.private_method('POST', "subusers", {})
	print(json_pretty_print(result));
	result = JSON.parse(result)
	if (result['error']) {
		logger.error(result['error'])
		process.exit(1);
	}
	subusers = result['data']
	for(var i in subusers) {
		let user = subusers[i];
		logger.info(JSON.stringify(user));
	}
	subuser_uuid = subusers[subusers.length -1]["uuid"];
	
	
	//
	// Step 5 - List the API keys for the account we've just created
	//
	message("Step 5 - List of API keys for the sub account")
	result = await api.private_method('POST', "apikey/"+subuser_uuid, {})
	// Take a copy of the first API key/secret for the new sub account.
	print(json_pretty_print(result))
	result = JSON.parse(result)
	if (result['error']) {
		print(`Error = ${result['error']}`)
		process.exit(1);
	}
	result = result['data']
	let apikey = result[0]['apikey'];
	let apisecret = result[0]['apisecret'];

	//
	// Step 6 - Switch to the new sub account (using the API key retrieved in previous step)
	//
	message("Step 6 - Switch to the new sub account (using the API key retrieved in previous step)")
	subuser_api = new solidifx.SolidiFXAPI(userAgent, apikey, apisecret, keyfile=null, endpoint=server)

	//
	// Step 7 - Update the details of the sub account ready for the ID check
	// 
	message("Step 7 - Update the details of the sub account ready for the ID check")
	updateUser = {
		'firstName' : "Ronnie",
		'address_1' : "10 Baker Street",
		'address_2' : "London",
		'address_3' : "",
		'address_4' : "",
		'postcode'  : "NW1 6XE",
		'mobile'    : "07786573602",
	};
	result = await api.private_method('POST', "update_user", {'userData':updateUser,'params':{'uuid':subuser_uuid}}, {}, {})
	print(result);
	result = JSON.parse(result)
	if (result['error']) {
		print(`Error = ${result['error']}`);
		process.exit(1);
	}

	//
	// Step 8- Update bank account details (for payouts)
	//
	message("Step 8 - Update bank account details (for payouts)")
	updateGBPAccount = {
		'sortCode'     : '12-34-56',
		'accountNumber': '12345678',
		'accountName'  : 'Test Person',
	}
	result = await subuser_api.private_method('POST', "default_account/GBP/update", updateGBPAccount);
	print("Result = "+json_pretty_print(result));
	

	//
	// Step 9 - Upload ID docs
	//
	message("Step 9 - Upload local iddoc.jpeg as an ID document")
	fileurl = path.resolve(__dirname,'iddoc.jpeg');
	files = {'media': fileurl}
	result = await subuser_api.private_method('POST', "upload/iddoc/poa", {}, files=files );
	print("Result = "+json_pretty_print(result));


	//
	// Step 10 - Wait to see if user becomes ID verified.
	//
	message("Step 10 - Wait to see if user becomes ID verified.")
	count = 0;
	while(true) {
		result = await subuser_api.private_method('POST', "user/", {});
		print(json_pretty_print(result))
		result = JSON.parse(result)
		if (result['error']) {
			print(`Error = ${result['error']}`)
			process.exit(1);
		}
		if (parseInt(result['data']['tier'])>=3) {
			print("User is ID checked");
			break;
		}	else {
			if (count<=0) {
				print("Giving up....");
				break;
			}
			print("User not ID checked, waiting")
		}
		await sleep(1000);
		count=count-1;
	}

	//
	// Step 11 - Set new user as ID verified (workaround)
	//
	message("Step 11 - Set new user as ID verified (workaround)")
	// Temporary dev workaround to get past ID checking users - this will not work in production.
	// Update the new users 'status' to include bit 5 (0x10) set - this indicates they are ID checked which allows them to deposit funds / trade.
	// In a complete system, you would need to stop at this point and wait for Solidi to complete the ID check.
	updateUser = {'status': 0x01 | 0x02 | 0x10, 'tier': 3 } // Active + Phone confirmed + ID checked
	result = await api.private_method('PUT', "user/"+subuser_uuid, {'user':updateUser}, {}, {}, "v0")
	print("Result = "+json_pretty_print(result));
	
	//
	// Step 12 - Check balance of parent account
	//
	message("Step 12 - Check balance of parent account.")
	result = await api.private_method('POST', "balance", {});
	result = JSON.parse(result)['data'];
	print(`JSON = `+JSON.stringify(result, null, '\t'));
	// Example result:
	// {'BTC': '0.31800000', 'GBP': '3000.00', 'LTC': '4.00000000', 'XRP': '0.000000'}
	for(let asset in result) {
		balance = result[asset]
		print(`${asset} balance = ${balance}`)
	}
	message("Check balance of parent account - Done")

	//
	// Step 13 - Get the deposit details for the sub account - including the reference specific to the sub account & generate a lightning invoice.
	//
	message("Step 13 - Get the deposit details for the sub account - including the reference specific to the sub account")
	result = await subuser_api.private_method('POST', "deposit_details/GBP", {});
	print(json_pretty_print(result));
	result = await subuser_api.private_method('POST', "deposit_details/BTC", {});
	print(json_pretty_print(result));
	result = await subuser_api.private_method('POST', "deposit_details/XRP", {});
	print(json_pretty_print(result));
	result = await subuser_api.private_method('POST', "deposit_details/BTC/LIGHTNING/1500/", {'note':'Payment for food and drinks'});
	print(json_pretty_print(result));
	
	//
	// Step 14 - Transfer parent to sub account (simulate a deposit)
	//
	message("Step 14 - Transfer BTC from parent to sub account (the same result as a deposit)")
	// Execute a transfer from the parent account to the sub account (this is the equavalent of processing a customer deposit)
	// Generate a withdraw to the UUID of the sub account - note that this gets called on 'api' not 'subuser_api'.
	withdrawArgs = {
		'cur'         :'BTC',
		'volume'      : 0.02,                    // Amount in BTC
		'uuid'        : subuser_uuid,
	}
	result = await api.private_method('POST', "transfer/BTC/", withdrawArgs);
	print(json_pretty_print(result));
	
	
	//
	// Step 15 - Get a quote for a sell of crypto to realise Â£10 GBP (private - best_volume_price)
	//
	message("Step 15 - Get a quote for a sell of crypto to realise Â£10 GBP (private)")
	quoteVol = "10"
	params = {
		'side':  'SELL',
		'quoteAssetVolume': quoteVol,
		'baseOrQuoteAsset': 'quote'
	}
	result = await subuser_api.private_method('POST', "best_volume_price/BTC/GBP", params);
	print(json_pretty_print(result));
	baseVol = JSON.parse(result)['data']['price']

	//
	// Step 16 - Execute a sell back to bank account
	//
	message("Step 16 - Execute a sell to bank account")
	sellParams = {
		'market':'BTC/GBPX',
		'baseAssetVolume': baseVol,
		'quoteAssetVolume': quoteVol,
		'orderType': 'IMMEDIATE_OR_CANCEL',
		'paymentMethod': 'bank'
	}
	result = await subuser_api.private_method('POST', "sell", sellParams);
	print(json_pretty_print(result));
	
	//
	// Step 17 - Check balance of child account
	//
	message("Step 17 - Check balance of child account.")
	result = await subuser_api.private_method('POST', "balance", {});
	print(json_pretty_print(result));
	result = JSON.parse(result)['data'];
	// Example result:
	// {'BTC': '0.31800000', 'GBP': '3000.00', 'LTC': '4.00000000', 'XRP': '0.000000'}
	for(let asset in result) {
		balance = result[asset]
		print(`${asset} balance = ${balance}`)
	}

	//
	// Step 18 - Add a new withdraw address
	// 
	message("Step 18 - Add a new withdraw address.")
	addressParams = {
		'name': 'My address nickname',
		'asset': 'BTC',
		'network': 'BTC', // or 'LIGHTNING',
		'address': {
			'firstname': null,
			'lastname': null,
			'business': 'My Company Name',
			'address': 'xyz-bitcoin-address',
			'dtag': null,  // Ripple only, but needed
			'vasp': null,  // If sending a a VASP
		},
		'thirdparty': false, // If sending to a third party (i.e. not your own account)
	}
	result = await subuser_api.private_method('POST', "addressBook/BTC/CRYPTO_UNHOSTED", addressParams);
	print(json_pretty_print(result));

	//
	// Step 19 - List the withdraw addresses
	// 
	message("Step 19 - List the withdraw addresses.")
	result = await subuser_api.private_method('GET', "addressBook/BTC", {});
	print(json_pretty_print(result));
	// Store addresses for next step
	let addresses = JSON.parse(result)['data'];

	//
	// Step 20a - List the withdraw fees
	//
	message("Step 20a - List the withdraw fees.")
	result = await subuser_api.private_method('POST', 'fee', params);
	print(json_pretty_print(result));
	btc_fee = JSON.parse(result)['data']['BTC']['withdraw']['lowFee'];

	//
	// Step 20b - Queue a withdraw.
	// 
	message("Step 20b - Queue a withdraw.")
	let addressIndex = addresses.length-1;
	uuid = addresses[addressIndex]['uuid']
	qty = '0.01'; // Amount to withdraw in BTC
	qty_minus_fee = parseFloat(qty)-parseFloat(btc_fee)
	priority = 'low';
	params = {
		'address': uuid,
		'volume': qty_minus_fee.toString(),
		'priority': priority,
	}
	result = await subuser_api.private_method('POST', 'withdraw', params);
	print(json_pretty_print(result));

	//
	// Step 21 - Delete an address book entry.
	// 
	message("Step 21 - Delete an address.")
	print(`Deleting address ${uuid}`)
	result = await subuser_api.private_method('DELETE', "addressBook/delete/"+uuid, {});
	print(json_pretty_print(result));


	//
	// Step 22 - List / Search the txns in the child account.
	//
	message("Step 22 - Search the txns - Limit to 2 txns/page, get the second page (txns 3-4)")
	params = {
		'search':[
			{
			}
		],
		'limit': 2,
		'offet': 2,
	}
	result = await subuser_api.private_method('POST', "transaction", params)
	print(json_pretty_print(result));
	result = JSON.parse(result)
	if (result['error']) {
		logger.error(result['error'])
		process.exit(1);
	}
	// Check we get 6 results (even through we've limited the total returned to just 2 results).
	if(result['data']['total']!=6) {
		logger.error("Expected 6 results - did we definitely run this with a new user? (we got "+result['data']['total']+" results)");
		process.exit(1);
	}

	message("Step 23 - Search for txns including the word 'Transfer'")
	params = {
		'search':[
			{
				'search': 'Transfer'
			}
		],
		'limit': 10,
	}
	result = await subuser_api.private_method('POST', "transaction", params)
	print(json_pretty_print(result));
	result = JSON.parse(result)
	if (result['error']) {
		logger.error(result['error'])
		process.exit(1);
	}
	if(result['data']['total']!=3) {
		logger.error("Expected 3 results");
		process.exit(1);
	}

	message("Step 24 - Search for txns with a baseAssetVolume greater than 9.5 and less than 10")
	params = {
		'search':[
			{
				'min':9.50,
				'max':10.00,
				'col':'baseAssetVolume',
			}
		],
		'limit': 10,
	}
	result = await subuser_api.private_method('POST', "transaction", params)
	print(json_pretty_print(result));
	result = JSON.parse(result)
	if (result['error']) {
		logger.error(result['error'])
		process.exit(1);
	}
	if(result['data']['total']!=1) {
		logger.error("Expected 1 results");
		process.exit(1);
	}

	message("Step 25 - Search for txns and sort by txn code and baseAssetVolume")
	params = {
		'search':[
			{
			}
		],
		'sort': ['code','baseAssetVolume'],
		'order': ['ASC','DESC'],
		'limit': 10,
	}
	result = await subuser_api.private_method('POST', "transaction", params)
	print(json_pretty_print(result));
	result = JSON.parse(result)
	if (result['error']) {
		logger.error(result['error'])
		process.exit(1);
	}
	if(result['data']['total']!=6) {
		logger.error("Expected 6 results - did we definitely run this with a new user? (we got "+result['data']['total']+" results)");
		process.exit(1);
	}
}
main();
I 