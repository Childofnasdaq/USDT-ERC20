require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { router } = require('./routes/transactions');

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use('/transactions', router);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
