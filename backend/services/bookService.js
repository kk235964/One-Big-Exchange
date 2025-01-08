// bookService.js

const Order = require('../models/Orders'); // Assuming Order model
const TopOfBook = require('../models/topOfBook'); // Assuming TopOfBook model

// Function to consolidate the book by symbol
const getConsolidatedBook = async (symbol) => {
    try {
        // Fetch the top of book data from multiple exchanges (e.g., 'exchange1', 'exchange2', ...)
        const topOfBookData = await TopOfBook.find({ symbol });

        // Fetch the orders for the given symbol
        const orders = await Order.find({ symbol });

        // Step 1: Consolidate bid prices and offer prices
        const bidLevels = [];
        const offerLevels = [];

        topOfBookData.forEach((data) => {
            bidLevels.push({ price: data.bestBidPrice, size: data.bestBidSize });
            offerLevels.push({ price: data.bestOfferPrice, size: data.bestOfferSize });
        });

        // Step 2: Consolidate orders (NEW_ORDER, CANCEL_ORDER, MODIFY_ORDER)
        orders.forEach((order) => {
            if (order.side === 'BUY') {
                bidLevels.push({ price: order.limitPrice, size: order.quantity });
            } else if (order.side === 'SELL') {
                offerLevels.push({ price: order.limitPrice, size: order.quantity });
            }
        });

        // Step 3: Sort bid and offer prices
        bidLevels.sort((a, b) => b.price - a.price);  // Highest bid first
        offerLevels.sort((a, b) => a.price - b.price); // Lowest offer first

        // Step 4: Aggregate sizes at each price level
        const consolidatedBook = [];
        let currentBidPrice = null;
        let currentOfferPrice = null;
        let bidSize = 0;
        let offerSize = 0;

        // Consolidating bid levels
        bidLevels.forEach((level) => {
            if (currentBidPrice === level.price) {
                bidSize += level.size;
            } else {
                if (currentBidPrice !== null) {
                    consolidatedBook.push({
                        bidPrice: currentBidPrice,
                        bidSize: bidSize,
                        offerPrice: currentOfferPrice,
                        offerSize: offerSize
                    });
                }
                currentBidPrice = level.price;
                bidSize = level.size;
            }
        });

        // Consolidating offer levels
        offerLevels.forEach((level) => {
            if (currentOfferPrice === level.price) {
                offerSize += level.size;
            } else {
                if (currentOfferPrice !== null) {
                    consolidatedBook.push({
                        bidPrice: currentBidPrice,
                        bidSize: bidSize,
                        offerPrice: currentOfferPrice,
                        offerSize: offerSize
                    });
                }
                currentOfferPrice = level.price;
                offerSize = level.size;
            }
        });

        // Returning the top 5 levels from the consolidated book
        return consolidatedBook.slice(0, 5);
    } catch (error) {
        throw new Error(`Error in consolidating book: ${error.message}`);
    }
};

module.exports = {
    getConsolidatedBook,
};
