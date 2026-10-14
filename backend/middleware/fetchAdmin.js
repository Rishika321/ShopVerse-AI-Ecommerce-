const jwt = require("jsonwebtoken");

// Middleware to protect admin-only routes (add/edit/remove products, orders, bulk AI actions)
function fetchAdmin(req, res, next) {
    const token = req.header('admin-token');
    if (!token) {
        return res.status(401).json({ success: false, errors: "Admin authentication required" });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        if (!data.admin) {
            return res.status(403).json({ success: false, errors: "Not authorized as admin" });
        }
        next();
    } catch (error) {
        return res.status(401).json({ success: false, errors: "Admin session expired or invalid. Please log in again." });
    }
}

module.exports = fetchAdmin;
