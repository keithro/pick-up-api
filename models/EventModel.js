const { Schema } = require('mongoose');
const mongoose = require('../db/connection');


    // Might need to change refs to 'users' here?
const eventSchema = new mongoose.Schema({
  creator: {
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
	},
  eventDate: {
    type: String,
    default: 'now'
  },
  createdDate: { 
    type: Date, 
    default: Date.now 
  },
  location: String,
  sport: {
    type: String,
    required: true
  },
  skillLevel: {
    type: String,
    default: 'any'
  },
  creatorName: String,
  creatorAvatar: String,
  comments: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'user' },
      text: { type: String, required: true },
      name: { type: String },
      avatar: { type: String },
      date: { type: Date, default: Date.now },
    }
  ],
  going: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' }
    }
  ],
  likes: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' }
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
