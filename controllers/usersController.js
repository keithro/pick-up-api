const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/UserModel');


router.get('/', (req, res) => {
  console.log('User page');
  res.send('<h1>Welcome to the User page!</h1>');
});

// REGISTER NEW USER
router.post('/register', async (req, res) => {
  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// USER LOGIN
router.post('/login', async (req, res) => {
  try {
    // Find user by email
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json('user not found');

    // Compare password and return user if correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    !validPassword && res.status(400).json('wrong password'); 

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// USER UPDATE


// USER DELETE

module.exports = router;
