# AskAnExpert Slack Bot
This is a Slack bot for AskAnExpert Project (Part of Core Platform) It enables real time chat with industry leading experts empowered by Slack. This bot involves wallet address queries, token transactions and user creation and uses the [BotKit](https://github.com/howdyai/botkit) framework. If following [Easy Peasy Tutorial](https://api.slack.com/tutorials/easy-peasy-bots) tutorial, make sure you read the Tutorial section of Notes

# Running Instructions
**Step 0** 


Run to install node packages and localtunnel
```bash
npm install --save
npm install -g localtunnel
```

**Step 1** 


Start localtunnel in root directory
```bash
lt --port 8765 --subdomain headmaster-bot
```


**Step(s) 2** 


- Take the URL and paste <URL>/oauth in OAuth and Permissions in Slack API Dashboard
- Install the App inside your workspace by navigating to <URL>/login and authorizing
   
   
**Step 3** 


Start bot in root directory (with client id and secret from slack)
```bash
CLIENT_ID=xxx.yyy CLIENT_SECRET=abc PORT=8765 npm run dev-watch
```

**Step 4**


Check the bot behavior in slack. DONE!


# Behavioral Details
Following are the commands for the current version of the bot v1.0. The BOT operates by creating a new private channel, inviting the user and the expert at the scheduled time to that channel, setting topic for the channel and joining that channel. It then monitors the following commands in the private channel.

### Channel Commands
```javascript
   @bot_name start_chat ["start" && "chat"]
```
  - Starts the billing period for chat
  - This can be done by user or expert
  - First 5 minutes free as scheduling fee paid

```javascript
  @bot_name end_chat ["end" && "chat"]
```
  - Ends the billing period for chat
  - This can be done by expert or user
  - Pays and cuts money from user account (token transfer: user to user, with cut)
  - If no end command, ends after half hour time slot by default
  - Charges a transaction fee of 10% on payment

### DM(Direct Message) Questions and Answers
These are word combinations that trigger the bot's response system.

```javascript
  show_expert_list ["show" && "expert" && "list"]
```
- Shows the list of experts, available on the platform
```javascript
  show_expert_profile @username ["profile"]
```
- Shows the detailed profile of expert with username
- Also shows available time slots for easy scheduling

```javascript
  show_balance || show_wallet
```
- Shows the wallet balance
- Gives link to user to view wallet dashboard. (Optional)

```javascript
  show_activity, ["show" && "history"]
```
- Shows the ledger activity of payments related to user

```javascript
  schedule at <time_slot> @username ["schedule" && "at" -> "timeslot regex"]
```
- Schedules chat for given time_slot with expert
- Fees for first 5 minutes of billing cycle are cut as deposit
- Asks for confirmation

```javascript
  purchase <tokens> ["purchase"]
```
- Purchases specific number of tokens (token transfer: company to user)
- Deducts money from user on web dashboard (credit card, right now mock)
- Asks for confirmation

```javascript
  redeem <tokens> ["redeem"]
```
- Redeems tokens from user wallet (token transfer: user to company)
- Deposits money into user account on web dashboard (credit card, right now mock)
- Asks for confirmation

# Notes
### Word Combinations
- <> indicates regex
- @ indicates specific user
- other space seperated words indicate all inclusive combinations

### Tutorials
- Install the app on workspace only through htttps://<app-name>.localtunnel.me/login and not through slack interface
- Setup Oauth Redirect URI in OAuth and Permissions Section of the Slack API Web Interface
- In case the URL for localtunnel changes, change it in OAuth and Permissions in Slack API Web Interface

# Pending Tasks
- [ ] UI for Wallet Dashboard on Web
- [ ] Modularization of BOT code as a service

# Future Tasks
- [ ] Mobile Wallet App
- [ ] Expert Listing according to topic
- [ ] Feedback for expert command introduction

# Author
- Tejas Nikumbh
  - Email: tejnikumbh@gmail.com
  - Skype: tjnikumbh
