# Excel Upload and Processing API

This project provides an API for uploading Excel files, processing their contents, and inserting valid records into a MongoDB database. It also logs duplicate records & missing fields to a text file.Streams are used for uploading data in more controlled and memory-efficient manner.

## Table of Contents

- [Excel Upload and Processing API](#excel-upload-and-processing-api)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Setup Instructions](#setup-instructions)

## Features

- Upload Excel files.
- Validate records from the uploaded Excel file.
- Insert valid records into MongoDB.
- Log any missing fields to a text file.
- Process records in batches with a delay between batches.

## Technologies Used

- **Node.js**: JavaScript runtime for building the API.
- **Express**: Web framework for Node.js.
- **Mongoose**: ODM for MongoDB.
- **ExcelJS**: Library for reading and writing Excel files.
- **Multer**: Middleware for handling file uploads.

## Setup Instructions

1. **Clone the repository**:
   ```javascript
   git clone https://github.com/VaibhavB12/excel_file_upload.git
   cd excel_file_upload
   ```
2. Install dependencies:
    ```javascript
    npm install 
    ```
3. Create a .env file in the root directory with the following content:
    DATABASE_USERNAME=<Your_MongoDB_Atlas_Username>
    DATABASE_PASSWORD=<Your_MongoDB_Atlas_Password>
    DATABASE_URL=<Your_MongoDB_Atlas_Database_URL>
    PORT=3000
4. Start the server:
    ```javascript
    node app.js
    ```
5. Testing the API
   
   1. Install Postman or use another API testing tool.
   2. Make a POST request to the following URL
   ```javascript
   http://localhost:3000/api/excel/upload 
   ```
   3. In Postman, under the "Body" tab, select form-data.
      Set the key as "excelFile" and choose the Excel file you want to upload as the value.
   4. Send the request and review the response for processing results.
6. ## Checking the Database
   1. **Connect to MongoDB**:
   - If using **MongoDB Atlas**, use the connection string from your `.env` file to connect. 
   - You can use **MongoDB Compass** (a GUI for MongoDB) or the **MongoDB shell** to access the database.

   2. **Verify Uploaded Records**:
   - In your MongoDB collection, query the relevant collection to see if the records from the uploaded Excel file have been inserted successfully.
   - Use a query like the following in MongoDB shell or Compass:
     ```bash
     db.<collection_name>.find()
     ```
   - Ensure that the valid records from the Excel file are present in the database.
  3. **Duplicate & Missing Records**:
   - Check the missingFiles folder for duplicate records & records that are failed to upload to the database.
