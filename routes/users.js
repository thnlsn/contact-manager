// Register route

const express = require('express');
const router = express.Router();

// @route       POST api/users      (the '/' is actually api/users because in server.js it is being used at that)
// @desc        Register a user
// @access      Public
router.post('/', (req, res) => {
  res.send('Register a user');
});

module.exports = router;
