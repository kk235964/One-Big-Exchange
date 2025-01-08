import React, { useState } from "react";
import SymbolInput from "./SymbolInput.jsx";
import OrderBook from "./OrderBook.jsx";
import Login from "./Login.js";
import "../styles/App.css";

const App = (isLoggedIn) => {
    const [symbol, setSymbol] = useState("");
    // const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleGoBack = () => {
        setSymbol(null);
    };

    return (
        <div className="app-container">
            {!isLoggedIn ? (
                <Login />
            ) : !symbol ? (
                <SymbolInput setSymbol={setSymbol} />
            ) : (
                <OrderBook symbol={symbol} onGoBack={handleGoBack} />
            )}
        </div>
    );
};

export default App;
