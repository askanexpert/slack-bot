const ost = require('../ost/ost');
const utils = require('../utils/utils');
const {User} = require('../../models/user');
const {Expert} = require('../../models/expert');

const company_uuid = "acddd83e-bd60-40d7-8184-7032234caac6";

const ACTION_ID_TO_WORDING = {
  "39658": "Welcome Bonus",
  "39617": "Redemption of Tokens",
  "39618": "Purchase of Tokens",
  "39620": "Scheduling Chat with Expert",
  "39619": "Payment to Expert"
}

const ACTION_ID_TO_NAME = {
  "39658": "welcomeBonus",
  "39617": "redeem",
  "39618": "purchase",
  "39620": "schedule",
  "39619": "pay"
}
// constants
const welcomeBonus = {
    "fallback": "Welcome Bonus!",
    "color": "#96baf8",
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
    "color": "#ffbb58",
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
            "title": "show_availability for @<Expert Name>",
            "value": "Shows time slots that can be scheduled for expert sessions",
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
      ],
      "footer": "Full spec at https://github.com/askanexpert/slack-bot/blob/master/README.md",
      "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png"
    }

const helpTransactions = {
  "fallback": "Summary of commands that I understand. I'm dumb!",
  "color": "#ffbb58",
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
          "value": "Purchase tokens in $USD",
          "short": true
      },
      {
          "title": "redeem <number_of_tokens>",
          "value": "Redeem tokens for $USD",
          "short": true
      }
  ],
  "image_url": "http://my-website.com/path/to/image.jpg",
  "thumb_url": "http://example.com/path/to/thumb.png",
  "footer": "Full spec at https://github.com/askanexpert/slack-bot/blob/master/README.md",
  "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png"
};

const helpChats = {
  "fallback": "Summary of commands that I understand. I'm dumb!",
  "color": "#ffbb58",
  "pretext": "These commands can be issued once you're in a channel and chatting with the expert. Remember to invite me and tag me with @Headmaster here!",
  "author_name": "Chat Commands",
  "author_link": "http://flickr.com/bobby/",
  "author_icon": "http://flickr.com/icons/bobby.jpg",
  "title": "Slack BOT Command Spec",
  "title_link": "https://github.com/askanexpert/slack-bot/blob/master/README.md",
  "text": "",
  "fields": [
      {
          "title": "@Headmaster start_chat",
          "value": "Issued when starting a chat with expert in private channel. Starts billing period",
          "short": false
      },
      {
          "title": "@Headmaster end_chat",
          "value": "Stops billing period for chat and processes payment according to rate for expert's time",
          "short": false
      },
      {
          "title": "@Headmaster help",
          "value": "Access the help menu for chats",
          "short": false
      }
  ],
  "image_url": "http://my-website.com/path/to/image.jpg",
  "thumb_url": "http://example.com/path/to/thumb.png",
  "footer": "Full spec at https://github.com/askanexpert/slack-bot/blob/master/README.md",
  "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png"
}

const helpGeneral = {
    "fallback": "Summary of commands that I understand. I'm dumb!",
    "color": "#ffbb58",
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
    "footer": "Full spec at https://github.com/askanexpert/slack-bot/blob/master/README.md",
    "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png"
}

var helpOops = JSON.parse(JSON.stringify(helpGeneral));
helpOops["pretext"] = "Oops! Didn't really get that. May be try issuing a command?";

