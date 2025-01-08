
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const bookRoutes = require("./routes/bookRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require('./routes/auth');
const connectDB = require("./config/db");
const http = require('http');
const {Server} = require('socket.io')

dotenv.config();

const app = express();

connectDB();
//socket connection
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // React app
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }
});

app.use(cors());

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Add middleware before `orderRoutes`
app.use('/api/orders', (req, res, next) => {
  req.io = io; // Attach `io` to the request object
  next();
});

//connection to databases

//Base routes for all API endpoint
app.use('/api/orders', orderRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/auth', authRoutes);

// Initialize Socket.IO connection (can be left here or inside controller)
io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 5000; 
// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
