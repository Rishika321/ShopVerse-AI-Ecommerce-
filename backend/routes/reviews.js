const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Users = require("../models/Users");
const fetchUser = require("../middleware/fetchUser");

// Get all reviews for a product, plus the average rating
router.get('/reviews/:productId', async (req, res) => {
    try {
        const productId = Number(req.params.productId);
        const reviews = await Review.find({ productId }).sort({ date: -1 });
        const count = reviews.length;
        const average = count > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / count) : 0;
        res.json({ success: true, reviews, average, count });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: "Could not fetch reviews" });
    }
})

// Add a review (one per user per product - editing resubmits/updates it)
router.post('/addreview', fetchUser, async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        if (!productId || !rating) {
            return res.status(400).json({ success: false, errors: "Product and rating are required" });
        }
        const userData = await Users.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ success: false, errors: "User not found" });
        }

        const existing = await Review.findOne({ productId: Number(productId), userId: req.user.id });
        if (existing) {
            existing.rating = rating;
            existing.comment = comment || "";
            existing.date = Date.now();
            await existing.save();
        } else {
            const review = new Review({
                productId: Number(productId),
                userId: req.user.id,
                userName: userData.name,
                rating,
                comment: comment || "",
            });
            await review.save();
        }
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: "Could not submit review" });
    }
})

module.exports = router;
