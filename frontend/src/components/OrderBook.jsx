import React, { useEffect, useState } from "react";
import { getConsolidatedBook } from "../services/api";
import "../styles/OrderBook.css";

const OrderBook = ({ symbol, onGoBack }) => {
    const [orderBook, setOrderBook] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderBook = async () => {
            setLoading(true);
            try {
                const data = await getConsolidatedBook(symbol);
                setOrderBook(data.top5Levels); // Use the API response directly
                setLoading(false);
            } catch (error) {
                setError("Failed to load order book");
                setLoading(false);
            }
        };
        fetchOrderBook();
    }, [symbol]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Filter out rows with missing bid or offer data
    const bids = orderBook
        .filter((level) => level.bid_price && level.bid_size) // Remove rows with missing bids
        .map((level, index) => ({
            rank: index + 1,
            price: level.bid_price,
            size: level.bid_size,
        }));

    const offers = orderBook
        .filter((level) => level.offer_price && level.offer_size) // Remove rows with missing offers
        .map((level, index) => ({
            rank: index + 1,
            price: level.offer_price,
            size: level.offer_size,
        }));

    return (
        <div className="order-book-container">
            <h2 className="order-book-title">Order Book for {symbol}</h2>

            <div className="order-book-tables">
                {/* Bids Table */}
                <div className="bids-table">
                    <h3>Bids</h3>
                    <table className="order-book-table">
                        <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Price</th>
                            <th>Size</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bids.map((bid) => (
                            <tr key={bid.rank}>
                                <td>{bid.rank}</td>
                                <td>{bid.price}</td>
                                <td>{bid.size}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Offers Table */}
                <div className="offers-table">
                    <h3>Offers</h3>
                    <table className="order-book-table">
                        <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Price</th>
                            <th>Size</th>
                        </tr>
                        </thead>
                        <tbody>
                        {offers.map((offer) => (
                            <tr key={offer.rank}>
                                <td>{offer.rank}</td>
                                <td>{offer.price}</td>
                                <td>{offer.size}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <button className="go-back-button" onClick={onGoBack}>
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default OrderBook;
