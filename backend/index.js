const connectToMongo = require('./db');
connectToMongo(); // Make sure to connect to MongoDB

const express = require('express');
const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Route handlers
app.use('/api/auth', require('./routes/auth'));  // Auth routes (make sure 'auth.js' exists)
app.use('/api/notes', require('./routes/notes'));  // Notes routes (make sure 'notes.js' exists)

app.listen(port, () => {
  console.log(`Inotebook backend listening at http://localhost:${port}`); // Fixed log message
});