// Functions
const getBalanceAttachment = function (id) {
  return ost.getBalanceForUser(id).then((res) => {
    // console.log(res);
    return ost.getTokenPriceInUSD().then((price) => {
      console.log(price);
      const balanceObject = res.data.balance;
      const airdroppedBalance = Number(balanceObject.airdropped_balance).toFixed(2);
      const tokenBalance = Number(balanceObject.token_balance).toFixed(2);
      const usdValue = Number(tokenBalance * price).toFixed(3);
      return {
          "fallback": "Wallet Balance",
          "color": "#439FE0",
          "title": "Wallet Balance",
          "title_link": "https://www.askanexpert-landing-page.herokuapp.com",
          "pretext": "Here's some details about your balance...",
          "fields": [
              {
                  "title": `Total Balance: ${tokenBalance} AETO`,
                  "value": `Value in USD: $${usdValue}`,
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
      }; // end of attachment
    }); // end of ost.getTokenPriceInUSD
  });// end of get ost.getBalanceForUser
}

// limit indicates number of ledger activities to return
const getLedgerAttachment = function (id) {
    return ost.getLedgerForUser(id).then((res) => {
      const transactions = res.data.transactions;
      var fields = [];
      for (var i = 0; i < 3; i++) {
        var transaction = transactions[i];
        var action = getActionStringFromTransaction(transaction);
        var amount = Number(transaction.amount).toFixed(2);
        var fromUUidString = transaction.from_user_id.substring(0,8) + "...";
        var formattedTimeStampString = utils.getFormattedTimeStamp(transaction.timestamp);
        var resString = `Transfer of ${amount} AETOs for ${action} from ${fromUUidString}`;
        var timeStampString = `Timestamp: ${formattedTimeStampString} Hours`;
        fields.push({
          "title": resString,
          "value": timeStampString,
          "short": false
        });
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

const getMyProfileAttachment = function (name, email, address, balance) {
    // console.log(name, email, address, balance);
    balance = Number(balance).toFixed(2);
    var balUSD = Number(balance * 0.01).toFixed(2);
    var walletDetails = `*Total Balance:* $${balance} AETOs (~$${balUSD} USD) \n `;
    walletDetails += `*Address:* ${address} \n `;

    return {
      "fallback": "Summary of commands that I understand. I'm dumb!",
      "color": "#9c6ef9",
      "text": "",
      "fields": [
          {
              "title": `${name} (${email})`,
              "value": `${walletDetails}`,
              "short": false
          }
      ],
      "actions": [
        {
          "type": "button",
          "style": "primary",
          "text": "Full profile",
          "url": "https://askanexpert-landing-page.herokuapp.com"
        }
      ],
      "footer": ""
    }
}

const getExpertAvailabilityAttachment = function (expert) {
  console.log(expert);
  var responseTitle = `Time Slots available for ${expert.name}`;
  var responseDescription = ``;
  for(var i = 0; i < expert.availabilities.length; i++) {
    responseDescription += `*Slot ${i}:* ${expert.availabilities[i]} \n`;
  }
  var attachment = {
    "fallback": "Availability of expert!",
    "color": "#55d5af",
    "text": "",
    "fields": [
        {
            "title": `${responseTitle}`,
            "value":  `${responseDescription}`,
            "short": false
        }
    ],
    "footer": "Type schedule at <Time Slot> @Username to schedule a session"
  }
  return attachment;
}

const getExpertListAttachment = function (list) {
  var attachments = [];
  for(var i = 0;i < list.length; i++) {
    var expert = list[i];
    var description = `${expert.description} \n`;
    description += `Rating: ${expert.rating} | 5.0, `;
    description += `Fees: ${expert.fees} AETOs per session`;
    var attachment = {
      "fallback": "Summary of commands that I understand. I'm dumb!",
      "color": "#f0443f",
      "text": "",
      "fields": [
          {
              "title": `${expert.name}`,
              "value":  description,
              "short": false
          }
      ],
      "callback_id": "",
      "actions": [
        {
          "type": "button",
          "text": "Github",
          "name": "github",
          "value": "github",
          "style": "default",
          "url": `${expert.github}`
        },
        {
          "type": "button",
          "text": "Linkedin",
          "name": "linkedin",
          "value": "linkedin",
          "style": "default",
          "url": `${expert.github}`
        }
      ]
    }
    attachments.push(attachment);
  }
  return attachments;
}

const getSchedulingAttachment = function(name, fees, slot) {
  var description = `This will schedule a session with ${name} at ${slot}. \n`;
  description += `A scheduling fee of *${fees}AETOs* will be deducted. \n`;
  description += `Do you wish to proceed?`
  var attachment = {
    "fallback": "Summary of commands that I understand. I'm dumb!",
    "color": "#f0443f",
    "pretext":  "Please confirm the transaction",
    "fields": [
        {
            "title": `Confirmation of transaction`,
            "value":  description,
            "short": false
        }
    ],
    "callback_id": "schedule",
    "actions": [
      {
        "type": "button",
        "text": "Yes",
        "name": "yes",
        "value": "yes",
        "style": "default"
      },
      {
        "type": "button",
        "text": "No",
        "name": "no",
        "value": "no",
        "style": "default"
      }
    ]
  }
  return attachment;
}

const getConfirmationAttachment = function(pretext, description) {
  return {
    "fallback": "Summary of commands that I understand. I'm dumb!",
    "color": "#f0443f",
    "pretext":  pretext,
    "fields": [
        {
            "title": `Do you wish to proceed? (yes/no)`,
            "value": description,
            "short": false
        }
    ]
  }
}
const getActionStringFromTransaction = function(transaction) {
  var actionId = transaction.action_id;
  return ACTION_ID_TO_WORDING[actionId];
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
  getExpertAvailabilityAttachment,
  getExpertListAttachment,
  getSchedulingAttachment,
  getConfirmationAttachment
}
