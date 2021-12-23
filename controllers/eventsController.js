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
    // Get user from token id
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


// LIKE/UNLIKE EVENT
router.put('/like/:id', auth, async (req, res) => {
  try {
    const foundEvent = await Event.findById(req.params.id);
    // console.log('EVENT LIKES ARRAY: ', foundEvent.likes)
    // console.log('REQUESTING USER ID: ', req.user.id);
    
    const index = foundEvent.likes.findIndex(like => {
      // console.log('CURRENT LIKE USER ID: ', like.user.toString());
      return like.user.toString() === req.user.id.toString();
    });

    // console.log('INDEX: ', index);

    if (index === -1) {
      // console.log('we are adding!')
      foundEvent.likes.push({ user: req.user.id });
    } else {
      // console.log('we are deleting!')
      foundEvent.likes.splice(index, 1);
    }

    const event = await foundEvent.save();

    res.status(200).json({ event: event });
  } catch (err) {
    console.log('Error: ', err.message);
    if(err.kind === 'ObjectId') {
      return res.status(404).json({ errors: { msg: 'Event not found' } });
    }
    res.status(500).json({ errors: { msg: 'Server error' } });
  }
});


// JOIN EVENT
router.put('/attend/:id', auth, async (req, res) => {
  try {
    // Get user from token id
    const user = await User.findById(req.user.id).select('-password');
    // console.log('FOUND USER: ', req.user);

    const foundEvent = await Event.findById(req.params.id);
    // console.log('EVENT GOING ARRAY: ', foundEvent.going)
    // console.log('REQUESTING USER ID: ', req.user.id);
    
    const index = foundEvent.going.findIndex(elem => {
      console.log('CURRENT GOING ARRAY USER ID: ', elem.user.toString());
      return elem.user.toString() === req.user.id.toString();
    });

    // console.log('INDEX: ', index);

    if (index === -1) {
      // console.log('we are adding!')
      foundEvent.going.push({ user: req.user.id, avatar: user.avatar });
    } else {
      // console.log('we are deleting!')
      foundEvent.going.splice(index, 1);
    }

    const event = await foundEvent.save();

    res.status(200).json({ event: event });
  } catch (err) {
    console.log('Error: ', err.message);
    if(err.kind === 'ObjectId') {
      return res.status(404).json({ errors: { msg: 'Event not found' } });
    }
    res.status(500).json({ errors: { msg: 'Server error' } });
  }
});


// ADD COMMENT TO EVENT
// router.put('/comment/:id', auth, async (req, res) => {
//   try {
    

//   } catch (err) {
//     console.log('Error: ', err.message);
//     if(err.kind === 'ObjectId') {
//       return res.status(404).json({ errors: { msg: 'Event not found' } });
//     }
//     res.status(500).json({ errors: { msg: 'Server error' } });
//   }
// });


module.exports = router;
