const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../models/UserModel');

// CREATE NEW USER
router.post('/register', [
  check('username', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 8 or more characters').isLength({ min: 6 })
], async (req, res) => {
  const { username, email, password, passwordCheck } = req.body;
  
  // Validate user data and send errors array if any.
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  };
  if (password !== passwordCheck) {
    return res.status(400).json({ errors: [{ msg: 'Passwords do not match', param: 'password'}] })
  }

  try {
    // Check if user exists
    const foundUser = await User.findOne({ email: email.toLowerCase() });
    if (foundUser) {
      return res.status(400).json({ errors: [{ msg: 'User already exists', param: 'email'}] })
    };

    // Get gravatar if exist or default image (size, rating, default)
    const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'retro' });

    // Create new User
    newUser = new User ({ username, email: email.toLowerCase(), avatar });

    // Encrypt password
    const salt = await bcrypt.genSalt(12);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();
  
    // Create and return jsonwebtoken
    const payload = {
      user: {
        id: newUser.id,
        // admin: newUser.admin
      }
    }
    jwt.sign(payload, config.get('jwtSecret'), { expiresIn: '14d' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({ token })
    })
  
  } catch (err) {
    console.log('Error: ', err.message);
    res.status(500).json({ msg: 'Server error' });
    // res.status(500).json({ errors: [{ msg: 'Server error', param: ''}] });
  }
});

module.exports = router;
