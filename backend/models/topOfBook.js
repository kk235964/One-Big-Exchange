// const mongoose = require('mongoose');
//
// // TopOfBook schema definition
// const topOfBookSchema = new mongoose.Schema({
//     symbol: { type: String, required: true }, // The asset symbol (e.g., AAPL, GOOG)
//     bestBidPrice: { type: Number, required: true }, // Highest bid price
//     bestBidSize: { type: Number, required: true }, // Size of the best bid
//     bestOfferPrice: { type: Number, required: true }, // Lowest offer price
//     bestOfferSize: { type: Number, required: true }, // Size of the best offer
// }, { timestamps: true }); // Automatically add createdAt and updatedAt fields
//
// // Create model from the schema
// const TopOfBook = mongoose.model('TopOfBook', topOfBookSchema);
//
// module.exports = TopOfBook;
