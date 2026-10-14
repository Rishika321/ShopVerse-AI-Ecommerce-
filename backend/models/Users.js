const mongoose = require("mongoose");

const Users = mongoose.model('Users', {
    name: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    wishlistData: {
        type: Object,
        default: {},
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = Users;
