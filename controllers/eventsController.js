const express = require('express');
const router = express.Router();
const Event = require('../models/EventModel');

// GET ALL EVENTS
router.get('/', async (req, res) => {
  const events = await Event.find({});
  res.status(200).json({ status: 200, events: events });
})

// CREATE NEW EVENT
router.post('/', async (req, res) => {
  const newEvent = await Event.create(req.body);
  res.status(201).json({ status: 200, newEvent: newEvent });
})

// GET ONE EVENT BY ID
router.get('/:id', async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.status(200).json({ status: 200, event: event })
})

// UPDATE EVENT
router.put('/:id', async (req, res) => {
	const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
	res.status(200).json({ status: 200, event: updatedEvent });
});

// DELETE EVENT
router.delete('/:id', async (req, res) => {
	const deleteEvent = await Event.findByIdAndDelete(req.params.id);
	res.status(204).json({ status: 204, deleteEvent: deleteEvent });
});

// LIKE EVENT


// ADD COMMENT TO EVENT


// JOIN EVENT


module.exports = router;
