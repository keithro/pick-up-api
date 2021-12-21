const { Schema } = require('mongoose');
const mongoose = require('../db/connection');

const eventSchema = new mongoose.Schema({
  creator: {
    type: Schema.Types.ObjectId,
    // Might need to use 'users' here?
    ref: 'User'
  },
  description:   {
		type: String,
		required: true,
    maxLength: 1000,
	},
  comments: [],
  // comments: [{ body: String, date: Date.now }],
  date: { 
    type: Date, 
    // default: Date.now 
  },
  going: [],
  likes: {
    type: Array,
    default: [],
  },
  location: String,
  skill: {
    type: String,
    default: 'Any'
  },
  sport: {
    type: String,
    default: ""
  },
  title:  {
		type: String,
		required: true,
    maxLength: 100,
	},
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
