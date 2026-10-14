// One-time migration script: uploads every locally-stored product image to Cloudinary
// and updates the matching product record in MongoDB with the new Cloudinary URL.
//
// Run this ONCE, from inside the backend folder:
//   node migrateImagesToCloudinary.js
//
// Safe to run more than once - it automatically skips any product whose image
// already points to Cloudinary.

require("dotenv").config();
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const Product = require("./models/Product");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function migrate() {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.error("Missing Cloudinary credentials in backend/.env. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET, then run this again.");
        process.exit(1);
    }
    if (!process.env.MONGO_URI) {
        console.error("Missing MONGO_URI in backend/.env.");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const products = await Product.find({});
    console.log(`Found ${products.length} product(s) total.`);

    let migrated = 0;
    let skipped = 0;
    let failed = 0;

    for (const product of products) {
        if (!product.image || product.image.includes("res.cloudinary.com")) {
            skipped++;
            continue;
        }

        // Local URLs look like http://localhost:4000/images/product_12345.png
        const filename = product.image.split("/images/")[1];
        if (!filename) {
            console.log(`Skipping product ${product.id} (${product.name}) - couldn't parse local filename from "${product.image}"`);
            skipped++;
            continue;
        }

        const localPath = path.join(__dirname, "upload", "images", filename);
        if (!fs.existsSync(localPath)) {
            console.log(`Skipping product ${product.id} (${product.name}) - local file not found at ${localPath}`);
            failed++;
            continue;
        }

        try {
            const result = await cloudinary.uploader.upload(localPath, { folder: "shopverse_products" });
            product.image = result.secure_url;
            await product.save();
            console.log(`✓ Migrated product ${product.id} (${product.name}) -> ${result.secure_url}`);
            migrated++;
        } catch (err) {
            console.log(`✗ Failed to migrate product ${product.id} (${product.name}): ${err.message}`);
            failed++;
        }
    }

    console.log("\n--- Migration complete ---");
    console.log(`Migrated: ${migrated}`);
    console.log(`Skipped (already on Cloudinary or unparseable): ${skipped}`);
    console.log(`Failed: ${failed}`);

    await mongoose.disconnect();
    process.exit(0);
}

migrate().catch((err) => {
    console.error("Migration script crashed:", err);
    process.exit(1);
});
