import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure the upload directory exists
const uploadDir = 'public/uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Create the multer instance
export const upload = multer({ storage });
