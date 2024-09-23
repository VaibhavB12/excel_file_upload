const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const DataModel = require('../models/dataModel');

// Helper function to introduce delay (in ms)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

exports.uploadExcel = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(500).json('File not found');
    }

    const workbook = new ExcelJS.Workbook();
    
    // Create a read stream for the uploaded Excel file
    const stream = fs.createReadStream(req.file.path);
    
    // Read the workbook from the stream
    await workbook.xlsx.read(stream);

    const worksheet = workbook.getWorksheet(1); // Access the first worksheet
    const records = [];
    const missingFields = [];
    const batchSize = 50; // Process 50 records per batch
    const delayTime = 5 * 1000; // Delay time in milliseconds (5 seconds)

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        return; // Skip header row
      }

      const record = {
        id: row.getCell(1).value,
        name: row.getCell(2).value,
        age: row.getCell(3).value,
        email: row.getCell(4).value,
        zip: row.getCell(5).value,
      };

      // Check for missing fields
      const missing = [];
      if (!record.id) missing.push('id');
      if (!record.name) missing.push('name');
      if (!record.age) missing.push('age');
      if (!record.email) missing.push('email');
      if (!record.zip) missing.push('zip');
      if (record.zip && record.zip.toString().length !== 6) {
        missing.push('zip (invalid length)');
      }

      if (missing.length > 0) {
        missingFields.push(`(ID: ${record.id}): Missing fields - ${missing.join(', ')}`);
      } else {
        records.push(record); // Add valid record to the records array
      }
    });

    let totalInserted = 0; // Counter for inserted records

    // Create missingFiles directory in the current project folder if it doesn't exist
    const missingFilesDir = path.join(process.cwd(), 'missingFiles');
    if (!fs.existsSync(missingFilesDir)) {
      fs.mkdirSync(missingFilesDir);
      console.log('Missing files directory created:', missingFilesDir);
    }

    // Process records in batches of 50 records per minute
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize); // Get the batch of 50 records

      const validRecords = []; // Array to hold records that can be inserted
      const duplicateRecords = []; // Array to hold duplicate records

      for (const record of batch) {
        try {
          await DataModel.create(record); // Attempt to insert each record individually
          validRecords.push(record); // If successful, add to validRecords
          totalInserted++;
        } catch (error) {
          if (error.code === 11000) {
            console.error('Duplicate key error for ID:', record.id);
            duplicateRecords.push(record); // Log the duplicate record
          } else {
            throw error; // Re-throw if it's not a duplicate key error
          }
        }
      }

      // Log duplicate records to a file
      if (duplicateRecords.length > 0) {
        const logFilePath = path.join(missingFilesDir, 'duplicateRecordsLog.txt');
        fs.appendFileSync(logFilePath, duplicateRecords.map(r => JSON.stringify(r)).join('\n') + '\n', { encoding: 'utf8' });
      }

      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(records.length / batchSize)}.`);
      
      // Wait for 5 seconds before processing the next batch, except for the last batch
      if (i + batchSize < records.length) {
        console.log(`Waiting for 5 seconds before processing the next batch...`);
        await delay(delayTime); // Wait for 5 seconds (5,000 ms)
      }
    }

    // Log missing fields to a text file
    if (missingFields.length > 0) {
      const logFilePath = path.join(missingFilesDir, 'missingFieldsLog.txt');
      fs.appendFileSync(logFilePath, missingFields.join('\n') + '\n', { encoding: 'utf8' });
    }

    res.status(200).json({ message: `Upload complete. ${totalInserted} records inserted into the database.` });

    // Log total records uploaded before exiting
    console.log(`Total records uploaded: ${totalInserted}`);

    // Exit the process after completing all operations
    process.exit(0); // Exit the application gracefully
  } catch (error) {
    console.error('Error uploading Excel file:', error);
    res.status(500).json({ message: 'Error uploading Excel file' });

    // Exit the process with a failure code
    process.exit(1);
  }
};



