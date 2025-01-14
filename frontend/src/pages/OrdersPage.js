import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { socket } from '../sockets/socket';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Order Modal State
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createForm, setCreateForm] = useState({
    symbol: '',
    limitPrice: '',
    side: '',
    quantity: '',
  });

  // Edit Order Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    id: '',
    newQuantity: '',
  });

  // WebSocket Updates
  useEffect(() => {
    socket.on('orderCreated', (newOrder) => setOrders((prev) => [...prev, newOrder]));
    socket.on('orderModified', (updatedOrder) => {
      setOrders((prev) =>
          prev.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
      );
    });
    socket.on('orderCancelled', (canceledOrderId) => {
      setOrders((prev) => prev.filter((order) => order._id !== canceledOrderId));
    });

    return () => {
      socket.off('orderCreated');
      socket.off('orderModified');
      socket.off('orderCancelled');
    };
  }, []);

  // Fetch Initial Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders');
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  // Handle Create Form Input
  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setCreateForm({ ...createForm, [name]: value });
  };

  // Handle Edit Form Input
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  // Submit Create Order
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/orders/create', createForm);
      setCreateModalVisible(false);
      setCreateForm({ symbol: '', limitPrice: '', side: '', quantity: '' });
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  // Submit Edit Order
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/orders/modify/${editForm.id}`, {
        newQuantity: editForm.newQuantity,
      });
      setEditModalVisible(false);
    } catch (error) {
      console.error('Error editing order:', error);
    }
  };

  // Cancel Order
  const handleCancelOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/orders/cancel/${id}`);
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  if (loading) return <div className="text-center text-gray-400">Loading...</div>;

  return (
          <div className="p-6 bg-gray-900 min-h-screen text-gray-300">
            <h1 className="text-3xl font-bold mb-6 text-white">Orders</h1>

            {/* Create Order Button */}
            <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={() => setCreateModalVisible(true)}
            >
              Create Order
            </button>

            {/* Create Order Modal */}
            {createModalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-white">
                    <h2 className="text-xl font-semibold mb-4">Create Order</h2>
                    <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4">
                      <input
                          type="text"
                          name="symbol"
                          value={createForm.symbol}
                          onChange={handleCreateInputChange}
                          placeholder="Symbol"
                          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300"
                          required
                      />
                      <input
                          type="number"
                          name="limitPrice"
                          value={createForm.limitPrice}
                          onChange={handleCreateInputChange}
                          placeholder="Limit Price"
                          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300"
                          required
                      />
                      <select
                          name="side"
                          value={createForm.side}
                          onChange={handleCreateInputChange}
                          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300"
                          required
                      >
                        <option value="">Select Side</option>
                        <option value="BUY">BUY</option>
                        <option value="SELL">SELL</option>
                      </select>
                      <input
                          type="number"
                          name="quantity"
                          value={createForm.quantity}
                          onChange={handleCreateInputChange}
                          placeholder="Quantity"
                          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300"
                          required
                      />
                      <div className="flex justify-between">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Submit
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            onClick={() => setCreateModalVisible(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
            )}

            {(editModalVisible) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-white">
                        <h2 className="text-xl font-semibold mb-4">Edit Order</h2>
                        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                            <input
                                type="number"
                                name="newQuantity"
                                value={editForm.newQuantity}
                                onChange={handleEditInputChange}
                                placeholder="New Quantity"
                                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300"
                                required
                            />
                            <div className="flex justify-between">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    onClick={() => setEditModalVisible(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* Order Table */}
            <div className="mt-6">
              <table className="w-full table-auto border-collapse border border-gray-700 text-gray-300">
                <thead>
                <tr className="bg-gray-800">
                  <th className="border border-gray-700 px-4 py-2">Order ID</th>
                  <th className="border border-gray-700 px-4 py-2">Symbol</th>
                  <th className="border border-gray-700 px-4 py-2">Limit Price</th>
                  <th className="border border-gray-700 px-4 py-2">Side</th>
                  <th className="border border-gray-700 px-4 py-2">Quantity</th>
                  <th className="border border-gray-700 px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-800">
                      <td className="border border-gray-700 px-4 py-2">{order._id}</td>
                      <td className="border border-gray-700 px-4 py-2">{order.symbol}</td>
                      <td className="border border-gray-700 px-4 py-2">{order.limitPrice}</td>
                      <td className="border border-gray-700 px-4 py-2">{order.side}</td>
                      <td className="border border-gray-700 px-4 py-2">{order.quantity}</td>
                      <td className="border border-gray-700 px-4 py-2 flex gap-2">
                        <button
                            onClick={() => {
                              setEditModalVisible(true);
                              setEditForm({ id: order._id, newQuantity: order.quantity });
                            }}
                            className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                        >
                          Edit
                        </button>
                        <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>

  );

};

export default OrdersPage;
