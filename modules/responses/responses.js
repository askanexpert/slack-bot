// Sample response for user
// {
//   "success": true,
//   "data": {
//     "result_type": "user",
//     "user": {
//       "id": "1f91b5f3-d7df-4346-95e8-13a5d7f93eee",
//       "addresses": [
//         [
//           "1409",
//           "0x044206Ae3081a32F7e87B04d012b554c3FB3ACa1"
//         ]
//       ],
//       "name": "AAETest User5",
//       "airdropped_tokens": 0,
//       "token_balance": 0
//     }
//   }
const formattedUserAttachment = function (user) {
  return {
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
}

// Sample response for balance
// {
//   "success": true,
//   "data": {
//     "result_type": "balance",
//     "balance": {
//       "available_balance": "0",
//       "airdropped_balance": "0",
//       "token_balance": "0"
//     }
//   }
// }

// Sample response for ledger
// {
//   "success": true,
//   "data": {
//     "result_type": "transactions",
//     "meta": {
//       "next_page_payload": {}
//     },
//     "transactions": []
//   }
// }

// Sample response for transaction
// {
//     "id": "f194eebe-ddc9-4de0-aebd-f9a0752d7c10",
//     "from_user_id": "17d1187e-6455-4930-afb6-bdc1b7ef27c7",
//     "to_user_id": "2c4d3b38-2103-4303-a68b-e9a569a7a183",
//     "transaction_hash": "0x0af85e5619352031529451a791a955a2e3391a44fbaf90e37e67cdfa48854a2b",
//     "action_id": 39619,
//     "timestamp": 1533067816065,
//     "status": "complete",
//     "gas_price": "1000000000",
//     "gas_used": "83135",
//     "transaction_fee": "0.000083135",
//     "block_number": 6014228,
//     "amount": "10.704371022676423777",
//     "commission_amount": "0.535218551133821188",
//     "airdropped_amount": "0"
//   }

module.exports = {
  formattedUserAttachment
}
