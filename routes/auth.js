const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const User = require('../models/User');

// @route       GET api/auth
// @desc        Get logged in user
// @access      Private
router.get('/', (req, res) => {
  res.send('Get logged in user');
});

// @route       POST api/auth
// @desc        Authenticate user & get token (when a registered user tries to log in)
// @access      Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(), // check if inputted email IS an email
    check('password', 'Password is required').exists() // check if there is a password inputted
  ],
  async (req, res) => {
    const errors = validationResult(req); // errors for if any of the above fields did not match their validations
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() }); // if there are errors, send them and a 400 code
    }
    const { email, password } = req.body; // destructure res.body

    try {
      let user = await User.findOne({ email }); // findOne returns a promise, so await for the email and set it to var user

      if (!user) { // if there is NOT a user (email in database) respond with msg, otherwise move on...
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password); // checking if the password they inputted matches the one in database
      
      if (!isMatch) { // if it DOES NOT match, respond with msg
        return res.status(400).json({ 'Invalid Credentials' })
      }
      
      

    } catch (err) {}
  }
);

module.exports = router;
