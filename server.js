// Entry point to the back-end
const express = require('express');

// Init express in app variable
const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
