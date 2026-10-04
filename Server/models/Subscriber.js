const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Subscriber', subscriberSchema);
