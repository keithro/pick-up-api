const mongoose = require('../db/connection');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    min: 6,
    max: 30,
    // unique: true,
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
  following: {
    type: Array,
    default: [],
  },
  invites: [
    {
      eventID: { type: Schema.Types.ObjectId, ref: 'Event' },
      title: { type: String, required: true },
      creatorName: { type: String },
      date: { type: Date, default: Date.now },
    }
  ],
  admin: {
    type: Boolean,
    default: false,
  },
  desc: {
    type: String,
    max: 50,
    default: ''
  },
  location: {
    type: String,
    max: 50,
    default: ''
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
