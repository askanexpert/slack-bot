const OST_ACTIONS_PAY_EXPERT = "pay";
const OST_ACTIONS_SCHEDULE_CHAT_WITH_EXPERT = "schedule";
const OST_ACTIONS_PURCHASE_TOKENS = "purchase";
const OST_ACTIONS_REDEEM_TOKENS = "redeem";


// User related api functions
const createNewUser = function (email, password) {
  console.log('Creating new user...');
}

// Wallet related api functions
const showBalanceForUser = function() {

}

const showLedgerForUser = function () {

}

// Transaction Related api functions
const executeOSTActionForUser = function(type) {
    switch(type) {
      case OST_ACTIONS_PAY_EXPERT:
        console.log(`Executing pay user action...`);
      case OST_ACTIONS_SCHEDULE_CHAT_WITH_EXPERT:
        console.log(`Executing schedule user action...`);
      case OST_ACTIONS_PURCHASE_TOKENS:
        console.log(`Executing purchase user action...`);
      case OST_ACTIONS_REDEEM_TOKENS:
        console.log(`Executing redeem user action...`);
      default:
        console.log(`Action provided does not match specs`);
        break;
    }
}



module.exports = {
  createNewUser,
  showBalanceForUser,
  showLedgerForUser,
  executeOSTActionForUser
}
