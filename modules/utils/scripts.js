var sleep = require('sleep');
const mongoose = require("mongoose");
const ost = require('../ost/ost');
const utils = require('./utils');
const {User} = require('../../models/user');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/AAEApp");

const createMockUser = function(i) {
  if(i == 500) { return }
  var name = `AAEUser${i}`;
  ost.createNewUser(name).then((user) => {
    var mongoUser = new User(user);
    mongoUser.email = `${name}@aae.com`;
    mongoUser.ost_id = user.id;
    mongoUser.save().then((user) => {
      console.log("User created!");
      ost.executeWelcomeBonusTransaction(user.ost_id).then(() => {
        createMockUser(i+1);
      });
    });
  });
  sleep.sleep(3); // sleep for 3s
}

const executeRedeemTransaction = function(i) {
  if(i == 500) { return }
  var name = `AAEUser${i}`;
  var email = `${name}@aae.com`;
  User.findOne({email}).then((user) => {
    console.log("User found!");
    ost.executeRedeemTransaction(user.ost_id, 50).then(() => {
      console.log(`Redeemed for user ${name}`);
      executeRedeemTransaction(i+1);
    })
  })
  sleep.sleep(3);
}

const executePurchaseTransaction = function(i) {
  if(i == 500) { return }
  var name = `AAEUser${i}`;
  var email = `${name}@aae.com`;
  User.findOne({email}).then((user) => {
    console.log("User found!");
    ost.executePurchaseTransaction(user.ost_id, 10).then(() => {
      console.log(`Purchase for user ${name}`);
      executePurchaseTransaction(i+1);
    })
  })
  sleep.sleep(3);
}

const executeScheduleTransaction = function(i) {
  if(i == 500) { return }
  var name = `AAEUser${i}`;
  var email = `${name}@aae.com`;
  User.findOne({email}).then((user) => {
    console.log("User found!");
    ost.executeScheduleTransaction(
      user.ost_id, "a1fcf1b4-b84f-4fe2-9a80-38fbfa7e0dbf", 10).then(() => {
      console.log(`Scheduled to Tejas Nikumbh for ${name}`);
      executeScheduleTransaction(i+1);
    })
  })
  sleep.sleep(3);
}

const executePayTransaction = function(i) {
  if(i == 500) { return }
  var name = `AAEUser${i}`;
  var email = `${name}@aae.com`;
  User.findOne({email}).then((user) => {
    console.log("User found!");
    ost.executePayTransaction(
      user.ost_id, "5b3931ad-0a47-48e6-8d77-bcc7f57ba531", 10).then(() => {
      console.log(`Paid to Ravi Shankar for ${name}`);
      executePayTransaction(i+1);
    })
  })
  sleep.sleep(3);
}

module.exports = {
  createMockUser,
  executeRedeemTransaction,
  executePurchaseTransaction,
  executeScheduleTransaction,
  executePayTransaction
}
