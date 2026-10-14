const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Users = require("../models/Users");

// Creating endpoint for registering the user
router.post('/signup', async (req, res) => {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, errors: "Existing user found with same email address" });
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        cartData: cart,
    })
    await user.save();

    const data = {
        user: {
            id: user.id
        }
    }
    const token = jwt.sign(data, process.env.JWT_SECRET);
    res.json({ success: true, token })
})

// Creating endpoint for user login
router.post('/login', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
        const passCompare = await bcrypt.compare(req.body.password, user.password);
        if (passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, process.env.JWT_SECRET);
            res.json({ success: true, token });
        }
        else {
            res.json({ success: false, errors: "Wrong Password" });
        }
    }
    else {
        res.json({ success: false, errors: "Wrong Email Id" });
    }
})

// Admin login - checks credentials against backend/.env, issues a short admin token
router.post('/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
            return res.status(500).json({ success: false, errors: "Admin credentials are not configured. Add ADMIN_USERNAME and ADMIN_PASSWORD to backend/.env" });
        }
        if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ success: false, errors: "Invalid username or password" });
        }
        const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: "12h" });
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: "Could not log in" });
    }
})

module.exports = router;
