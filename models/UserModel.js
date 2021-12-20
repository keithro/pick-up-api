const mongoose = require('../db/connection');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    min: 6,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  avatar: {
    type: String,
    default: "",
  },
  followers: {
    type: Array,
    default: [],
  },
  followings: {
    type: Array,
    default: [],
  },
  invites: {
    type: Array,
    default: [],
  },
  admin: {
    type: Boolean,
    default: false,
  },
  desc: {
    type: String,
    max: 50,
  },
  location: {
    type: String,
    max: 50,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
