#!/usr/bin/env node

/**
 * DawnoTemu Local Testing Server
 * Serves the website locally with proper CORS headers and debugging capabilities
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;
const ROOT_DIR = __dirname;

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;
  
  // Default to index.html
  if (pathname === '/') {
    pathname = '/index.html';
  }
  
  const filePath = path.join(ROOT_DIR, pathname);
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'text/plain';
  
  // Log request for debugging
  console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Log UTM parameters if present
  if (Object.keys(parsedUrl.query).length > 0) {
    const utmParams = {};
    Object.keys(parsedUrl.query).forEach(key => {
      if (key.startsWith('utm_') || ['fbclid', 'gclid'].includes(key)) {
        utmParams[key] = parsedUrl.query[key];
      }
    });
    
    if (Object.keys(utmParams).length > 0) {
      console.log('🎯 UTM Parameters detected:', utmParams);
    }
  }
  
  // Check if file exists
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      res.end('<h1>404 Not Found</h1>');
      console.log(`❌ File not found: ${filePath}`);
      return;
    }
    
    // Set headers for proper testing
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    
    res.end(data);
    console.log(`✅ Served: ${pathname} (${contentType})`);
  });
});

server.listen(PORT, 'localhost', () => {
  console.log('🚀 DawnoTemu Local Testing Server');
  console.log('=====================================');
  console.log(`📍 Server running at: http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${ROOT_DIR}`);
  console.log('');
  console.log('🧪 Test URLs:');
  console.log(`   Home: http://localhost:${PORT}`);
  console.log(`   With UTMs: http://localhost:${PORT}?utm_source=facebook&utm_medium=cpc&utm_campaign=test&fbclid=test123`);
  console.log(`   Debug Mode: http://localhost:${PORT}?debug_mode=true`);
  console.log('');
  console.log('📊 GA4 Testing:');
  console.log('   1. Open browser console to see debug logs');
  console.log('   2. Test consent flow and UTM detection');
  console.log('   3. Verify GTM dataLayer events');
  console.log('');
  console.log('Press Ctrl+C to stop');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\\n🛑 Server shutting down...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});