const mongoose = require('../db/connection');

const eventSchema = new mongoose.Schema({
  title:  {
		type: String,
		required: true,
    maxLength: 100,
	},
  // Add user's id after model is created
  creator: String,
  body:   {
		type: String,
		required: true,
    maxLength: 1000,
	},
  comments: [{ body: String, date: Date.now }],
  date: { type: Date, default: Date.now },
  going: [],
  // hidden: Boolean,
  location: String,
  meta: {
    like: Number,
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
