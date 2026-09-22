import fs from 'fs';
import path from 'path';

// For GitHub Pages SPA routing, copy index.html to 404.html
const distPath = path.resolve('dist');
const indexPath = path.join(distPath, 'index.html');
const notFoundPath = path.join(distPath, '404.html');

try {
  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, notFoundPath);
    console.log('Successfully copied index.html to 404.html for SPA routing');
  } else {
    console.error('Error: index.html not found in dist directory');
  }
} catch (err) {
  console.error('Error during postbuild step:', err);
}
