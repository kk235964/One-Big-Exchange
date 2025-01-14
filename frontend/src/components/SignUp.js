import React, { useState } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import {toast} from "react-toastify";
import { useNavigate} from "react-router-dom";  // Import toastify styles

const Signup = ({ onClose }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });


    const { username, email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const navigate = useNavigate();
    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            console.log(res.data);
            //toastify success alert
            toast.success('Your account is successfully created, Please login');
            onClose();
        } catch (err) {
            console.error(err.response?.data || 'An error occurred');
            toast.error(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                className="w-full max-w-md p-6 bg-gray-800 shadow-xl rounded-lg transform transition-transform duration-500 scale-100 animate-slideDown"
            >
                <h2 className="text-xl font-semibold text-center text-white mb-4">Sign Up</h2>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-300"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={onChange}
                            required
                            className="w-full px-3 py-2 mt-1 text-gray-300 bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-indigo-300 focus:outline-none"
                        />
                    </div>
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
                    <div className="flex justify-between gap-4">
                        <button
                            type="submit"
                            className="w-full py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
                        >
                            Sign Up
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
