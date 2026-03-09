const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function isLoggedIn(req, res, next) {
    const { token } = req.cookies;
    if (!token) {
        return res.redirect("/login?error=You must be logged in to do that.");
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.redirect("/login?error=Session expired. Please log in again.");
    }
}

module.exports = { isLoggedIn };
