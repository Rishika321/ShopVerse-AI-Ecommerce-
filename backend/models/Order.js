const mongoose = require("mongoose");

const Order = mongoose.model("Order", {
    userId: {
        type: String,
        required: true,
    },
    items: {
        type: Array,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    address: {
        type: Object,
    },
    paymentMethod: {
        type: String,
        default: "Card (Demo)",
    },
    cardLast4: {
        type: String,
    },
    status: {
        type: String,
        default: "Paid",
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = Order;
