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
      date: -1
    });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  res.send('Get all users contacts');
});

// @route       POST api/contacts
// @desc        Add new contacts
// @access      Private
router.post('/', auth, (req, res) => {
  res.send('Add contact');
});

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
