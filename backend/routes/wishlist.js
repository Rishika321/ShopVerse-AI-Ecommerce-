const express = require("express");
const router = express.Router();
const Users = require("../models/Users");
const fetchUser = require("../middleware/fetchUser");

router.post('/addtowishlist', fetchUser, async (req, res) => {
    try {
        const userData = await Users.findOne({ _id: req.user.id });
        const wishlist = userData.wishlistData || {};
        wishlist[req.body.itemId] = true;
        await Users.findOneAndUpdate({ _id: req.user.id }, { wishlistData: wishlist });
        res.json({ success: true, wishlist });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: "Could not update wishlist" });
    }
})

router.post('/removefromwishlist', fetchUser, async (req, res) => {
    try {
        const userData = await Users.findOne({ _id: req.user.id });
        const wishlist = userData.wishlistData || {};
        delete wishlist[req.body.itemId];
        await Users.findOneAndUpdate({ _id: req.user.id }, { wishlistData: wishlist });
        res.json({ success: true, wishlist });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: "Could not update wishlist" });
    }
})

router.post('/getwishlist', fetchUser, async (req, res) => {
    try {
        const userData = await Users.findOne({ _id: req.user.id });
        res.json({ success: true, wishlist: userData.wishlistData || {} });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: "Could not fetch wishlist" });
    }
})

module.exports = router;
