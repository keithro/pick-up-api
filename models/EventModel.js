// const { Schema } = require('mongoose');
const mongoose = require('../db/connection');
const { Schema } = mongoose;

    // Might need to change refs to 'users' here?
const eventSchema = new Schema({
  creatorID: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  title:  {
		type: String,
		required: true,
    maxLength: 100,
	},
  details:   {
		type: String,
		// required: true,
    maxLength: 1000,
    default: ''
	},
  eventDate: {
    type: String,
    default: 'now'
  },
  createdDate: { 
    type: Date, 
    default: Date.now 
  },
  location: {
    type: String,
    default: ''
  },
  sport: {
    type: String,
    required: true
  },
  skillLevel: {
    type: String,
    default: 'any'
  },
  creatorName: {
    type: String,
    required: true
  },
  creatorAvatar: {
    type: String,
    required: true
  },
  comments: [
    {
      userID: { type: Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
      name: { type: String },
      avatar: { type: String },
      date: { type: Date, default: Date.now },
    }
  ],
  going: [
    {
      userID: { type: Schema.Types.ObjectId, ref: 'User' },
      name: { type: String },
      avatar: { type: String },
    }
  ],
  likes: [
    {
      userID: { type: Schema.Types.ObjectId, ref: 'User' }
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
