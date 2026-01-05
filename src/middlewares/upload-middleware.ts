import multer from 'multer';
import path from 'path';
import fs from 'fs';
<<<<<<< HEAD
import crypto from 'crypto';

const limitSize = 5 * 1024 * 1024; // 5MB

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
     const ext = path.extname(file.originalname).toLowerCase();
     const validExts = ['.png', '.jpg', '.jpeg', '.pdf' ].includes(ext) ? ext : '';
     cb(null, crypto.randomUUID() + validExts);
    },
});

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
const validTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'].includes(file.mimetype);
    if (validTypes) {
        cb(null, true);
    }else {
        cb(new Error('잘못된 요청입니다.'));
  }
}

export const upload = multer({
    storage,
    limits: { fileSize: limitSize },
    fileFilter, 
})

    
=======

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
>>>>>>> 54f7c95
