const express = require('express');
const { createOrder, modifyOrder, cancelOrder, getOrders } = require('../controllers/orderControllers');

const router = express.Router()

router.get('/',(req, res)=> getOrders(req, res, req.io));

router.post('/create',(req, res)=> createOrder(req, res, req.io));

router.put('/modify/:id',(req, res)=> modifyOrder(req, res, req.io));

router.delete('/cancel/:id',(req, res)=> cancelOrder(req, res, req.io));



module.exports = router;