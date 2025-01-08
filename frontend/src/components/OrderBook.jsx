import React, { useEffect, useState } from "react";
import { getConsolidatedBook } from "../services/api";
import { socket } from "../sockets/socket";
import "../styles/OrderBook.css";

const OrderBook = ({ symbol, onGoBack }) => {
    const [orderBook, setOrderBook] = useState([]);
    const [loading, setLoading] = useState(true); // To handle loading state
    const [error, setError] = useState(null); // For error handling

    // Helper function to aggregate sizes by price
    const aggregateOrderBook = (data) => {
        const aggregatedData = {};

        data.forEach((level) => {
            const { bid_price, bid_size, offer_price, offer_size } = level;

            if (bid_price) {
                if (!aggregatedData[bid_price]) {
                    aggregatedData[bid_price] = { bid_size: 0, offer_size: 0 };
                }
                aggregatedData[bid_price].bid_size += bid_size;
            }

            if (offer_price) {
                if (!aggregatedData[offer_price]) {
                    aggregatedData[offer_price] = { bid_size: 0, offer_size: 0 };
                }
                aggregatedData[offer_price].offer_size += offer_size;
            }
        });

        // Convert aggregated data back into an array
        return Object.entries(aggregatedData).map(([price, sizes]) => ({
            price,
            bid_size: sizes.bid_size,
            offer_size: sizes.offer_size,
        }));
    };

    useEffect(() => {
        // Fetch initial data
        const fetchOrderBook = async () => {
            setLoading(true);
            try {
                const data = await getConsolidatedBook(symbol);
                const aggregated = aggregateOrderBook(data.top5Levels);
                setOrderBook(aggregated);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching order book:", error);
                setError("Failed to load order book");
                setLoading(false);
            }
        };
        fetchOrderBook();

        // Listen for real-time updates
        socket.on("orderBookUpdate", (updatedBook) => {
            const aggregated = aggregateOrderBook(updatedBook);
            setOrderBook(aggregated);
        });

        // Cleanup listener
        return () => {
            socket.off("orderBookUpdate");
        };
    }, [symbol]);

    if (loading) {
        return <div>Loading...</div>; // Display loading state
    }

    if (error) {
        return <div>{error}</div>; // Display error message
    }

    return (
        <div className="order-book-container">
            <h2 className="order-book-title">Order Book for {symbol}</h2>
            <table className="order-book-table">
                <thead>
                <tr>
                    <th>Rank</th>
                    <th>Bid Price</th>
                    <th>Bid Size</th>
                    <th>Offer Price</th>
                    <th>Offer Size</th>
                </tr>
                </thead>
                <tbody>
                {orderBook.map((level, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{level.bid_price}</td> {/* Corrected column */}
                        <td>{level.bid_size}</td>
                        <td>{level.offer_price}</td> {/* Corrected column */}
                        <td>{level.offer_size}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button className="go-back-button" onClick={onGoBack}>
                Go Back
            </button>
        </div>
    );
};

export default OrderBook;
