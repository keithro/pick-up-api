const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');


router.get('/', (req, res) => {
  console.log('User page')
  res.send('<h1>Welcome to the User page!</h1>')
});

// REGISTER NEW USER
router.post('/register', async (req, res) => {
	const user = await User.create(req.body);
	res.status(201).json({ status: 201, user: user });
});

// USER LOGIN


// USER UPDATE


// USER DELETE

module.exports = router;
