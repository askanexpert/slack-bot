OSTSDK = require('@ostdotcom/ost-sdk-js');

// User Action Constants
const OST_ACTIONS_PAY_EXPERT = "pay";
const OST_ACTIONS_SCHEDULE_CHAT_WITH_EXPERT = "schedule";
const OST_ACTIONS_PURCHASE_TOKENS = "purchase";
const OST_ACTIONS_REDEEM_TOKENS = "redeem";
const OST_ACTIONS_WELCOME_BONUS = "welcomeBonus";

// OST config constants
const apiEndpoint = 'https://sandboxapi.ost.com/v1.1';
const api_key = process.env.OST_API_KEY; // replace with the API Key you obtained earlier
const api_secret = process.env.OST_API_SECRET; // replace with the API Secret you obtained earlier
const ostObj = new OSTSDK({apiKey: api_key, apiSecret: api_secret, apiEndpoint: apiEndpoint});

// OST services constants
const userService = ostObj.services.users;
const airdropService = ostObj.services.airdrops;
const transactionService = ostObj.services.transactions;
const balanceService = ostObj.services.balances;
const ledgerService = ostObj.services.ledger;

// User related api functions
const createNewUser = function (name) {
  console.log(`Creating new user with name ${name}`);
  return userService.create({name})
  .then(function(a){
    console.log(JSON.stringify(a, undefined, 2))
  }).catch(console.log);
}

const getUserWithId = function (id) {
  userService.get({id})
  .then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
  });
}

const editUserWithId = function(id, newName) {
  userService.edit({id, name: newName})
  .then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
  });
}

const getAllUsers = function() {
  userService.list({})
  .then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
  });
}

// Wallet related api functions
const showBalanceForUser = function(id) {
  balanceService.get({id})
  .then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
  });
}

const showLedgerForUser = function (id) {
  ledgerService.get({id})
  .then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
  });
}

// Transaction Related api functions

// User-to-User transactions
const executePayTransaction = function (from, to, amount) {

}

const executeScheduleTransaction = function(from, to, amount) {
  // amount is 5% of expert's hourly fees here

}

// Company-to-User transactions
const executePurchaseTransaction = function(to, amount) {
  // from is company id
}
// Amount is fixed here at $1.00
const executeWelcomeBonusTransaction = function(to) {
  // from is company id
}

// User-to-Company transactions
const executeRedeemTransaction = function(from, amount) {
  // to is company id
}



// Airdrop related api functions
const airdropTokensToUser = function (amount, userId) {
  airdropService.execute({amount, user_ids: userId})
  .then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
  });
}

// userIds is an array here
const airdropTokensToUsers = function (amount, userIds) {
  airdropService.execute({amount, user_ids: userIds.join(",")})
  .then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
  });
}

const getAirdropStatus = function (id) {
  airdropService.get({id})
  .then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
  });
}

const listAllAirdrops = function() {
  airdropService.list({
    page_no: 1, limit: 50, current_status: 'processing,complete'
  }).then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
  });
}

module.exports = {
  createNewUser,
  getUserWithId,
  editUserWithId,
  getAllUsers,
  showBalanceForUser,
  showLedgerForUser,
  executePayTransaction,
  executeScheduleTransaction,
  executePurchaseTransaction,
  executeRedeemTransaction,
  executeWelcomeBonusTransaction,
  airdropTokensToUser,
  airdropTokensToUsers,
  getAirdropStatus,
  listAllAirdrops
}
