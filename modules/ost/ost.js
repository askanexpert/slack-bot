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
const REDEEM_ACTION_ID = "39617";

const OST_ACTIONS_WELCOME_BONUS = "welcomeBonus";
const WELCOME_BONUS_ACTION_ID = "39658";

// OST config constants
const company_uuid = "acddd83e-bd60-40d7-8184-7032234caac6";

const apiEndpoint = 'https://sandboxapi.ost.com/v1.1';
const api_key = "963276c609ac4bb5613e"; // replace with the API Key you obtained earlier
const api_secret = "3833df546c014a742520c3039032ee80a8c45887bb6bf5377206e231cc2ab886"; // replace with the API Secret you obtained earlier
const ostObj = new OSTSDK({apiKey: api_key, apiSecret: api_secret, apiEndpoint: apiEndpoint});

// OST services constants
const userService = ostObj.services.users;
const airdropService = ostObj.services.airdrops;
const transactionService = ostObj.services.transactions;
const actionService = ostObj.services.actions;
const balanceService = ostObj.services.balances;
const ledgerService = ostObj.services.ledger;
const tokenService = ostObj.services.token;

// Token related api functions
const getTokenPriceInUSD = function() {
  return tokenService.get({}).then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
    return Promise.resolve(Number(res.data.price_points.OST.USD) * 0.01);
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
    return Promise.resolve(Number(-1));
  });
}

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
  return userService.get({id})
  .then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
    return res.data.user;
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
    return err;
  });
}

const editUserWithId = function(id, newName) {
  return userService.edit({id, name: newName})
  .then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
  });
}

// TODO:- Introduce Page Number Functionality
const listAllUsers = function() {
  return userService.list({})
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
    return res;
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
    return err;
  });
}

// Transaction Related api functions
// NOTE:- Amounts specified are in USD!!!
// User-to-User transactions
const executePayTransaction = function (from, to, amount) {
  console.log("Executing Pay Transaction...");
  return transactionService.execute({
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
  console.log(from, to, amount);
  return transactionService.execute({
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
  console.log(to, amount);
  return transactionService.execute({
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
  return transactionService.execute({
    from_user_id:from,
    to_user_id:company_uuid,
    action_id:REDEEM_ACTION_ID,
    amount})
    .then(function(res) {
      console.log(JSON.stringify(res, undefined, 2));
    }).catch(function(err) {
      console.log(JSON.stringify(err, undefined, 2));
    });
}

// TODO:- Introduce Page Number Functionality
const listAllTransactions = function () {
  return transactionService.list({page_no: 1, limit: 10
  }).then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
  });
}

// Actions related api functions
const getAction = function(id) {
  return actionService.get({id}).then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
    return res.data.action;
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
    return err;
  });
}

// TODO:- Introduce Page Number Functionality
const listAllActions = function () {
  return actionService.list({}).then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
  });
}

// Airdrop related api functions
const airdropTokensToUser = function (userId, amount) {
  return airdropService.execute({amount, user_ids: userId})
  .then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
  });
}

// userIds is an array here
const airdropTokensToUsers = function (userIds, amount) {
  return airdropService.execute({amount, user_ids: userIds.join(",")})
  .then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
  });
}

const getAirdropStatus = function (id) {
  return airdropService.get({id})
  .then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
  });
}

// TODO:- Introduce Page Number Functionality
const listAllAirdrops = function() {
  return airdropService.list({
    page_no: 1, limit: 50, current_status: 'processing,complete'
  }).then(function(res) {
    console.log(JSON.stringify(res, undefined, 2));
  }).catch(function(err) {
    console.log(JSON.stringify(err, undefined, 2));
  });
}

module.exports = {
  getTokenPriceInUSD,
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
