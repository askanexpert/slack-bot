const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

const ExpertSchema = mongoose.Schema({
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
  handle: {
    type: String,
    default: null
  },
  domain: {
    type: String,
    default: "Blockchain Expert"
  },
  description: {
    type: String,
    default: "Blockchain Expert and Working Professional"
  },
  fees: { // fees are in AETOs
    type: Number,
    default: 2000
  },
  rating: {
    type: Number,
    default: 4.5
  },
  availabilities: [{
    type: String,
    default: "Fully booked for this week"
  }],
  github: {
    type: String,
    default: null
  },
  linkedin:{
    type: String,
    default: null
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
ExpertSchema.methods.toJSON = function () {
  var expert = this;
  return _.pick(expert, [
    'ost_id', 'name', 'email', 'handle', 'domain', 'description',
    'fees', 'rating', 'availabilities', 'github', 'linkedin']);
}

// Expert model creation
const Expert = mongoose.model('Expert', ExpertSchema);

module.exports = {Expert};
