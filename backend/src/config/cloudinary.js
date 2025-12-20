/**
 * Cloudinary Configuration
 * Image upload and management
 */

import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import env from './env.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage for product images
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'axon/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1000, height: 1000, crop: 'limit', quality: 'auto' },
    ],
  },
});

// Cloudinary storage for user avatars
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'axon/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 300, height: 300, crop: 'fill', gravity: 'face', quality: 'auto' },
    ],
  },
});

// Cloudinary storage for category images
const categoryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'axon/categories',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 600, crop: 'fill', quality: 'auto' },
    ],
  },
});

// Multer upload configurations
const uploadProductImages = multer({
  storage: productStorage,
  limits: {
    fileSize: env.MAX_FILE_SIZE,
    files: env.MAX_FILES,
  },
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: {
    fileSize: env.MAX_FILE_SIZE,
    files: 1,
  },
});

const uploadCategoryImage = multer({
  storage: categoryStorage,
  limits: {
    fileSize: env.MAX_FILE_SIZE,
    files: 1,
  },
});

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} Deletion result
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param {string[]} publicIds - Array of Cloudinary public IDs
 * @returns {Promise<Object>} Deletion result
 */
const deleteMultipleImages = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.error('Error deleting images from Cloudinary:', error);
    throw error;
  }
};

export {
  cloudinary,
  uploadProductImages,
  uploadAvatar,
  uploadCategoryImage,
  deleteImage,
  deleteMultipleImages,
};

// transforms applied: auto quality + auto format

// eager transform: w_800,h_600,c_fill,f_auto,q_auto

// fix: delete old image from Cloudinary on product update

// signed uploads required – unsigned uploads disabled in Cloudinary