import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import OrdersPage from './pages/OrdersPage';
import NotFoundPage from './pages/NotFoundPage';
import Navigation from './components/Navigation';
import ConsolidatedBook from './pages/ConsolidatedBook';
import Login from "./components/Login";
import Signup from "./components/SignUp";
import ProtectedRoutes from "./components/ProtectedRoutes";


const App = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    const toggleSignUp = () => {
        setShowSignUp(!showSignUp);
    };

    const toggleLoginPopup = () => {
        setShowLogin(!showLogin);
    };
  return (
    <Router>
      <Navigation onLoginClick={toggleLoginPopup} onSignUpClick={toggleSignUp} />

      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path='/consolidatedBook' element={<ConsolidatedBook/>} />
        <Route path="/orders" element={<ProtectedRoutes><OrdersPage /></ProtectedRoutes>} />
        <Route path="*" element={<NotFoundPage />} />
        </Routes>
        {showLogin && (
            <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                <Login onClose={toggleLoginPopup} />
            </div>
        )}
        {showSignUp && (
            <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                <Signup onClose={toggleSignUp} />
            </div>
        )}
    </Router>
  );
};

export default App;
