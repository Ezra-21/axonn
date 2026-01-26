/**
 * Upload Service
 * Business logic for file uploads
 */

import { cloudinary, deleteImage, deleteMultipleImages } from '../config/cloudinary.js';
import ApiError from '../utils/apiError.js';

/**
 * Upload single image to Cloudinary
 * @param {Object} file - Multer file object
 * @param {string} folder - Cloudinary folder
 * @param {Object} options - Upload options
 * @returns {Object} Upload result
 */
const uploadSingleImage = async (file, folder = 'axon', options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: 'image',
      ...options,
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw ApiError.internal('Image upload failed');
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param {Array} files - Array of Multer file objects
 * @param {string} folder - Cloudinary folder
 * @param {Object} options - Upload options
 * @returns {Array} Upload results
 */
const uploadMultipleImages = async (files, folder = 'axon', options = {}) => {
  try {
    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder,
        resource_type: 'image',
        ...options,
      })
    );

    const results = await Promise.all(uploadPromises);

    return results.map((result) => ({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    }));
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw ApiError.internal('Image upload failed');
  }
};

/**
 * Upload image from buffer (for processed images)
 * @param {Buffer} buffer - Image buffer
 * @param {string} folder - Cloudinary folder
 * @param {Object} options - Upload options
 * @returns {Object} Upload result
 */
const uploadFromBuffer = async (buffer, folder = 'axon', options = {}) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'image',
          ...options,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(ApiError.internal('Image upload failed'));
          } else {
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format,
            });
          }
        }
      )
      .end(buffer);
  });
};

/**
 * Delete single image from Cloudinary
 * @param {string} public_id - Cloudinary public ID
 * @returns {Object} Deletion result
 */
const deleteSingleImage = async (public_id) => {
  try {
    const result = await deleteImage(public_id);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw ApiError.internal('Image deletion failed');
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param {Array} public_ids - Array of Cloudinary public IDs
 * @returns {Object} Deletion result
 */
const deleteImages = async (public_ids) => {
  try {
    const result = await deleteMultipleImages(public_ids);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw ApiError.internal('Images deletion failed');
  }
};

/**
 * Get image URL with transformations
 * @param {string} public_id - Cloudinary public ID
 * @param {Object} options - Transformation options
 * @returns {string} Transformed image URL
 */
const getTransformedUrl = (public_id, options = {}) => {
  const defaultOptions = {
    quality: 'auto',
    fetch_format: 'auto',
  };

  return cloudinary.url(public_id, { ...defaultOptions, ...options });
};

/**
 * Get thumbnail URL
 * @param {string} public_id - Cloudinary public ID
 * @param {number} width - Thumbnail width
 * @param {number} height - Thumbnail height
 * @returns {string} Thumbnail URL
 */
const getThumbnailUrl = (public_id, width = 200, height = 200) => {
  return getTransformedUrl(public_id, {
    width,
    height,
    crop: 'fill',
    gravity: 'auto',
  });
};

export {
  uploadSingleImage,
  uploadMultipleImages,
  uploadFromBuffer,
  deleteSingleImage,
  deleteImages,
  getTransformedUrl,
  getThumbnailUrl,
};
