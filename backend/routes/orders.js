const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Product = require("../models/Product");
const Users = require("../models/Users");
const Order = require("../models/Order");
const fetchUser = require("../middleware/fetchUser");
const fetchAdmin = require("../middleware/fetchAdmin");
const razorpayInstance = require("../utils/razorpay");
const getDefaultCartServer = require("../utils/defaultCart");

// Create a Razorpay order in TEST MODE (no real money moves - uses test API keys)
router.post('/createrazorpayorder', fetchUser, async (req, res) => {
    try {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ success: false, errors: "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/.env" });
        }

        const userData = await Users.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ success: false, errors: "User not found" });
        }

        const products = await Product.find({});
        let totalAmount = 0;
        let hasItems = false;
        for (const id in userData.cartData) {
            if (userData.cartData[id] > 0) {
                const product = products.find((p) => p.id === Number(id));
                if (product) {
                    totalAmount += product.new_price * userData.cartData[id];
                    hasItems = true;
                }
            }
        }
        if (!hasItems) {
            return res.status(400).json({ success: false, errors: "Cart is empty" });
        }

        const razorpayOrder = await razorpayInstance.orders.create({
            amount: Math.round(totalAmount * 100), // Razorpay expects the amount in paise
            currency: "INR",
            receipt: `ord_${req.user.id.slice(-8)}_${Date.now()}`,
        });

        res.json({ success: true, order: razorpayOrder, key_id: process.env.RAZORPAY_KEY_ID, amount: totalAmount });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: "Could not create Razorpay order. Double-check your RAZORPAY_KEY_ID/SECRET." });
    }
})

// Verify a completed Razorpay test payment, then save the order
router.post('/verifyrazorpaypayment', fetchUser, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, address } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, errors: "Missing payment details" });
        }

        // This is the critical security step - never trust a "payment succeeded" message
        // from the browser alone. Recompute the signature server-side and compare.
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, errors: "Payment verification failed - signature mismatch" });
        }

        const userData = await Users.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ success: false, errors: "User not found" });
        }

        const products = await Product.find({});
        const orderItems = [];
        let totalAmount = 0;
        for (const id in userData.cartData) {
            if (userData.cartData[id] > 0) {
                const product = products.find((p) => p.id === Number(id));
                if (product) {
                    orderItems.push({
                        id: product.id,
                        name: product.name,
                        image: product.image,
                        price: product.new_price,
                        quantity: userData.cartData[id],
                    });
                    totalAmount += product.new_price * userData.cartData[id];
                }
            }
        }
        if (orderItems.length === 0) {
            return res.status(400).json({ success: false, errors: "Cart is empty" });
        }

        const order = new Order({
            userId: req.user.id,
            items: orderItems,
            totalAmount: totalAmount,
            address: address || {},
            paymentMethod: "Razorpay (Test Mode)",
            cardLast4: razorpay_payment_id.slice(-4),
            status: "Paid",
        });
        await order.save();

        const clearedCart = getDefaultCartServer();
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: clearedCart });

        res.json({ success: true, orderId: order._id, totalAmount });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: "Payment verification failed" });
    }
})

// Order history endpoint
router.get('/myorders', fetchUser, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: "Could not fetch orders" });
    }
})

// Admin: view every order across all users
router.get('/allorders', fetchAdmin, async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ date: -1 });

        // Attach each order's customer email for display, without exposing password hashes etc.
        const userIds = [...new Set(orders.map((o) => o.userId))];
        const users = await Users.find({ _id: { $in: userIds } }, "name email");
        const userMap = {};
        users.forEach((u) => { userMap[u._id.toString()] = { name: u.name, email: u.email }; });

        const ordersWithCustomer = orders.map((o) => ({
            ...o.toObject(),
            customer: userMap[o.userId] || null,
        }));

        res.json({ success: true, orders: ordersWithCustomer });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: "Could not fetch orders" });
    }
})

// Admin: update an order's status (Paid -> Shipped -> Delivered, etc.)
router.post('/updateorderstatus', fetchAdmin, async (req, res) => {
    try {
        const { orderId, status } = req.body;
        if (!orderId || !status) {
            return res.status(400).json({ success: false, errors: "orderId and status are required" });
        }
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ success: false, errors: "Order not found" });
        }
        res.json({ success: true, order });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: "Could not update order status" });
    }
})

module.exports = router;
