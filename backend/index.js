require("dotenv").config();
const port = 4000;
const express = require("express");
const app = express();
const cors = require("cors");

const connectDB = require("./config/db");

app.use(express.json());

// Only allow requests from your own frontend and admin panel - not from any
// arbitrary website on the internet. In development these default to the
// standard CRA/Vite ports; when deployed, set FRONTEND_URL and ADMIN_URL in
// backend/.env to your real deployed URLs.
const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:3000",
    process.env.ADMIN_URL || "http://localhost:5173",
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g. curl, Postman, server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        console.log(`Blocked CORS request from unauthorized origin: ${origin}`);
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));

// Database connection with MongoDB
connectDB();

// API Creation
app.get("/", (req, res) => {
    res.send("Express App is Running")
})

// Route modules - each file owns one area of the API
app.use(require("./routes/products"));
app.use(require("./routes/users"));
app.use(require("./routes/cart"));
app.use(require("./routes/orders"));
app.use(require("./routes/wishlist"));
app.use(require("./routes/reviews"));
app.use(require("./routes/ai"));

// Safety net: catches any error that slips past individual route handlers
// and makes sure the response is always JSON, never an HTML crash page.
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ success: false, errors: "Something went wrong on the server. Check the backend terminal for details." });
});

app.listen(port, (error) => {
    if (!error) {
        console.log("Server running on Port " + port)
    }
    else {
        console.log("Error: " + error)
    }
})
