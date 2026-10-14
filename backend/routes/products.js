const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Product = require("../models/Product");
const fetchAdmin = require("../middleware/fetchAdmin");

// Image Storage - files are held in memory just long enough to stream to Cloudinary,
// never written to local disk (so nothing is lost on redeploy/restart)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Creating Upload Endpoint for images - uploads to Cloudinary
router.post("/upload", fetchAdmin, upload.single('product'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: 0, message: "No file uploaded" });
    }
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return res.status(500).json({ success: 0, message: "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to backend/.env" });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "shopverse_products" },
        (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ success: 0, message: "Cloudinary upload failed" });
            }
            res.json({
                success: 1,
                image_url: result.secure_url
            });
        }
    );
    uploadStream.end(req.file.buffer);
})

router.post('/addproduct', fetchAdmin, async (req, res) => {
    try {
        let products = await Product.find({});
        let id;
        if (products.length > 0) {
            id = Math.max(...products.map((p) => p.id)) + 1;
        } else {
            id = 1;
        }
        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            description: req.body.description || "",
            new_price: req.body.new_price,
            old_price: req.body.old_price
        });
        console.log(product);
        await product.save();
        console.log("Saved");
        res.json({
            success: true,
            name: req.body.name,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: error.message || "Could not add product" });
    }
})

// Creating API for deleting Products
router.post('/removeproduct', fetchAdmin, async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.body.id });
        console.log("Removed");
        res.json({
            success: true,
            name: req.body.name
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: "Could not remove product" });
    }
})

// Get a single product by its id (used to pre-fill the Edit Product form)
router.get('/product/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ id: Number(req.params.id) });
        if (!product) {
            return res.status(404).json({ success: false, errors: "Product not found" });
        }
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: "Could not fetch product" });
    }
})

// Update an existing product's details
router.post('/updateproduct', fetchAdmin, async (req, res) => {
    try {
        const { id, name, image, category, description, new_price, old_price } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, errors: "Product id is required" });
        }
        const product = await Product.findOne({ id: Number(id) });
        if (!product) {
            return res.status(404).json({ success: false, errors: "Product not found" });
        }
        if (name !== undefined) product.name = name;
        if (image !== undefined) product.image = image;
        if (category !== undefined) product.category = category;
        if (description !== undefined) product.description = description;
        if (new_price !== undefined) product.new_price = new_price;
        if (old_price !== undefined) product.old_price = old_price;
        await product.save();
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: "Could not update product" });
    }
})

// Creating API for getting all products
router.get('/allproducts', async (req, res) => {
    try {
        let products = await Product.find({});
        console.log("All Products Fetched");
        res.send(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: "Could not fetch products" });
    }
})

// Creating endpoint for newcollection data
router.get('/newcollections', async (req, res) => {
    try {
        let products = await Product.find({});
        let newcollection = products.slice(1).slice(-8);
        console.log("NewCollection Fetched");
        res.send(newcollection);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: "Could not fetch new collections" });
    }
})

// Creating endpoint for popular in women section
router.get('/popularinwomen', async (req, res) => {
    try {
        let products = await Product.find({ category: "women" });
        let popular_in_women = products.slice(0, 4);
        console.log("Popular in women fetched");
        res.send(popular_in_women);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: "Could not fetch popular products" });
    }
})

module.exports = router;
