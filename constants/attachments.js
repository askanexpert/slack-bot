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

module.exports = {
  welcomeBonus,
  helpView,
  helpTransactions,
  helpChats,
  helpGeneral,
  helpOops
}
