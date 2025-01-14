
const ConsolidatedBook = require('../models/consolidatedBook');

// Retrieve the top 5 levels of the consolidated book for a symbol
const getConsolidatedBook = async (req, res) => {
    try {
        const { symbol } = req.params;


        // Fetch the consolidated book for the symbol
        const book = await ConsolidatedBook.findOne({ symbol });
    
        if (!book) {
          return res.status(404).json({ message: "Book not found" });
        }
        console.log(book);
        // Limit to top 5 levels
        const top5Levels = book.levels.slice(0, 5);
        
        
        return res.status(200).json({
          symbol: book.symbol,
          top5Levels,
        });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
};

module.exports = getConsolidatedBook;
