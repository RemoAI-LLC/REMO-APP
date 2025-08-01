import { app, BrowserWindow } from 'electron';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import https from 'https';
import { AddressInfo } from 'net';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isDev = process.env.NODE_ENV === 'development';

let mainWindow: BrowserWindow | null = null;
let server: https.Server | null = null;

async function createProductionServer(): Promise<number> {
  try {
    console.log('Starting production server setup...');
    console.log('Current directory:', __dirname);
    console.log('Is development mode:', isDev);
    
    // Generate self-signed certificate for localhost
    const selfsigned = await import('selfsigned');
    const attrs = [{ name: 'commonName', value: 'localhost' }];
    const pems = selfsigned.generate(attrs, {
      algorithm: 'sha256',
      days: 30,
      keySize: 2048,
      extensions: [{
        name: 'basicConstraints',
        cA: false
      }, {
        name: 'keyUsage',
        keyCertSign: false,
        digitalSignature: true,
        nonRepudiation: false,
        keyEncipherment: true,
        dataEncipherment: false
      }, {
        name: 'extKeyUsage',
        serverAuth: true,
        clientAuth: false,
        codeSigning: false,
        timeStamping: false
      }, {
        name: 'subjectAltName',
        altNames: [{
          type: 2,
          value: 'localhost'
        }]
      }]
    });

    const options = {
      key: pems.private,
      cert: pems.cert,
    };

    const distPath = path.join(__dirname, '..');
    console.log('Serving from:', distPath);

    if (!fs.existsSync(distPath)) {
      console.error('Dist directory not found:', distPath);
      throw new Error('Dist directory missing');
    }

    // List the contents of the dist directory
    console.log('Dist directory contents:', fs.readdirSync(distPath));

    server = https.createServer(options, (req, res) => {
      try {
        console.log('Incoming request:', req.url);
        const reqPath = req.url === '/' ? '/index.html' : req.url!;
        const filePath = path.join(distPath, decodeURI(reqPath));
        console.log('Resolved file path:', filePath);

        // Security check to prevent directory traversal
        if (!filePath.startsWith(distPath)) {
          console.error('Invalid path requested:', filePath);
          res.writeHead(403);
          res.end('Forbidden');
          return;
        }

        // Set correct content type for different file types
        const ext = path.extname(filePath);
        const contentType = {
          '.html': 'text/html',
          '.js': 'text/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
          '.png': 'image/png',
          '.jpg': 'image/jpg',
          '.gif': 'image/gif',
          '.svg': 'image/svg+xml',
          '.ico': 'image/x-icon',
          '.woff': 'font/woff',
          '.woff2': 'font/woff2',
          '.ttf': 'font/ttf',
          '.eot': 'font/eot',
        }[ext] || 'application/octet-stream';

        fs.readFile(filePath, (err, data) => {
          if (err) {
            console.error('File read error:', err);
            if (err.code === 'ENOENT') {
              res.writeHead(404);
              res.end(`File not found: ${reqPath}`);
            } else {
              res.writeHead(500);
              res.end(`Error reading file: ${err.message}`);
            }
            return;
          }
          console.log(`Serving ${reqPath} with content type ${contentType}`);
          res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': data.length,
            'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; font-src 'self';",
          });
          res.end(data);
        });
      } catch (error) {
        console.error('Request handler error:', error);
        res.writeHead(500);
        res.end('Internal server error');
      }
    });

    return new Promise((resolve) => {
      server!.listen(0, 'localhost', () => {
        const address = server!.address() as AddressInfo;
        const port = address.port;
        console.log('Server listening on port:', port);
        resolve(port);
      });
    });
  } catch (error) {
    console.error('Server creation error:', error);
    throw error;
  }
}

async function createWindow() {
  try {
    console.log('Creating main window...');
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: true,
        allowRunningInsecureContent: isDev,
        experimentalFeatures: false,
      },
    });

    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('Page failed to load:', errorCode, errorDescription);
    });

    mainWindow.webContents.on('did-start-loading', () => {
      console.log('Page started loading');
    });

    mainWindow.webContents.on('did-finish-load', () => {
      console.log('Page finished loading');
    });

    mainWindow.webContents.on('did-frame-finish-load', () => {
      console.log('Frame finished loading');
    });

    mainWindow.webContents.on('dom-ready', () => {
      console.log('DOM is ready');
    });

    // Set CSP header
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': ["default-src 'self' 'unsafe-inline' 'unsafe-eval' https://localhost:*"]
        }
      });
    });

    if (isDev) {
      console.log('Running in development mode');
      await mainWindow.loadURL('http://localhost:5173');
    } else {
      console.log('Running in production mode');
      const port = await createProductionServer();
      const url = `https://localhost:${port}`;
      console.log('Loading URL:', url);
      await mainWindow.loadURL(url);
    }

    // Always open DevTools
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
      mainWindow = null;
      if (server) {
        server.close();
      }
    });
  } catch (error) {
    console.error('Window creation error:', error);
    throw error;
  }
}

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  // Only allow certificates for localhost
  if (new URL(url).hostname === 'localhost') {
    console.log('Allowing self-signed certificate for localhost');
    event.preventDefault();
    callback(true);
  } else {
    callback(false);
  }
});
app.whenReady().then(createWindow).catch(console.error);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (server) {
      server.close();
    }
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow().catch(console.error);
  }
});