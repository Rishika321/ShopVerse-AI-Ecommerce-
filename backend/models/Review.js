const mongoose = require("mongoose");

const Review = mongoose.model("Review", {
    productId: {
        type: Number,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        default: "",
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = Review;
