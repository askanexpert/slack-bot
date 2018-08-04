const mongoose = require("mongoose");
const {User} = require('./models/user');
const {Expert} = require('./models/expert');
const OST = require('./modules/ost/ost');
const Utils = require('./modules/utils/utils');
const Attachments = require('./constants/attachments');
const Responses = require('./constants/responses');

const USER_CHANNEL_ID = "CC29TQ086";
const EXPERT_CHANNEL_ID = "GC10H2HL2";
const WELCOME_BONUS_AMOUNT = 100;

/**
 * A Bot for Slack!
 */

// CLIENT_ID=xxx CLIENT_SECRET=yyy PORT=8765 npm run dev-watch
// Connecting to mongoose for data persistence
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/AAEApp");

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

// Exactly match a set of words
controller.hears([new RegExp('^hi|hey|hello|how$','i'),], 'direct_message',
  function (bot, message) {
    bot.api.users.info({user: message.user}, (error, response) => {
        const {name, real_name, profile} = response.user;
        User.findOne({email: profile.email}, function(err, user) {
          if(!user) {
            bot.startConversation(message, function(err, convo) {
              convo.say("I see that you haven't been registered");
              convo.say("Please join the #aae-users channel to get started!");
            })
          } else {
            if(user.welcomeBonus == 0) { // In case welcome bonus not awarded
              bot.startConversation(message, function(err, convo) {
                convo.say(`Hey! How's your day going?`);
                convo.say(`Depositing welcome bonus to your account... :sunglasses:`);
                OST.executeWelcomeBonusTransaction(user.ost_id).then(() => {
                  // making changes in local database
                  user.welcomeBonus += WELCOME_BONUS_AMOUNT;
                  user.token_balance += WELCOME_BONUS_AMOUNT;
                  user.save().then(() => {

                      convo.say({ ephemeral: true,
                          "attachments": [ Attachments.welcomeBonus ]
                        }); // end of convo say attachments
                      convo.say(
                        `You can always type "help" to begin exploring the platform`);
                  }); // end of user.save()
                }) // end of executeWelcomeBonusTransaction
              }) // end of startConversation
            } else { // In case welcome bonus already given
              bot.startConversation(message, function(err, convo) {
                convo.say(`Hey! How's your day going?`);
                convo.say(
                  `You can always type "help" to begin exploring the platform`);
              });
            } // end of nested if else block
          } // end of outer if else block
        })// end of user.findone
    }) // end of bot.api.users.info
  });

// Exactly match a particular word
controller.hears([new RegExp('^show_my_profile$','i')], 'direct_message', function (bot, message) {
  bot.api.users.info({user: message.user}, (error, response) => {
      const {name, real_name, profile} = response.user;
      User.findOne({email: profile.email}, function(err, user) {
        if(!user) {
          bot.startConversation(message, function(err, convo) {
            convo.say("I see that you haven't been registered.");
            convo.say("Please join the #aae-users channel to get started!");
            return
          })
        } else {
          bot.reply(message, "Fetching your profile...");
          bot.reply(message, { "attachments":
            [ Attachments.getMyProfileAttachment(user) ] });
        }
      })
    })
});

controller.hears([new RegExp('^show_expert_list for .+$','i')], 'direct_message', function (bot, message) {
  const topic = message.text.substring(21);
  Utils.createMockExperts().then(() => {
    Expert.find({}, function(error, expertList) {
      bot.reply(message, `Here's a list of *${topic}* related experts`);
      bot.reply(message, {
        "attachments": Attachments.getExpertListAttachment(expertList)
      });
    });
  })
});

controller.hears([new RegExp('^show_balance$','i')], 'direct_message', function (bot, message) {
  bot.api.users.info({user: message.user}, (error, response) => {
      const {name, real_name, profile} = response.user;
      User.findOne({email: profile.email}, function(err, user) {
        if(!user) {
          bot.startConversation(message, function(err, convo) {
            convo.say("I see that you haven't been registered.");
            convo.say("Please join the #aae-users channel to get started!");
            return
          })
        } else {
          bot.reply(message, "Fetching balance...");
          Attachments.getBalanceAttachment(user.ost_id).then((res) => {
            bot.reply(message, { "attachments": [ res ] });
          })
        }
      })
    })
})

