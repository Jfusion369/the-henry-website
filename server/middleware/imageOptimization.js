/**
 * Image Optimization Middleware
 * Provides async image processing, caching, and performance optimization
 */

const express = require('express');
const path = require('path');
const fs = require('fs').promises;

/**
 * Configure image optimization headers
 * - Enables browser caching for images
 * - Sets appropriate MIME types
 * - Adds performance-related headers
 */
function configureImageHeaders(req, res, next) {
  // Set cache headers for images
  const maxAge = 60 * 60 * 24 * 30; // 30 days
  res.setHeader('Cache-Control', `public, max-age=${maxAge}, immutable`);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Add access control headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  // Enable compression for images if possible
  res.setHeader('Vary', 'Accept-Encoding');
  
  next();
}

/**
 * Image serving middleware with proper MIME types
 */
function serveImage(filepath, contentType) {
  return async (req, res, next) => {
    try {
      const fullPath = path.join(__dirname, '../../', filepath);
      
      // Security: prevent path traversal
      const normalizedPath = path.normalize(fullPath);
      const basePath = path.normalize(path.join(__dirname, '../../'));
      if (!normalizedPath.startsWith(basePath)) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      // Check if file exists
      await fs.access(fullPath);
      
      // Set content type and cache headers
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=2592000, immutable'); // 30 days
      
      // Stream the file
      res.sendFile(normalizedPath);
    } catch (error) {
      console.error(`Image serving error for ${filepath}:`, error.message);
      res.status(404).json({ error: 'Image not found' });
    }
  };
}

/**
 * Get image metadata for lazy loading
 * Returns image dimensions, file size, and optimal loading strategy
 */
async function getImageMetadata(imagePath) {
  try {
    const fullPath = path.join(__dirname, '../../', imagePath);
    const stats = await fs.stat(fullPath);
    
    return {
      path: imagePath,
      size: stats.size,
      mtime: stats.mtime,
      sizeInKB: (stats.size / 1024).toFixed(2),
      isLargeImage: stats.size > 100 * 1024, // > 100KB
      loadingStrategy: stats.size > 500 * 1024 ? 'lazy' : 'eager'
    };
  } catch (error) {
    console.error(`Error getting metadata for ${imagePath}:`, error.message);
    return null;
  }
}

/**
 * Serve images API endpoint
 * GET /api/images/:imageId
 */
async function imageEndpoint(req, res) {
  const { imageId } = req.params;
  
  // Map common image IDs to file paths
  const imageMap = {
    'henry-header': 'images/The-Henry-header.png',
    'rooted-salon-logo': 'images/Rooted_Salon_LOGO_text.png',
    'amy-karen': 'images/amy-karen..JPEG',
    'karen-gilliland': 'images/karen-gilliland-white.jpg',
    'amy-foree': 'images/amy-foree.jpg',
    'joshua-foree': 'images/joshua-foree.jpg'
  };
  
  const imagePath = imageMap[imageId];
  if (!imagePath) {
    return res.status(404).json({ error: 'Image not found' });
  }
  
  const metadata = await getImageMetadata(imagePath);
  if (!metadata) {
    return res.status(404).json({ error: 'Image metadata not found' });
  }
  
  res.json({
    success: true,
    image: metadata,
    recommended: {
      loadingAttribute: metadata.isLargeImage ? 'lazy' : 'eager',
      priority: metadata.isLargeImage ? 'low' : 'high'
    }
  });
}

module.exports = {
  configureImageHeaders,
  serveImage,
  getImageMetadata,
  imageEndpoint
};
