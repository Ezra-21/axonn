/**
 * File Upload Middleware
 * Handles file uploads with validation
 */

import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import ApiError from '../utils/apiError.js';
import { FILE_UPLOAD } from '../utils/constants.js';
import env from '../config/env.js';

// Local storage configuration (fallback when Cloudinary is not available)
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';

    if (file.fieldname === 'avatar') {
      uploadPath = 'uploads/users/';
    } else if (file.fieldname === 'images' || file.fieldname === 'image') {
      uploadPath = 'uploads/products/';
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Memory storage (for processing before upload to cloud)
const memoryStorage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Check file type
  if (!FILE_UPLOAD.ALLOWED_TYPES.includes(file.mimetype)) {
    return cb(
      ApiError.badRequest(
        `Invalid file type. Allowed types: ${FILE_UPLOAD.ALLOWED_EXTENSIONS.join(', ')}`,
      ),
      false,
    );
  }

  // Check file extension
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  if (!FILE_UPLOAD.ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(
      ApiError.badRequest(
        `Invalid file extension. Allowed: ${FILE_UPLOAD.ALLOWED_EXTENSIONS.join(', ')}`,
      ),
      false,
    );
  }

  cb(null, true);
};

// Local upload configuration
const uploadLocal = multer({
  storage: localStorage,
  limits: {
    fileSize: FILE_UPLOAD.MAX_SIZE,
    files: FILE_UPLOAD.MAX_FILES,
  },
  fileFilter,
});

// Memory upload configuration (for cloud uploads)
const uploadMemory = multer({
  storage: memoryStorage,
  limits: {
    fileSize: FILE_UPLOAD.MAX_SIZE,
    files: FILE_UPLOAD.MAX_FILES,
  },
  fileFilter,
});

/**
 * Upload single product image
 */
const uploadSingleImage = uploadLocal.single('image');

/**
 * Upload multiple product images
 */
const uploadMultipleImages = uploadLocal.array('images', FILE_UPLOAD.MAX_FILES);

/**
 * Upload user avatar
 */
const uploadUserAvatar = uploadLocal.single('avatar');

/**
 * Handle multer errors
 */
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return next(
          ApiError.badRequest(
            `File too large. Maximum size is ${FILE_UPLOAD.MAX_SIZE / (1024 * 1024)}MB`,
          ),
        );
      case 'LIMIT_FILE_COUNT':
        return next(
          ApiError.badRequest(`Too many files. Maximum is ${FILE_UPLOAD.MAX_FILES}`),
        );
      case 'LIMIT_UNEXPECTED_FILE':
        return next(ApiError.badRequest('Unexpected file field'));
      default:
        return next(ApiError.badRequest('File upload error'));
    }
  }
  next(err);
};

export {
  uploadLocal,
  uploadMemory,
  uploadSingleImage,
  uploadMultipleImages,
  uploadUserAvatar,
  handleUploadError,
};

// max file size: 5 MB, accepted: jpg, png, webp

// images stored in Cloudinary folder: axon/{category}