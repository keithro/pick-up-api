const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const config = require('config');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/UserModel');
require('dotenv').config();

// const { JWT_SECRET_KEY } = config;

// GET AUTHORIZE USER (private)
router.get('/', auth, async (req, res) => {
  try {
    // using the user info from the jwt decoded in middleware (minus the pw field)
    const user = await User.findById(req.user.id).select('-password');
    return res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ errors: { msg: 'Server error' } });
  }
});


// CREATE NEW USER AND GET TOKEN (public)
router.post('/register', [
  check('username', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 8 or more characters').isLength({ min: 8 })
], async (req, res) => {
  const { username, email, password, passwordCheck } = req.body;
  
  // Validate user data and send errors array if any.
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  };
  if (password !== passwordCheck) {
    return res.status(400).json({ errors: { msg: 'Passwords do not match', param: 'password'} });
  }

  try {
    // Check if user exists (no longer checking if username is unique)
    // const foundUserName = await User.findOne({ username: username });
    const foundUser = await User.findOne({ email: email.toLowerCase() });
    if (foundUser) {
      return res.status(400).json({ errors: { msg: 'User already exists', param: "username" } });
    };

    // Get gravatar if exist or default image (size, rating, default)
    const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'retro' });

    // Create new User
    newUser = new User ({ username, email: email.toLowerCase(), avatar });

    // Check if admin
    newUser.admin = email === process.env.ADMIN_EMAIL;
    // if (email === process.env.ADMIN_EMAIL) {
    //   console.log('Wooo! You are an admin!')
    //   newUser.admin =true;
    // }

    // Encrypt password & add to user
    const salt = await bcrypt.genSalt(12);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();
  
    // Create and return jsonwebtoken
    const payload = {
      user: {
        id: newUser.id,
        admin: newUser.admin
      }
    };
    jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({ token })
    })
  
  } catch (err) {
    console.log('Error: ', err.message);
    res.status(500).json({ errors: { msg: 'Server error' } });
  }
});


// LOGIN AND GET TOKEN
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 8 or more characters').isLength({ min: 8 })
], async (req, res) => {
  const { email, password } = req.body;
  
  // Validate user data and send errors array if any.
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  };

  try {
    // Check if user exists
    const foundUser = await User.findOne({ email: email.toLowerCase() });
    if (!foundUser) {
      return res.status(400).json({ errors: { msg: 'Invalid user or password' } });
    };
    
    // Compare password on db to pw provided
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(400).json({ errors: { msg: 'Invalid user or password' } });
    }

    // Create and return jsonwebtoken
    const payload = {
      user: {
        id: foundUser.id,
        admin: foundUser.admin
      }
    };
    jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      console.log('Success!')
      res.status(201).json({ token })
    })
  
  } catch (err) {
    console.log('Error: ', err.message);
    res.status(500).json({ errors: { msg: 'Server error' } });
  }
});

module.exports = router;
