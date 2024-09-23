// routes/excelRoutes.js
const express = require('express');
const multer = require('multer');
const excelController = require('../controllers/excelController');

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Create unique filename
  },
});

const upload = multer({ storage });

// Define route for uploading Excel file
router.post('/upload', upload.single('excelFile'), excelController.uploadExcel);

module.exports = router;
