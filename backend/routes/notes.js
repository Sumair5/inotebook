const express = require('express'); // Importing express library
const router = express.Router(); // Creating a new router instance
const fetchuser = require('../middleware/fetchuser'); // Middleware to verify JWT and authenticate the user
const Note = require('../models/Note'); // Importing the Note model for database interactions
const { body, validationResult } = require('express-validator'); // For input validation

// Route 1: Fetch all notes for the logged-in user
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id }); // Fetch notes where user matches the logged-in user
        res.json(notes); // Return the fetched notes as a JSON response
    } catch (error) {
        console.error(error.message); // Log the error for debugging
        res.status(500).send("Internal Server Error"); // Send an internal server error response
    }
});

// Route 2: Add a new note
router.post('/addnote', fetchuser, [
    body('title').isLength({ min: 3 }).withMessage('Enter a valid 3 plus ch title.'), // Validate title length
    body('description').isLength({ min: 10 }).withMessage('Enter at least 10 characters for description.') // Validate description length
], async (req, res) => {
    try {
        const { title, description, tag } = req.body; // Destructure the request body for title, description, and tag
        const errors = validationResult(req); // Check for validation errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // Return validation errors if any
        }
        const note = new Note({ title, description, tag, user: req.user.id }); // Create a new note with the user ID
        const saveNote = await note.save(); // Save the new note in the database
        res.json(saveNote); // Return the saved note as a response
    } catch (error) {
        console.error(error.message); // Log the error for debugging
        res.status(500).send("Internal Server Error"); // Send an internal server error response
    }
});

// Route 3: Update an existing note by ID
router.put('/updatenote/:id', fetchuser, [
    body('title').isString({ min: 3 }).withMessage('Enter a valid title.'), // Validate title length
    body('description').isLength({ min: 10 }).withMessage('Enter at least 10 characters for description.') // Validate description length
], async (req, res) => {
    try {
        const errors = validationResult(req); // Check for validation errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // Return validation errors if any
        }

        const { title, description, tag } = req.body; // Destructure the request body for title, description, and tag
        let note = await Note.findById(req.params.id); // Find the note by its ID
        if (!note) {
            return res.status(404).json({ msg: "Note not found" }); // Return a 404 if the note doesn't exist
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "Unauthorized" }); // Return 401 if the user doesn't own the note
        }

        // Update the note with the new values
        note = await Note.findByIdAndUpdate(req.params.id, { $set: { title, description, tag } }, { new: true });
        res.json(note); // Return the updated note as a response
    } catch (error) {
        console.error(error.message); // Log the error for debugging
        res.status(500).send("Internal Server Error"); // Send an internal server error response
    }
});

// Route 4: Delete an existing note by ID
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note by ID
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ msg: "Note not found" }); // If the note doesn't exist, return 404
        }

        // Check if the logged-in user owns the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "Unauthorized" }); // If the user is not the owner, return 401
        }

        // Delete the note
        await Note.findByIdAndDelete(req.params.id);
        res.json({ msg: "Note deleted successfully" }); // Send success message
    } catch (error) {
        console.error(error.message); // Log the error for debugging
        res.status(500).send("Internal Server Error"); // Return 500 if there was an internal error
    }
});




module.exports = router; // Export the router so it can be used in other parts of the application
