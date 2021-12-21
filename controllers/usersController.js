const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/UserModel');

// '/profile' or just '/' ?
// Isnt' this the same as GET /auth/
router.get('/profile', auth, async (req, res) => {
  try {
    // using the user info from the jwt decoded in middleware (minus the pw field)
    const user = await User.findById(req.user.id).select('-password');
    return res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ errors: { msg: 'Server error' } });
  }
});

// Update User
router.put('/profile', auth, async (req, res) => {
  try {
    const updatedOwner = await Owner.findByIdAndUpdate(req.user.id, req.body, { new: true, });
    return res.status(200).json(updatedOwner);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// Delete User

module.exports = router;
