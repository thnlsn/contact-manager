// CRUD for each specific users contacts

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const User = require('../models/User');
const Contact = require('../models/Contact');

// @route       GET api/contacts
// @desc        Get all users contacts (NOT ALL CONTACTS ON THE DATABASE)
// @access      Private
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1 // -1 orders the contacts from most recent first
    }); // (req.user.id) is coming from the jwt user object in auth.js (middleware), so it's finding the user with that mongo id
    res.json(contacts); // turns the array into json
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route       POST api/contacts
// @desc        Add new contacts
// @access      Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required')
        .not()
        .isEmpty(),
      check('email', 'Email is required').isEmail()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req); // errors for if any of the above fields did not match their validations
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() }); // if there are errors, send them and a 400 code
    }

    const { name, email, phone, type } = req.body; // destructuring
    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id
      });

      const contact = await newContact.save();

      res.json(contact);
    } catch (err) {
      console.error(er.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route       GET api/contacts/:id
// @desc        Get all users contacts
// @access      Private
router.put('/:id', auth, (req, res) => {
  res.send('Update contact');
});

// @route       DELETE api/contacts
// @desc        Delete contact
// @access      Private
router.delete('/:id', auth, (req, res) => {
  res.send('Delete contact');
});

module.exports = router;
