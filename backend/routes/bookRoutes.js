const express = require('express');
const getConsolidatedBook = require('../controllers/bookControllers');

const router = express.Router();
// Route to get the top 5 levels of the consolidated book
router.get('/:symbol', (req, res)=> getConsolidatedBook(req, res, req.io));

module.exports = router;
