const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
    console.log(email, password)

    try {
        let user = await User.findOne({ email });
        console.log(user)
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials, no credentials' });
        }

        const isMatch = await user.comparePassword(password, user.password)
        console.log(isMatch)
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

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
        
        return res.render('/consolidatedBook', {isMatch});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
  
module.exports = router;

