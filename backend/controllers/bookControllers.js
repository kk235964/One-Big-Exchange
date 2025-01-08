
const ConsolidatedBook = require('../models/consolidatedBook');

// Retrieve the top 5 levels of the consolidated book for a symbol
const getConsolidatedBook = async (req, res, io) => {
    try {
        const { symbol } = req.params;

// Array to store the order counts for each symbol
        const orderCounts = [];

// Fetch all unique symbols from the database
        const allSymbols = await ConsolidatedBook.distinct('symbol');

// Iterate through each symbol and fetch the count of orders
        for (const sym of allSymbols) {
            const counts = await ConsolidatedBook.countDocuments({symbol: sym});
            orderCounts.push({symbol: sym, count: counts});
        }

        //emit orderCounts to all connected clients
        io.emit('orderCounts', orderCounts);
        console.log('Order Counts:', orderCounts);
        
        // Fetch the consolidated book for the symbol
        const book = await ConsolidatedBook.findOne({ symbol });
    
        if (!book) {
          return res.status(404).json({ message: "Book not found" });
        }
        
        
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
