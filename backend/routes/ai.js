const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const fetchAdmin = require("../middleware/fetchAdmin");
const { generateProductDescription } = require("../utils/gemini");

// AI-powered natural language product search (uses Google Gemini's free tier)
router.post('/aisearch', async (req, res) => {
    try {
        const query = req.body.query;
        if (!query || !query.trim()) {
            return res.status(400).json({ success: false, errors: "Please enter a search query" });
        }
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ success: false, errors: "AI search is not configured. Add GEMINI_API_KEY to backend/.env" });
        }

        const products = await Product.find({});
        // Send a lightweight version of the catalog to keep the prompt small
        const catalog = products.map((p) => ({ id: p.id, name: p.name, category: p.category, price: p.new_price }));

        const prompt = `You are a product search assistant for an e-commerce store. Given the user's search query and the product catalog below, return ONLY a JSON array of the matching product ids, ordered from most to least relevant. Return at most 12 ids. Return ONLY valid JSON, no other text, no markdown fences.

User query: "${query}"

Catalog: ${JSON.stringify(catalog)}`;

        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );
        const geminiData = await geminiResponse.json();

        if (geminiData.error) {
            console.log(geminiData.error);
            return res.status(500).json({ success: false, errors: geminiData.error.message || "AI search failed" });
        }

        const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const cleaned = rawText.replace(/```json|```/g, "").trim();

        let matchedIds = [];
        try {
            matchedIds = JSON.parse(cleaned);
        } catch (parseErr) {
            console.log("AI search JSON parse failed:", rawText);
            return res.status(500).json({ success: false, errors: "AI search failed to parse a response. Try again." });
        }

        const orderedResults = matchedIds
            .map((id) => products.find((p) => p.id === id))
            .filter(Boolean);

        res.json({ success: true, results: orderedResults });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: "AI search failed. Please try again." });
    }
})

// AI-generated product descriptions (uses Google Gemini's free tier)
router.post('/generatedescription', fetchAdmin, async (req, res) => {
    try {
        const { name, category, new_price, old_price } = req.body;
        if (!name || !category) {
            return res.status(400).json({ success: false, errors: "Product name and category are required" });
        }
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ success: false, errors: "AI description generation is not configured. Add GEMINI_API_KEY to backend/.env" });
        }

        const description = await generateProductDescription(name, category, new_price || old_price);
        if (!description) {
            return res.status(500).json({ success: false, errors: "AI returned an empty description. Try again." });
        }

        res.json({ success: true, description });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: error.message || "AI description generation failed. Please try again." });
    }
})

// Bulk-generate descriptions for every existing product that doesn't have one yet
router.post('/bulkgeneratedescriptions', fetchAdmin, async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ success: false, errors: "AI description generation is not configured. Add GEMINI_API_KEY to backend/.env" });
        }

        const products = await Product.find({
            $or: [{ description: { $exists: false } }, { description: "" }]
        });

        let updated = 0;
        let failed = 0;

        for (const product of products) {
            try {
                const description = await generateProductDescription(product.name, product.category, product.new_price);
                if (description) {
                    product.description = description;
                    await product.save();
                    updated++;
                } else {
                    failed++;
                }
            } catch (err) {
                console.log(`Failed to generate description for product ${product.id}:`, err.message);
                failed++;
            }
            // Small delay between calls to stay comfortably under the free-tier rate limit
            await new Promise((resolve) => setTimeout(resolve, 1500));
        }

        res.json({ success: true, total: products.length, updated, failed });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: "Bulk description generation failed" });
    }
})

module.exports = router;
