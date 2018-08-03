const ost = require('../modules/ost/ost');
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
            "title": "show_expert_list",
            "value": "Shows list of all experts on the platform",
            "short": false
        },
        {
            "title": "show_expert_profile @username",
            "value": "Shows the profile of expert with username",
            "short": false
        },
        {
            "title": "show_expert_availability @username",
            "value": "Shows the availability of expert with username",
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
const getLedgerAttachment = function (ledgerObject, limit) {
  return {
      "fallback": "Ledger",
      "color": "warning",
      "pretext": "Here's some details about your last 5 transactions...",
      "title": "Payment History",
      "title_link": "https://www.askanexpert-landing-page.herokuapp.com",
      "fields": [
          {
              "title": "You paid 10 AETO to @tejnikumbh",
              "value": "Timestamp: 22-07-1992 8:30 AM",
              "short": false
          },
          {
              "title": "You purchased 100 AETO",
              "value": "Timestamp: 22-07-1992 8:30 AM",
              "short": false
          },
          {
              "title": "You redeemed 23 AETO",
              "value": "Timestamp: 22-07-1992 8:30 AM",
              "short": false
          },
          {
              "title": "You paid 20 AETO to schedule a chat with @tejnikumbh",
              "value": "Timestamp: 22-07-1992 8:30 AM",
              "short": false
          },
          {
              "title": "You got a welcome bonus of 100 AETO",
              "value": "Timestamp: 22-07-1992 8:30 AM",
              "short": false
          }
      ],
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
}

module.exports = {
  welcomeBonus,
  helpView,
  helpTransactions,
  helpChats,
  helpGeneral,
  helpOops,
  getBalanceAttachment,
  getLedgerAttachment
}
