import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate, redirect} from "react-router-dom";
import OrderBook from "./OrderBook";
import OrdersPage from "../pages/OrdersPage";

const Login = ({ onClose }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            console.log(res);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('name', res.data.user.name);
            navigate('/');

        } catch (err) {
            console.error(err.response?.data || 'An error occurred');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                className="w-full max-w-md p-6 bg-gray-800 shadow-xl rounded-lg transform transition-transform duration-500 scale-100 animate-slideDown"
            >
                <h2 className="text-xl font-semibold text-center text-white mb-4">User Login</h2>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-300"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                            className="w-full px-3 py-2 mt-1 text-gray-300 bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-indigo-300 focus:outline-none"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-300"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                            className="w-full px-3 py-2 mt-1 text-gray-300 bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-indigo-300 focus:outline-none"
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <button
                            type="submit"
                            className="px-6 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
                        >
                            Login
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
