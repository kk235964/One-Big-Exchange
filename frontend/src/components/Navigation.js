import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { MdShowChart } from 'react-icons/md'; // Stock-related logo
import { ToastContainer, toast } from 'react-toastify';  // Import Toastify components
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify styles
import '../styles/Nav.css'; // For global background and pointer effects

const Navigation = ({ onLoginClick, onSignUpClick }) => {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('token');

    // Show a toast when "Orders" is clicked and the user is not authenticated
    const handleOrdersClick = () => {
        if (!isAuthenticated) {
            toast.error("You need to be logged in to view orders!");
        } else {
            // Navigate to orders page if authenticated
            navigate('/orders');
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <nav className="bg-opacity-80 backdrop-blur-md bg-blue-900 text-white p-4 flex justify-between items-center shadow-lg">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
                <MdShowChart className="text-yellow-400 text-2xl" />
                <h1 className="text-xl font-bold">One Big Exchange</h1>
                <Link to="/" className="hover:text-yellow-400 transition duration-200 text-lg">
                    Home
                </Link>
                <button
                    onClick={handleOrdersClick}
                    className="hover:text-yellow-400 transition duration-200 text-lg"
                >
                    Orders
                </button>
                <Link to="/consolidatedBook" className="hover:text-yellow-400 transition duration-200 text-lg">
                    Consolidated Book
                </Link>
            </div>

            {/* Right Section */}
            <div className="flex space-x-4 ml-auto">
                {isAuthenticated ? (
                    <>
                        <span className="text-lg mr-2">
                            {localStorage.getItem('name') ? `Hello, ${localStorage.getItem('name')}` : 'User'}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center hover:text-yellow-400 transition duration-200 text-lg"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={onSignUpClick}
                            className="flex items-center hover:text-yellow-400 transition duration-200 text-lg"
                        >
                            <FaUserPlus className="mr-1" />
                            Sign Up
                        </button>
                        <button
                            onClick={onLoginClick}
                            className="flex items-center hover:text-yellow-400 transition duration-200 text-lg"
                        >
                            <FaSignInAlt className="mr-1" />
                            Login
                        </button>
                    </>
                )}
            </div>

            {/* Toast container to render the toasts */}
            <ToastContainer />
        </nav>
    );
};

export default Navigation;
