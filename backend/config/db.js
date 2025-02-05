const mongoose = require('mongoose')

const connectDB = async ()=>{
    try {
        const conn = mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${(await conn).connection.host}`);
    }
    catch (error){
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;