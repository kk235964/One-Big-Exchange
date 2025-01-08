import React, { useState } from "react";
import "../styles/SymbolInput.css";

const SymbolInput = ({ setSymbol }) => {
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            setSymbol(inputValue.trim().toUpperCase());
        }
    };

    return (
        <div className="symbol-input-container">
            <h1 className="symbol-input-title">Enter a Symbol</h1>
            <form onSubmit={handleSubmit} className="symbol-form">
                <input
                    type="text"
                    placeholder="Enter Symbol (e.g., AAPL)"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="symbol-input"
                />
                <button type="submit" className="symbol-submit-btn">
                    Fetch Order Book
                </button>
            </form>
        </div>
    );
};

export default SymbolInput;
