import React, { useEffect, useRef } from 'react';
import AnimatedGraph from "../components/AnimatedGraph";
import Navigation from "../components/Navigation";
import Login from "../components/Login";
import { ToastContainer, toast } from 'react-toastify';  // Import toastify components
import 'react-toastify/dist/ReactToastify.css';  // Import toastify styles

const HomePage = ({ name, isAuthenticated }) => {
    const data = useRef([]);
    const titleRef = useRef(null);

    const title = "Welcome to One Big Exchange";
    // Animate the title letter by letter using native DOM manipulation
    useEffect(() => {
        let titleIndex = 0;
        const titleInterval = setInterval(() => {
            titleRef.current.textContent += title[titleIndex];
            titleIndex++;
            if (titleIndex === title.length) clearInterval(titleInterval);
        }, 50);

        return () => {
            clearInterval(titleInterval);
        };
    }, []);

    // Handle Order button click and check for token
    const handleOrderClick = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("You need to be logged in to place an order!");  // Show toast if no token is found
        } else {
            // Proceed with order logic, like redirecting to the order page
            console.log("Token exists, proceed with order!");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 ref={titleRef} className="mt-5 text-3xl md:text-4xl lg:text-5xl font-extrabold text-indigo-300 text-center">
                {/* The text will be animated directly in the ref */}
            </h1>

            {/* Graph */}
            <div className="mt-12 w-full max-w-4xl">
                <AnimatedGraph />
            </div>

            {/* Order Button */}


            {/* Toast container for notifications */}

        </div>
    );
};

export default HomePage;
