const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
  bid_size: { type: Number, default: 0 },
  bid_price: { type: Number, default: 0 },
  offer_price: { type: Number, default: 0 },
  offer_size: { type: Number, default: 0 },
});

const consolidatedBookSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  levels: { type: [levelSchema], default: [] }, // Array of levels
}, { timestamps: true });

// Define the updateBook method
consolidatedBookSchema.statics.updateBook = async function(symbol, limitPrice, side, quantity) {
  let book = await this.findOne({ symbol });

  // If symbol doesn't exist, initialize it with empty levels
  if (!book) {
    book = await this.create({
      symbol,
      levels: [],
    });
  }

  // Logic to find if the price level already exists
  let level;
  if (side === 'BUY') {
    // Look for an existing bid at the price level
    level = book.levels.find(level => level.bid_price === limitPrice);
    if (level) {
      level.bid_size += quantity; // Add quantity to the existing bid
    } else {
      // Add a new bid level if not found
      book.levels.push({
        bid_price: limitPrice,
        bid_size: quantity,
        offer_price: 0,
        offer_size: 0
      });
    }
  } else if (side === 'SELL') {
    // Look for an existing offer at the price level
    level = book.levels.find(level => level.offer_price === limitPrice);
    if (level) {
      level.offer_size += quantity; // Add quantity to the existing offer
    } else {
      // Add a new offer level if not found
      book.levels.push({
        bid_price: 0,
        bid_size: 0,
        offer_price: limitPrice,
        offer_size: quantity
      });
    }
  }

  // Sort the levels: bids in descending order, offers in ascending order
  book.levels.sort((a, b) => {
    if (a.bid_price && b.bid_price) {
      return b.bid_price - a.bid_price; // Sort bids in descending order
    }
    if (a.offer_price && b.offer_price) {
      return a.offer_price - b.offer_price; // Sort offers in ascending order
    }
    return 0;
  });

  // Save the updated book
  await book.save();

  // Return the updated book object
  return book;
};

// Create and export the model
module.exports = mongoose.model('ConsolidatedBook', consolidatedBookSchema);
