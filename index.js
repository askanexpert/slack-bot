const {User} = require('./models/user');
const {Expert} = require('./models/expert');
const OST = require('./modules/ost/ost');
const Responses = require('./modules/responses/responses');

/**
 * A Bot for Slack!
 */

// CLIENT_ID=xxx CLIENT_SECRET=yyy PORT=8765 npm run dev-watch

/**
 * Define a function for initiating a conversation on installation
 * With custom integrations, we don't have a way to find out who installed us, so we can't message them :(
 */

function onInstallation(bot, installer) {
    if (installer) {
        bot.startPrivateConversation({user: installer}, function (err, convo) {
            if (err) {
                console.log(err);
            } else {
                convo.say('I am a bot that has just joined your team');
                convo.say('You must now /invite me to a channel so that I can be of use!');
            }
        });
    }
}


/**
 * Configure the persistence options
 */

var config = {};
if (process.env.MONGOLAB_URI) {
    var BotkitStorage = require('botkit-storage-mongo');
    config = {
        storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
    };
} else {
    config = {
        json_file_store: ((process.env.TOKEN)?'./db_slack_bot_ci/':'./db_slack_bot_a/'), //use a different name if an app or CI
    };
}

/**
 * Are being run as an app or a custom integration? The initialization will differ, depending
 */

if (process.env.TOKEN || process.env.SLACK_TOKEN) {
    //Treat this as a custom integration
    var customIntegration = require('./lib/custom_integrations');
    var token = (process.env.TOKEN) ? process.env.TOKEN : process.env.SLACK_TOKEN;
    var controller = customIntegration.configure(token, config, onInstallation);
} else if (process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.PORT) {
    //Treat this as an app
    var app = require('./lib/apps');
    var controller = app.configure(process.env.PORT, process.env.CLIENT_ID, process.env.CLIENT_SECRET, config, onInstallation);
} else {
    console.log('Error: If this is a custom integration, please specify TOKEN in the environment. If this is an app, please specify CLIENTID, CLIENTSECRET, and PORT in the environment');
    process.exit(1);
}


/**
 * A demonstration for how to handle websocket events. In this case, just log when we have and have not
 * been disconnected from the websocket. In the future, it would be super awesome to be able to specify
 * a reconnect policy, and do reconnections automatically. In the meantime, we aren't going to attempt reconnects,
 * WHICH IS A B0RKED WAY TO HANDLE BEING DISCONNECTED. So we need to fix this.
 *
 * TODO: fixed b0rked reconnect behavior
 */
// Handle events related to the websocket connection to Slack
controller.on('rtm_open', function (bot) {
    console.log('** The RTM api just connected!');
});

controller.on('rtm_close', function (bot) {
    console.log('** The RTM api just closed');
    // you may want to attempt to re-open
});


/**
 * Core bot logic goes here!
 */
// BEGIN EDITING HERE!

controller.on('bot_channel_join', function (bot, message) {
    bot.reply(message, "I'm here!");
});

// Exactly match a set of words
controller.hears([new RegExp('^hi|hey|hello|how$','i'),], 'direct_message',
  function (bot, message) {
    bot.api.users.info({user: message.user}, (error, response) => {
        const {name, real_name, profile} = response.user;
        OST.createNewUser(real_name)
        .then((user) => {
          // console.log(user);
          var mongoUser = new User(user);
          mongoUser.email = profile.email;
          mongoUser.ost_id = user.id;
          mongoUser.save();
          return Promise.resolve(mongoUser);
        }).then((mongoUser) => {
          console.log(mongoUser);
          bot.reply(message,
            `Hey ${mongoUser.name} ! How's your day going? Remember, in case you need any help, you can always type **help**!`);
        }).catch(console.log);
    });
});

// Exactly match a particular word
controller.hears([new RegExp('^show_my_profile$','i')], 'direct_message', function (bot, message) {
  // bot.api.users.info({user: message.user}, (error, response) => {
  //   const {name, real_name, profile} = response.user;
  //   return User.findOne({"email": profile.email})
  // }).then((mongoUser) => {
  //   const attachment = Responses.formattedUserAttachment(mongoUser);
  //   bot.reply(message,
  //     "Hi Profile"
  //   )
  // }).catch(console.log);
  bot.reply(message, "I'm here for profile!");
});

controller.hears([new RegExp('^show_expert_list$','i')], 'direct_message', function (bot, message) {
  bot.reply(message, "I'm here for expert list!");
});

controller.hears([new RegExp('^show_expert_profile @[a-z]+$','i')], 'direct_message', function (bot, message) {
  bot.reply(message, "I'm here for expert profile!");
});

controller.hears([new RegExp('^show_expert_availability @[a-z]+$','i')], 'direct_message', function (bot, message) {
  bot.reply(message, "I'm here for expert availability!");
});

controller.hears([new RegExp('^show_balance$','i')], 'direct_message', function (bot, message) {
  bot.reply(message, "I'm here for showing balance!");
});