controller.hears([new RegExp('^show_history$','i')], 'direct_message', function (bot, message) {
  bot.api.users.info({user: message.user}, (error, response) => {
      const {name, real_name, profile} = response.user;
      User.findOne({email: profile.email}, function(err, user) {
        if(!user) {
          bot.startConversation(message, function(err, convo) {
            convo.say("I see that you haven't been registered.");
            convo.say("Please join the #aae-users channel to get started!");
            return
          })
        } else {
          bot.reply(message, "Fetching history...");
          Attachments.getLedgerAttachment(user.ost_id).then((res) => {
            bot.reply(message, { "attachments": [ res ] });
          })

        }
      })
    })
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

controller.hears(
  [new RegExp('^help view|help views$','i')],
  'direct_message',
  function (bot, message) {
    bot.reply(message, {
      "attachments": [ Attachments.helpView ]
  });
});

controller.hears(
  [new RegExp('^help transaction|help transactions$','i')],
  'direct_message',
  function (bot, message) {
    bot.reply(message, {
        "attachments": [ Attachments.helpTransactions ]
  });
});

controller.hears(
  [new RegExp('^help chat|help chats$','i')],
  'direct_message',
  function (bot, message) {
    bot.reply(message, {
        "attachments": [ Attachments.helpChats ]
  });
});

controller.hears(['thank'], 'direct_message', function (bot, message) {
  bot.reply(message, 'Anytime! Always at your service.')
})

controller.hears(['help'], 'direct_message', function (bot, message) {
  bot.startConversation(message, function(err, convo) {
    convo.say("Okay I'll help. Getting help...");
    convo.say({ ephemeral: true,
      "attachments": [ Attachments.helpGeneral ]
    });
  })
});

// Defined last if none of the above matches
controller.on('direct_message', function (bot, message) {
    console.log(message);
    bot.reply(message, {
      "attachments": [ Attachments.helpOops ]
    });
});

controller.on('user_channel_join', function (bot, message) {
    // console.log(message.channel);
    if(message.channel == USER_CHANNEL_ID) {
      console.log('New user joined channel');
      bot.api.users.info({user: message.user}, (error, response) => {
          const {name, real_name, profile} = response.user;
          User.findOne({email: profile.email}, function(err, user) {
            console.log("Found user!");
            console.log(user);
            if(user) {
              console.log("User already exists!");
              return Promise.resolve(user);
            } else {
              console.log("Creating new user...");
              OST.createNewUser(real_name).then((user) => {
                // console.log(user);
                var mongoUser = new User(user);
                mongoUser.email = profile.email;
                mongoUser.ost_id = user.id;
                mongoUser.save().then((user) => {
                  bot.startConversation(message, function(err, convo) {
                    convo.say(`Hey ${mongoUser.name} ! Welcome to the user community!`);
                    convo.say(
                      `Remember, for help on platform usage, you can always directly message me.`);
                    convo.say(
                      `DM me with "Hey" to get a welcome bonus of 100 AETOs :wink:.`);
                  });
                });
              })
            } // end of if else block
          }).then((mongoUser) => {
            console.log(mongoUser);
            bot.startConversation(message, function(err, convo) {
              convo.say(`Hey ${mongoUser.name} ! Welcome to the user community!`);
              convo.say(
                `Remember, for help on platform usage, you can always directly message me.`);
              convo.say(
                `DM me with "Hey" to get a welcome bonus of 100 AETOs :wink:.`);
            });
          }).catch(console.log); // end of user.findone
      }); // end of bot.api.user.info
    } // end of user-channel check
}); // end of controller

controller.on(['mention','direct_mention'], function (bot, message) {
  // do nothing in case mentioned in user-channel
  if(message.channel == USER_CHANNEL_ID
    || message.channel == EXPERT_CHANNEL_ID) { return }
  // mention and direct_mention give different results for message.text
  // Hence we use includes and not exact match
  if(message.text.includes("start_chat")) {
    bot.reply(message, "I'm here for starting chat!");
  } else if(message.text.includes("end_chat")) {
    bot.reply(message, "I'm here for ending chat!");
  } else if(message.text.toLowerCase().includes("thank")) {
    bot.reply(message, "Not a problem. Always at your service!")
  } else {
    bot.startConversation(message, function(err, convo) {
      convo.say("Sorry, didn't get that. Try the following...");
      convo.say({ ephemeral: true,
          "attachments": [ Attachments.helpChats ]
      }); // end of convo say attachments
    }) // end of startConversation
  } // end of if-else block
});
