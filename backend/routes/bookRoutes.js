const express = require('express');
const getConsolidatedBook = require('../controllers/bookControllers');

const router = express.Router();
// Route to get the top 5 levels of the consolidated book
router.get('/:symbol', getConsolidatedBook);

module.exports = router;
