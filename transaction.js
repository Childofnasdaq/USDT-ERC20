const express = require('express');
const router = express.Router();

let transactionHistory = []; // Store transactions in memory

// Get transaction history
router.get('/', (req, res) => {
    res.json(transactionHistory);
});

// Add a new transaction (called from `app.js` when a transaction occurs)
router.post('/add', (req, res) => {
    const { type, amount, to, txHash } = req.body;
    transactionHistory.unshift({ type, amount, to, txHash });
    res.sendStatus(200);
});

module.exports = { router, transactionHistory };
