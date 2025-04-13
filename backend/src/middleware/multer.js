// ======= Module imports ======= //

const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import the file system module

///////////////////////////////////////////////////////////////////////
// ======================= MULTER CONFIGURATION ==================== //
///////////////////////////////////////////////////////////////////////

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.resolve(__dirname, '../uploads/avatars'); // Define the upload directory

    try {
      
      // Check if the directory exists, and create it if it doesn't
      fs.mkdirSync(uploadDir, { recursive: true }); // Create dir if doesn't exist
      cb(null, uploadDir); // All uploads will be stored to this folder

    } catch (err) {
      console.error('Error creating upload directory:', err);
      cb(err, null); // Pass the error to the callback
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate a unique suffix
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Use the original file extension
  },
});

const upload = multer({ storage: storage });

module.exports = upload