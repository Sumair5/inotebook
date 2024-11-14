const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/";

// Function to connect to MongoDB
const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI); // Removed deprecated options
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

// Export the connection function
module.exports = connectToMongo;
