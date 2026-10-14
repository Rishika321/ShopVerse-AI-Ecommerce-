// Shared helper: generate a product description via Gemini's free tier
async function generateProductDescription(name, category, price) {
    const prompt = `Write a compelling, unique product description for an e-commerce store listing. Keep it to 2 short paragraphs (about 60-90 words total), no markdown, no headings, plain text only.

Product name: ${name}
Category: ${category}
Price: $${price || "N/A"}`;

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
        throw new Error(geminiData.error.message || "Gemini API error");
    }

    const description = (geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();
    return description;
}

module.exports = { generateProductDescription };
