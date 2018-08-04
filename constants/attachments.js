const ost = require('../modules/ost/ost');
const utils = require('../modules/utils/utils');
const {User} = require('../models/user');
const {Expert} = require('../models/expert');

const company_uuid = "acddd83e-bd60-40d7-8184-7032234caac6";

// constants
const welcomeBonus = {
    "fallback": "Welcome Bonus!",
    "color": "#36a64f",
    "pretext": "",
    "fields": [
        {
            "title": "Welcome bonus deposited",
            "value": "Congrats! I've deposited 100 AETOs into your aae account.",
            "short": false
        }
    ],
    "footer": "You can see further details on how to view balance by typing 'help'"
};

const helpView = {
    "fallback": "Summary of commands that I understand. I'm dumb!",
    "color": "#36a64f",
    "pretext": "Here's a list of view commands that I support",
    "author_name": "View Commands",
    "author_link": "http://flickr.com/bobby/",
    "author_icon": "http://flickr.com/icons/bobby.jpg",
    "title": "Slack BOT Command Spec",
    "title_link": "https://github.com/askanexpert/slack-bot/blob/master/README.md",
    "text": "",
    "fields": [
        {
            "title": "show_my_profile",
            "value": "Shows user's profile on the platform",
            "short": false
        },
        {
            "title": "show_expert_list for <topic name>",
            "value": "Shows list of all experts on the platform for the topic",
            "short": false
        },
        {
            "title": "show_balance ",
            "value": "Shows the wallet balance of your account",
            "short": false
        },
        {
            "title": "show_history",
            "value": "Shows your chat session payment history",
            "short": false
        }
      ]
    }

const helpTransactions = {
  "fallback": "Summary of commands that I understand. I'm dumb!",
  "color": "#36a64f",
  "pretext": "Here's a list of transaction commands that I support",
  "author_name": "Transaction Commands",
  "author_link": "http://flickr.com/bobby/",
  "author_icon": "http://flickr.com/icons/bobby.jpg",
  "title": "Slack BOT Command Spec",
  "title_link": "https://github.com/askanexpert/slack-bot/blob/master/README.md",
  "text": "",
  "fields": [
      {
          "title": "schedule at <time_slot> @username",
          "value": "Schedules session with expert at time slot. We'll follow this up with a confirmation for scheduling payment.",
          "short": false
      },
      {
          "title": "purchase <number_of_tokens>",
          "value": "Helps you purchase tokens from us",
          "short": false
      },
      {
          "title": "redeem <number_of_tokens>",
          "value": "Helps you redeem tokens from your account",
          "short": false
      }
  ],
  "image_url": "http://my-website.com/path/to/image.jpg",
  "thumb_url": "http://example.com/path/to/thumb.png",
  "footer": "Slack API",
  "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
  "ts": 123456789
};

const helpChats = {
  "fallback": "Summary of commands that I understand. I'm dumb!",
  "color": "#36a64f",
  "pretext": "These commands can be issued once you're in a channel and chatting with the expert. Remember to invite me and tag me with @Headmaster here!",
  "author_name": "Chat Commands",
  "author_link": "http://flickr.com/bobby/",
  "author_icon": "http://flickr.com/icons/bobby.jpg",
  "title": "Slack BOT Command Spec",
  "title_link": "https://github.com/askanexpert/slack-bot/blob/master/README.md",
  "text": "",
  "fields": [
      {
          "title": "start_chat @Headmaster",
          "value": "Issued when starting a chat with expert in private channel. Starts billing period",
          "short": false
      },
      {
          "title": "end_chat @Headmaster",
          "value": "Stops billing period for chat and processes payment according to rate for expert's time",
          "short": false
      }
  ],
  "image_url": "http://my-website.com/path/to/image.jpg",
  "thumb_url": "http://example.com/path/to/thumb.png",
  "footer": "Slack API",
  "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
  "ts": 123456789
}

const helpGeneral = {
    "fallback": "Summary of commands that I understand. I'm dumb!",
    "color": "#36a64f",
    "pretext": "Try one of these!",
    "author_name": "Help Menu",
    "author_link": "http://flickr.com/bobby/",
    "author_icon": "http://flickr.com/icons/bobby.jpg",
    "title": "AskAnExpert Slack BOT Spec",
    "title_link": "https://github.com/askanexpert/slack-bot/blob/master/README.md",
    "text": "We have 3 types of help commands",
    "fields": [
        {
            "title": "Viewing",
            "value": "Type 'help view' for help on view commands. This will help you with stuff like viewing balance, expert lists, and expert availability.",
            "short": false
        },
        {
            "title": "Transactions",
            "value": "Type 'help transactions' for transaction commands to help you purchase or redeem tokens, or schedule and interact within chats.",
            "short": false
        },
        {
            "title": "Chats",
            "value": "Type 'help chat' for chat commands to help you with chats in a private channel with the expert. These include commands to start or end chats (billing)",
            "short": false
        }
    ],
    "image_url": "http://my-website.com/path/to/image.jpg",
    "thumb_url": "http://example.com/path/to/thumb.png",
    "footer": "Slack API",
    "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
    "ts": 123456789
}

var helpOops = helpGeneral;
helpOops["pretext"] = "Oops! Didn't really get that. May be try issuing a command?";

