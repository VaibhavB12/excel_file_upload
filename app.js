// app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const excelRoutes = require('./routes/excelRoutes');
const path =require("path");
const fs= require("fs");
dotenv.config(); // Load environment variables
const app = express();

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir); // Create the uploads directory if it doesn't exist
}

// Connect to MongoDB
const DB = process.env.DATABASE_URL.replace(
    '<USERNAME>',
    process.env.DATABASE_USERNAME 
  ).replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  );

mongoose.connect(DB)
    .then(() => console.log('DB connection successful!'))
    .catch(err => console.error('Connection error', err));

// Middleware
app.use(express.json());
app.use('/api/excel', excelRoutes); // Use the routes

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
