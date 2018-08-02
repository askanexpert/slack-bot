// Config settings
var env = process.env.NODE_ENV || 'development';
console.log('env ******', env);
if (env == 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/AAEApp';
} else if (env == 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/AAEAppTest';
}

const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

const UserSchema = mongoose.Schema({
  ost_id: {
    type: String,
    default: null,
    index: {
      unique: true,
      partialFilterExpression: {ost_id: {$type: 'string'}}
    } // allows null value duplicates
  },
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    minLength: 1,
    trim: true,
    validate: {
      validator:  validator.isEmail,
      message: `{VALUE} is not a valid E-mail`
    }
  },
  addresses: [[
    {
      type: String,
      default: "N/A"
    }
  ]],
  airdropped_tokens: {
    type: Number,
    default: 0
  },
  token_balance: {
    type: Number,
    default: 0
  }
});


// Instance Methods
UserSchema.methods.toJSON = function () {
  var user = this;
  return _.pick(user, [
    'ost_id', 'name', 'email', 'addresses', 'airdropped_tokens', 'token_balance']);
}

// User model creation
const User = mongoose.model('User', UserSchema);

module.exports = {User};
