const Order = require('../models/Orders');
const ConsolidatedBook = require("../models/consolidatedBook");

// Create a new order

//Get all orders from the orderBook collection also if their is change in the data base it should appear to every user in real time who are connected to the server
const getOrders = async (req, res, io) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);

        // Emit the orders to all connected clients
        io.emit('orders', orders);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to get orders' });
        }
   };

// Create a new order and add it to the order book collection also update the consolidated book collection with the new order

const createOrder = async (req, res, io) => {
    try {
        const { symbol, limitPrice, side, quantity } = req.body;

        // Check if the order already exists
        const existingOrder = await Order.findOne({ symbol, limitPrice, side });
        if (existingOrder) {
            return res.status(400).json({ error: 'Order already exists' });
        }

        // Create a new order
        const order = new Order({ symbol, limitPrice, side, quantity });
        await order.save();

        // Update consolidated book with new order
        await ConsolidatedBook.updateBook(symbol, limitPrice, side, quantity);

        io.emit('orderCreated', order);
        res.status(201).json({ message: 'Order created successfully', order });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

// Modify an existing order
const modifyOrder = async (req, res, io) => {
    try {
        const { id } = req.params;
        const { newQuantity } = req.body;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // If quantity is the same, no update needed
        if (order.quantity === newQuantity) {
            return res.status(200).json({ message: 'Order quantity is already the same' });
        }

        // Adjust consolidated book with old quantity (removal of old quantity)
        await ConsolidatedBook.updateBook(order.symbol, order.limitPrice, order.side, -order.quantity);

        // Update the order's quantity
        order.quantity = newQuantity;
        await order.save();

        
        // Update consolidated book with new quantity (addition of new quantity)
        await ConsolidatedBook.updateBook(order.symbol, order.limitPrice, order.side, newQuantity);
        
        io.emit('orderModified', order);
        res.status(200).json({ message: 'Order modified successfully', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to modify order' });
    }
};

// Cancel an order
const cancelOrder = async (req, res, io) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Update consolidated book to remove order quantity
        await ConsolidatedBook.updateBook(order.symbol, order.limitPrice, order.side, -order.quantity);

        // Remove the order from the database
        await order.deleteOne(); 

        io.emit('orderCancelled', id);


        res.status(200).json({ message: 'Order canceled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to cancel order' });
    }
};

module.exports = {
    getOrders,
    createOrder,
    modifyOrder,
    cancelOrder,
};
