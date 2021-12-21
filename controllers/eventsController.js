const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Event = require('../models/EventModel');
const User = require('../models/UserModel');

// GET ALL EVENTS
router.get('/', auth, async (req, res) => {
  try {
    // Get events and sort with by most recent
    const events = await Event.find().sort({ date: -1 });
    res.status(200).json({ events: events });
  } catch (err) {
    console.log('Error: ', err.message);
    res.status(500).json({ errors: { msg: 'Server error' } });
  }
});

// router.get('/', async (req, res) => {
//   const events = await Event.find({});
//   res.status(200).json({ status: 200, events: events });
// });

// CREATE NEW EVENT
router.post('/',[auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('sport', 'Sport is required').not().isEmpty(),
]] , async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  };

  try {
    // Get user from token
    const user = await User.findById(req.user.id).select('-password');

    const newEvent = new Event({
      // couldn't id also come from user.id?
      creator: req.user.id,
      title: req.body.title,
      details: req.body.details,
      eventDate: req.body.eventDate,
      location: req.body.location,
      sport: req.body.sport,
      skillLevel: req.body.skill,
      creatorName: user.username,
      creatorAvatar: user.avatar
    });
    
    const event = await newEvent.save();

    res.status(201).json({ event: event });
  } catch (err) {
    console.log('Error: ', err.message);
    res.status(500).json({ errors: { msg: err.message } });
    // res.status(500).json({ errors: { msg: 'Server error' } });
  }
});

// router.event('/', async (req, res) => {
//   const newEvent = await Event.create(req.body);
//   res.status(201).json({ status: 200, newEvent: newEvent });
// });

// GET ONE EVENT BY ID
router.get('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if(!event) {
      res.status(404).json({ errors: { msg: 'Event not found' } });
    }
    res.status(200).json({ event: event })
  } catch (err) {
    console.log('Error: ', err.message);
    if(err.kind === 'ObjectId') {
      return res.status(404).json({ errors: { msg: 'Event not found' } });
    }
    res.status(500).json({ errors: { msg: 'Server error' } });
  }
});

// router.get('/:id', async (req, res) => {
//   const event = await Event.findById(req.params.id);
//   res.status(200).json({ status: 200, event: event })
// });

// // UPDATE EVENT - Refactor & add validation if you add this functionality later
// router.put('/:id', async (req, res) => {
// 	const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
// 	res.status(200).json({ status: 200, event: updatedEvent });
// });

// DELETE EVENT
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if(!event) {
      res.status(404).json({ errors: { msg: 'Event not found' } });
    }

    // Check if user is event owner
    if(event.creator.toString() !== req.user.id) {
      res.status(404).json({ errors: { msg: 'User not authorized' } });
    }

    await event.remove();
    res.status(200).json({ msg: 'Post removed' })
  } catch (err) {
    console.log('Error: ', err.message);
    if(err.kind === 'ObjectId') {
      return res.status(404).json({ errors: { msg: 'Event not found' } });
    }
    res.status(500).json({ errors: { msg: 'Server error' } });
  }
});

// router.delete('/:id', async (req, res) => {
// 	const deletedEvent = await Event.findByIdAndDelete(req.params.id);
//   console.log(deletedEvent)
// 	res.status(200).json({ status: 200, deletedEvent: deletedEvent });
// });

// LIKE EVENT


// ADD COMMENT TO EVENT


// JOIN EVENT


module.exports = router;
