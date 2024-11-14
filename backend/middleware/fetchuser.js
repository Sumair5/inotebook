const jwt = require('jsonwebtoken'); // JWT for generating tokens
const JWT_SECRET = process.env.JWT_SECRET || 'Harryisagoodb$oy'; // Secret key for JWT signing (use environment variable in production)
const fetchuser = (req, res, next) => {
    const token = req.header('authtoken'); // Ensure the header name matches what you're sending from the client
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user; // Attach user information to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
}
module.exports = fetchuser;
