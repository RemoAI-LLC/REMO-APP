import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '..', 'desktop');
const destDir = path.join(__dirname, '..', 'dist', 'desktop');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy certificates
const certFiles = ['localhost.pem', 'localhost-key.pem'];
certFiles.forEach(file => {
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(destDir, file);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file} to ${destPath}`);
  } else {
    console.error(`Certificate file not found: ${srcPath}`);
  }
}); 