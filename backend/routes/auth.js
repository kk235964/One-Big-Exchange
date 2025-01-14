const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();


const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            username,
            email,
            password
        });
        // hashing and salting has been done in user Schema
        user.password = password ; 

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            'yourSecretToken',
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`Email: ${email}, Password: ${password}`);

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        console.log(`User found: ${user}`);
        if (!user) {
            //send error

            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password match: ${isMatch}`);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create JWT payload
        const payload = {
            user: {
                id: user.id
            }
        };

        // Sign and return JWT token
        jwt.sign(
            payload,
            process.env.JWT_TOKEN, // Use environment variable
            { expiresIn: '1h' }, // Token expiry
            (err, token) => {
                if (err) throw err;
                console.log(token);
                res.json({ token ,user: {name:user.username}});
            }
        );

    } catch (err) {
        console.error(`Error: ${err.message}`);
        res.status(500).send('Server error');
    }
});

module.exports = router;

