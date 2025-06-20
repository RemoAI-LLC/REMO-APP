import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CERTS_DIR = path.join(__dirname, '..', 'desktop');

// Create certs directory if it doesn't exist
if (!fs.existsSync(CERTS_DIR)) {
  fs.mkdirSync(CERTS_DIR, { recursive: true });
}

// Generate certificates using mkcert
console.log('Generating SSL certificates...');
execSync('npx mkcert create-ca');
execSync(`npx mkcert create-cert --domains localhost --ca-key "ca.key" --ca-cert "ca.crt"`);

// Move certificates to the desktop directory
fs.renameSync('cert.crt', path.join(CERTS_DIR, 'localhost.pem'));
fs.renameSync('cert.key', path.join(CERTS_DIR, 'localhost-key.pem'));

// Clean up CA certificates
fs.unlinkSync('ca.key');
fs.unlinkSync('ca.crt');

console.log('SSL certificates generated successfully!'); 