import { serve } from "bun";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const PORT = 3000;
const DIST_DIR = "./dist";

// Simple MIME type mapping
const mimeTypes: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function getMimeType(filename: string): string {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return mimeTypes[ext] || 'application/octet-stream';
}

const server = serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    let pathname = url.pathname;
    
    // Default to index.html for root
    if (pathname === '/') {
      pathname = '/index.html';
    }
    
    const filePath = join(DIST_DIR, pathname);
    
    // Check if file exists
    if (existsSync(filePath)) {
      try {
        const content = readFileSync(filePath);
        const mimeType = getMimeType(pathname);
        
        return new Response(content, {
          headers: {
            'Content-Type': mimeType,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      } catch (error) {
        console.error('Error reading file:', error);
        return new Response('Internal Server Error', { status: 500 });
      }
    } else {
      // For SPA routing, serve index.html for non-existent routes
      try {
        const content = readFileSync(join(DIST_DIR, 'index.html'));
        return new Response(content, {
          headers: {
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        return new Response('Not Found', { status: 404 });
      }
    }
  },
});

console.log(`🚀 Development server running at http://localhost:${PORT}`);
console.log(`📁 Serving files from: ${DIST_DIR}`);
console.log(`🔧 This server allows HTTP backend connections for development`);