controller.hears([new RegExp('^show_history$','i')], 'direct_message', function (bot, message) {
  bot.reply(message, "I'm here for showing history!");
});

controller.hears([new RegExp('^schedule at [0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9] @[a-z]+$','i')], 'direct_message', function (bot, message) {
  bot.reply(message, "I'm here for scheduling!");
});

controller.hears([new RegExp('^purchase [0-9]+$','i')], 'direct_message', function (bot, message) {
  bot.reply(message, "I'm here for purchasing!");
});

controller.hears([new RegExp('^redeem [0-9]+$','i')], 'direct_message', function (bot, message) {
  bot.reply(message, "I'm here for redeeming!");
});


controller.on(['mention','direct_mention'], function (bot, message) {
  // mention and direct_mention give different results for message.text
  // Hence we use includes and not exact match
  if(message.text.includes("start_chat")) {
    bot.reply(message, "I'm here for starting chat!");
  } else if(message.text.includes("end_chat")) {
    bot.reply(message, "I'm here for ending chat!");
  } else {
    bot.startConversation(message, function(err, convo) {
      convo.say("Sorry, didn't get that. Try the following...");
      convo.say({ ephemeral: true,
          "attachments": [
              {
                  "fallback": "Summary of commands that I understand. I'm dumb!",
                  "color": "#36a64f",
                  "pretext": "Try one of these!",
                  "fields": [
                      {
                          "title": "start_chat @Headmaster",
                          "value": "This will start the billing period with the expert",
                          "short": false
                      },
                      {
                          "title": "end_chat @Headmaster",
                          "value": "This will end the billing period with the expert",
                          "short": false
                      }
                  ]
              }
          ]
      }); // end of convo say attachments
    }) // end of startConversation
  } // end of if-else block
});


controller.hears(
  [new RegExp('^help view|help views$','i')],
  'direct_message',
  function (bot, message) {
    bot.reply(message, {
      "attachments": [
        {
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
            ],
            "image_url": "http://my-website.com/path/to/image.jpg",
            "thumb_url": "http://example.com/path/to/thumb.png",
            "footer": "Slack API",
            "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
            "ts": 123456789
        }
      ]
  });
});

controller.hears(
  [new RegExp('^help transaction|help transactions$','i')],
  'direct_message',
  function (bot, message) {
    bot.reply(message, {
        "attachments": [
          {
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
                },
                {
                    "title": "start_chat",
                    "value": "Issued when starting a chat with expert in private channel. Starts billing period",
                    "short": false
                },
                {
                    "title": "end_chat",
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
      ]
  });
});

controller.hears(['help'], 'direct_message', function (bot, message) {
  bot.startConversation(message, function(err, convo) {
        convo.say("Okay I'll help. Getting help...");
        convo.say({ ephemeral: true,

            "attachments": [
                {
                    "fallback": "Summary of commands that I understand. I'm dumb!",
                    "color": "#36a64f",
                    "pretext": "Try one of these!",
                    "author_name": "Help Menu",
                    "author_link": "http://flickr.com/bobby/",
                    "author_icon": "http://flickr.com/icons/bobby.jpg",
                    "title": "AskAnExpert Slack BOT Spec",
                    "title_link": "https://github.com/askanexpert/slack-bot/blob/master/README.md",
                    "text": "We have 2 types of commands",
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
                        }
                    ],
                    "image_url": "http://my-website.com/path/to/image.jpg",
                    "thumb_url": "http://example.com/path/to/thumb.png",
                    "footer": "Slack API",
                    "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
                    "ts": 123456789
                }
            ]

      });
    })
});

// Defined last if none of the above matches
controller.on('direct_message', function (bot, message) {
    bot.reply(message, {
      "attachments": [
          {
              "fallback": "Summary of commands that I understand. I'm dumb!",
              "color": "#36a64f",
              "pretext": "Oops! Didn't really get that. May be try issuing a command?",
              "author_name": "Help Menu",
              "author_link": "http://flickr.com/bobby/",
              "author_icon": "http://flickr.com/icons/bobby.jpg",
              "title": "AskAnExpert Slack BOT Spec",
              "title_link": "https://github.com/askanexpert/slack-bot/blob/master/README.md",
              "text": "We have 2 types of commands",
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
                  }
              ],
              "image_url": "http://my-website.com/path/to/image.jpg",
              "thumb_url": "http://example.com/path/to/thumb.png",
              "footer": "Slack API",
              "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
              "ts": 123456789
          }
      ]
    });
});
/**
 * AN example of what could be:
 * Any un-handled direct mention gets a reaction and a pat response!
 */
//controller.on('direct_message,mention,direct_mention', function (bot, message) {
//    bot.api.reactions.add({
//        timestamp: message.ts,
//        channel: message.channel,
//        name: 'robot_face',
//    }, function (err) {
//        if (err) {
//            console.log(err)
//        }
//        bot.reply(message, 'I heard you loud and clear boss.');
//    });
//});
