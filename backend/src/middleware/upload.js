import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    let ext = path.extname(file.originalname).toLowerCase();
    if (!ext || ext === '.') {
      if (file.mimetype && file.mimetype.includes('png')) ext = '.png';
      else if (file.mimetype && file.mimetype.includes('webp')) ext = '.webp';
      else ext = '.jpg';
    }
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Always accept avatar uploads
  if (file.fieldname === 'avatar') {
    return cb(null, true);
  }

  const allowedExtensions = /jpeg|jpg|png|webp|pdf|doc|docx/;
  let ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  if (!ext && file.mimetype && file.mimetype.startsWith('image/')) {
    ext = 'jpg';
  }

  const mimeTypeAllowed =
    file.mimetype.startsWith('image/') ||
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/octet-stream' ||
    file.mimetype.includes('wordprocessingml') ||
    file.mimetype.includes('msword') ||
    !file.mimetype;

  if (allowedExtensions.test(ext) || mimeTypeAllowed) {
    return cb(null, true);
  }
  cb(new Error('Invalid file format. Only JPEG, PNG, WEBP, PDF, DOC, and DOCX are allowed.'));
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
});
