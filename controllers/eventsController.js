const { Router } = require('express');
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
    const events = await Event.find().sort({ createdDate: 'descending', eventDate: 'descending' });
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
      creatorID: req.user.id,
      title: req.body.title,
      details: req.body.details,
      eventDate: req.body.eventDate,
      location: req.body.location,
      sport: req.body.sport,
      skillLevel: req.body.skill,
      creatorName: user.name,
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

    // TODO: TEST THIS AGAIN TO MAKE SURE IT ONLY WORKS IF ID MATCHES (might need to add ".toString()")

    // Check if user is event owner
    if(event.creatorID.toString() !== req.user.id) {
      return res.status(401).json({ errors: { msg: 'User not authorized' } });
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
    console.log('Params: ', req.params)
    const foundEvent = await Event.findById(req.params.id);
    console.log('foundEvent: ', foundEvent)
    
    const index = foundEvent.likes.findIndex(like => {
      return like.userID.toString() === req.user.id.toString();
    });

    if (index === -1) {
      foundEvent.likes.push({ userID: req.user.id });
    } else {
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
    // Get user using id from token
    const user = await User.findById(req.user.id).select('-password');

    const foundEvent = await Event.findById(req.params.id);
    
    const index = foundEvent.going.findIndex(elem => {
      return elem.userID.toString() === req.user.id.toString();
    });

    if (index === -1) {
      foundEvent.going.push({
        userID: req.user.id,
        name: user.name,
        avatar: user.avatar,
      });
    } else {
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
router.post('/comment/:id',[auth, [
  check('text', 'Text is required').not().isEmpty(),
]] , async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  };

  try {
    const user = await User.findById(req.user.id).select('-password');
    const foundEvent = await Event.findById(req.params.id);

    const newComment = {
      userID: req.user.id,
      text: req.body.text,
      name: user.name,
      avatar:user.avatar
    };
    
    foundEvent.comments.push(newComment);
    const event = await foundEvent.save();

    res.status(201).json({ event: event });

  } catch (err) {
    console.log('Error: ', err.message);
    if(err.kind === 'ObjectId') {
      return res.status(404).json({ errors: { msg: 'Event not found' } });
    }
    res.status(500).json({ errors: { msg: 'Server error' } });
  }
});


// DELETE COMMENT TO EVENT
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const foundEvent = await Event.findById(req.params.id);
    
    const index = foundEvent.comments.findIndex(comment => {
      return comment.id === req.params.comment_id;
    });

    // If no comment send back 404 response
    if (index === -1) {
      return res.status(404).json({ errors: { msg: 'Comment not found' } })
    }

    // Check if user is comment owner
    if (foundEvent.comments[index].userID.toString() !== req.user.id) {
      return res.status(401).json({ errors: { msg: 'User not authorized' } });
    }

    // Delete comment and return saved event
    foundEvent.comments.splice(index, 1);
    const event = await foundEvent.save();
  
    return res.status(201).json({ event: event });

  } catch (err) {
    console.log('Error: ', err.message);
    if(err.kind === 'ObjectId') {
      return res.status(404).json({ errors: { msg: 'Event not found' } });
    }
    res.status(500).json({ errors: { msg: 'Server error' } });
  }
});

module.exports = router;
