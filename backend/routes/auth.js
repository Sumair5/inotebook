const express = require('express'); // Express for handling routes
const { body, validationResult } = require('express-validator'); // Express validator for input validation
const bcrypt = require('bcryptjs'); // bcrypt for hashing passwords
const jwt = require('jsonwebtoken'); // JWT for generating tokens
const fetchuser = require('../middleware/fetchuser'); // Middleware for JWT verification
const User = require('../models/User'); // User model for database interactions
const router = express.Router(); // Create router instance for modular routes
const JWT_SECRET = process.env.JWT_SECRET || 'Harryisagoodb$oy'; // Use environment variable in production

// --------------------- CREATE USER ROUTE --------------------- //
// Route 1 |||| POST "/api/auth/createuser": Registers a new user, no authentication required
router.post('/createuser', [
    body('name').isLength({ min: 3 }).withMessage('Enter a valid name.'),
    body('email').isEmail().withMessage('Enter a valid email.'),
    body('password').isLength({ min: 5 }).withMessage('Enter a valid password.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists." });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = await User.create({ name: req.body.name, email: req.body.email, password: hashedPassword });
        const data = { user: { id: user.id } };
        const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
        res.status(201).json({ message: "User created successfully", user: { authToken, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// --------------------- LOGIN ROUTE --------------------- // 
//Route 2 |||| POST "/api/auth/login": Authenticates a user and returns a JWT token
router.post('/login', [
    body('email').isEmail().withMessage('Enter a valid email.'),
    body('password').exists().withMessage('Password is required.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const data = { user: { id: user.id } };
        const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
        res.json({ authToken });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// --------------------- GET USER DETAILS ROUTE --------------------- //
// Route 3 |||| POST "/api/auth/getuser": Gets user details, requires login (JWT token)
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
