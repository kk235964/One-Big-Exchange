import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getConsolidatedBook = async (symbol) => {
    const response = await axios.get(`${API_URL}/book/${symbol}`);
    return response.data;
};
