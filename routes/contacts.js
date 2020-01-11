// CRUD for each specific users contacts

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // basically just gives access to the user in the token
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
      }); // creating a new contact in the database with the inputted info as well as the id from the token (for relation to a registered user)

      const contact = await newContact.save(); // saving to database

      res.json(contact); // return info to user
    } catch (err) {
      console.error(er.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route       PUT api/contacts/:id
// @desc        Update contact
// @access      Private
router.put('/:id', auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  // build contact object (these are the fields we would be editing)
  const contactFields = {};
  if (name) contactFields.name = name; // if name exists in req.body, add it to contactFields
  if (email) contactFields.email = email; // if email exists in req.body, add it to contactFields
  if (phone) contactFields.phone = phone; // if phone exists in req.body, add it to contactFields
  if (type) contactFields.type = type; // if type exists in req.body, add it to contactFields

  try {
    let contact = await Contact.findById(req.params.id); // create contact based on the id in the endpoint

    if (!contact) return res.status(404).json({ msg: 'Contact not found' }); // if their search doesn't exist

    // make sure users OWNS the contact being updated (so someone can't just change them with Postman etc.)
    // this is done by making sure that the id in the user (owner) field of the contact (the relational field) is the same as the currently logged in user ((req.user.id), which is found in the token in auth)
    // contact.user is not a string by default, but req.user.id is, thats why we use .toString()
    console.log(contact.user);
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id, // this is the id we find by (_id)
      { $set: contactFields }, // setting the fields of the contact to the updated fields
      { new: true } // if this contact doesn't exist, then just create it
    );

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route       DELETE api/contacts
// @desc        Delete contact
// @access      Private
router.delete('/:id', auth, (req, res) => {
  res.send('Delete contact');
});

module.exports = router;
