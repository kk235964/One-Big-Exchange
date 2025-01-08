const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    symbol: {type: String, required: true},
    limitPrice: {type: Number, required: true},
    side: {type: String, enum:['BUY', 'SELL'], required: true},
    quantity: {type: Number, required: true}
}, {timestamps: true});

const Model = mongoose.model("Order", orderSchema);

module.exports = Model;