// Functions
const getBalanceAttachment = function (id) {
  return ost.getBalanceForUser(id).then((res) => {
    const balanceObject = res.data.balance;
    const airdroppedBalance = Number(balanceObject.airdropped_balance).toFixed(2);
    const tokenBalance = Number(balanceObject.token_balance).toFixed(2);
    return {
        "fallback": "Wallet Balance",
        "color": "#439FE0",
        "title": "Wallet Balance",
        "title_link": "https://www.askanexpert-landing-page.herokuapp.com",
        "pretext": "Here's some details about your balance...",
        "fields": [
            {
                "title": `Total Balance: ${tokenBalance} AETO`,
                "value": `Value in USD: $${tokenBalance * 0.01}`,
                "short": false
            }
        ],
        "actions": [
          {
            "type": "button",
            "text": "Online Wallet",
            "url": "https://www.askanexpert-landing-page.herokuapp.com",
            "style": "primary"
          }
        ],
        "footer": "Access more details & functionality at www.aae-wallet.herokuapp.com"
    };
  });
}

// limit indicates number of ledger activities to return
const getLedgerAttachment = function (id) {
    return ost.getLedgerForUser(id).then((res) => {
      const transactions = res.data.transactions;
      var fields = [];
      for (var i = 0; i < transactions.length; i++) {
        var transaction = transactions[i];
        var action = getActionStringFromTransaction(transaction, id);
        var amount = Number(transaction.amount).toFixed(2);
        var fromUUidString = transaction.from_user_id.substring(0,8) + "...";
        var formattedTimeStampString = utils.getFormattedTimeStamp(transaction.timestamp);
        var resString = `You ${action} ${amount} AETOs from ${fromUUidString}`;
        var timeStampString = `Timestamp: ${formattedTimeStampString} Hours`;
        fields.push({
          "title": resString,
          "value": timeStampString,
          "short": false
        });
        // getOtherPartyString(transaction).then((otherString) => {
        //     var string = `You ${action} ${amount} AETOs from ${otherString}`;
        //     console.log(string);
        // }).catch(console.log);
      }
      return {
          "fallback": "Ledger",
          "color": "#439FE0",
          "pretext": "Here's some details about your last 3 transactions...",
          "title": "Payment History",
          "title_link": "https://www.askanexpert-landing-page.herokuapp.com",
          "fields": fields,
          "actions": [
            {
              "type": "button",
              "text": "Full History",
              "url": "https://www.askanexpert-landing-page.herokuapp.com",
              "style": "primary"
            }
          ],
          "footer": "Access the full history by logging into your wallet"
      };
    })
}

const getMyProfileAttachment = function (user) {
    // console.log(user);
    var email = user.email;
    var address = user.addresses[0][1];
    var balance = user.token_balance;
    var balUSD = Number(balance * 0.01).toFixed(2);
    var walletDetails = `Email: ${email} \n
    Address: ${address}
    Total Balance: ${balance} AETOs
    Value in USD: ~$${balUSD}`
    return {
      "fallback": "Summary of commands that I understand. I'm dumb!",
      "color": "#ca2041",
      "text": "",
      "fields": [
          {
              "title": `${user.name}`,
              "value": `${walletDetails}`,
              "short": false
          }
      ],
      "footer": "More details on www.askanexpert.com",
    }
}

const getExpertProfileAttachment = function (expert) {
  console.log(expert);
  var {name, email, handle, domain, fees, availabilities, linkedin}  = expert;
  console.log(name, email, handle, domain, fees, availabilities, linkedin);
  return {
    "fallback": "Summary of commands that I understand. I'm dumb!",
    "color": "#ca2041",
    "text": "",
    "fields": [
        {
            "title": `${name}`,
            "value": `"Some Value"`,
            "short": false
        }
    ],
    "footer": "More details on www.askanexpert.com",
  }
}

const getExpertAvailabilityAttachment = function () {

}

const getExpertListAttachment = function (list) {
  var attachments = [];
  for(var i = 0;i < list.length; i++) {
    var expert = list[i];
    var description = `Rating: ${expert.rating} | 5.0, `;
    description += `Fees: ${expert.fees} AETOs per session`;
    description += `\n Linkedin: ${expert.linkedin} `;
    var attachment = {
      "fallback": "Summary of commands that I understand. I'm dumb!",
      "color": "#ec1943",
      "text": "",
      "fields": [
          {
              "title": `${expert.name}`,
              "value":  description,
              "short": false
          }
      ],
      "actions": [
        {
          "type": "button",
          "text": "Availabilities",
          "url": "https://www.askanexpert-landing-page.herokuapp.com"
        },
        {
          "type": "button",
          "text": "Full Profile",
          "url": "https://www.askanexpert-landing-page.herokuapp.com"
        }
      ]
    }
    attachments.push(attachment);
  }
  return attachments;
}

const getActionStringFromTransaction = function(transaction, id) {
  var action = "";
  if(Number(transaction.from_user_id) == id) {
    if(Number(transaction.to_user_id) == company_uuid) {
      action = "redeemed";
    } else {
      action = "sent";
    }
  } else {
    if(Number(transaction.from_user_id) == company_uuid) {
      action = "purchased";
      if(i == transactions.length - 1) {
        action = "received a welcome bonus of";
      }
    } else {
      action = "received";
    }
  }
  return action;
}

const getOtherPartyString = function(transaction) {
  var otherPartyId = transaction.to_user_id;
  if(Number(otherPartyId) == company_uuid) {
    return Promise.resolve("AAE");
  } else {
    return User.findOne({ost_id: otherPartyId}).then((user) => {
      return user.name;
    })
  }
}
module.exports = {
  welcomeBonus,
  helpView,
  helpTransactions,
  helpChats,
  helpGeneral,
  helpOops,
  getBalanceAttachment,
  getLedgerAttachment,
  getMyProfileAttachment,
  getExpertProfileAttachment,
  getExpertAvailabilityAttachment,
  getExpertListAttachment
}
