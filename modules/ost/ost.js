OSTSDK = require('@ostdotcom/ost-sdk-js');

// Sample users
// 17d1187e-6455-4930-afb6-bdc1b7ef27c7
// 2c4d3b38-2103-4303-a68b-e9a569a7a183

// User Action Constants
const OST_ACTIONS_PAY_EXPERT = "pay";
const PAY_ACTION_ID = "39619";

const OST_ACTIONS_SCHEDULE_CHAT_WITH_EXPERT = "schedule";
const SCHEDULE_ACTION_ID = "39620";

const OST_ACTIONS_PURCHASE_TOKENS = "purchase";
const PURCHASE_ACTION_ID = "39618";

const OST_ACTIONS_REDEEM_TOKENS = "redeem";
const REDEEM__ACTION_ID = "39617";

const OST_ACTIONS_WELCOME_BONUS = "welcomeBonus";
const WELCOME_BONUS_ACTION_ID = "39658";

// OST config constants
const company_uuid = "acddd83e-bd60-40d7-8184-7032234caac6";

const apiEndpoint = 'https://sandboxapi.ost.com/v1.1';
const api_key = process.env.OST_API_KEY; // replace with the API Key you obtained earlier
const api_secret = process.env.OST_API_SECRET; // replace with the API Secret you obtained earlier
const ostObj = new OSTSDK({apiKey: api_key, apiSecret: api_secret, apiEndpoint: apiEndpoint});

// OST services constants
const userService = ostObj.services.users;
const airdropService = ostObj.services.airdrops;
const transactionService = ostObj.services.transactions;
const actionService = ostObj.services.actions;
const balanceService = ostObj.services.balances;
const ledgerService = ostObj.services.ledger;

// User related api functions
const createNewUser = function (name) {
  console.log(`Creating new user with name ${name}`);
  return userService.create({name})
  .then(function(a){
    // console.log(a.data.user);
    // console.log(JSON.stringify(a, undefined, 2));
    return a.data.user;
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

// TODO:- Introduce Page Number Functionality
const listAllUsers = function() {
  userService.list({})
  .then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
  });
}

// Wallet related api functions
const getBalanceForUser = function(id) {
  return balanceService.get({id})
  .then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
    return res;
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
    return err;
  });
}

const getLedgerForUser = function (id) {
  return ledgerService.get({id})
  .then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
  });
}

// Transaction Related api functions
// NOTE:- Amounts specified are in USD!!!
// User-to-User transactions
const executePayTransaction = function (from, to, amount) {
  transactionService.execute({
    from_user_id:from,
    to_user_id:to,
    action_id:PAY_ACTION_ID,
    amount})
    .then(function(res) {
      console.log(JSON.stringify(res, undefined, 2));
    }).catch(function(err) {
      console.log(JSON.stringify(err, undefined, 2));
    });
}

const executeScheduleTransaction = function(from, to, amount) {
  transactionService.execute({
    from_user_id:from,
    to_user_id:to,
    action_id:SCHEDULE_ACTION_ID,
    amount})
    .then(function(res) {
      console.log(JSON.stringify(res, undefined, 2));
    }).catch(function(err) {
      console.log(JSON.stringify(err, undefined, 2));
    });
}

// Company-to-User transactions
const executePurchaseTransaction = function(to, amount) {
  transactionService.execute({
    from_user_id:company_uuid,
    to_user_id:to,
    action_id:PURCHASE_ACTION_ID,
    amount})
    .then(function(res) {
      console.log(JSON.stringify(res, undefined, 2));
    }).catch(function(err) {
      console.log(JSON.stringify(err, undefined, 2));
    });
}

// Amount is fixed here at $1.00
const executeWelcomeBonusTransaction = function(to) {
  return transactionService.execute({
    from_user_id:company_uuid,
    to_user_id:to,
    action_id:WELCOME_BONUS_ACTION_ID})
    .then(function(res) {
      console.log(JSON.stringify(res, undefined, 2));
    }).catch(function(err) {
      console.log(JSON.stringify(err, undefined, 2));
    });
}

// User-to-Company transactions
const executeRedeemTransaction = function(from, amount) {
  transactionService.execute({
    from_user_id:from,
    to_user_id:company_uuid,
    action_id:REDEEM__ACTION_ID,
    amount})
    .then(function(res) {
      console.log(JSON.stringify(res, undefined, 2));
    }).catch(function(err) {
      console.log(JSON.stringify(err, undefined, 2));
    });
}

// TODO:- Introduce Page Number Functionality
const listAllTransactions = function () {
  transactionService.list({page_no: 1, limit: 10
  }).then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
  });
}

// Actions related api functions
const getAction = function(id) {
  actionService.get({id}).then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
  });
}

// TODO:- Introduce Page Number Functionality
const listAllActions = function () {
  actionService.list({}).then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
  });
}

// Airdrop related api functions
const airdropTokensToUser = function (userId, amount) {
  airdropService.execute({amount, user_ids: userId})
  .then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
  });
}

// userIds is an array here
const airdropTokensToUsers = function (userIds, amount) {
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

// TODO:- Introduce Page Number Functionality
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
  listAllUsers,
  getBalanceForUser,
  getLedgerForUser,
  executePayTransaction,
  executeScheduleTransaction,
  executePurchaseTransaction,
  executeRedeemTransaction,
  executeWelcomeBonusTransaction,
  listAllTransactions,
  getAction,
  listAllActions,
  airdropTokensToUser,
  airdropTokensToUsers,
  getAirdropStatus,
  listAllAirdrops
}
