const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // For JSON parsing

// --- Serve static bundles from 'bundles' folder ---
app.use('/bundles', express.static(path.join(__dirname, 'bundles')));

// --- Simple database (in-memory for now) ---
const bundles = {
  ios: {
    version: '1.0.2',
    url: 'https://your-server.com/bundles/ios/index-1.0.2.bundle',
  },
  android: {
    version: '1.0.3',
    url: 'https://your-server.com/bundles/android/index-1.0.3.bundle',
  },
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const platform = req.body.platform.toLowerCase();
    const platformPath = path.join(__dirname, 'bundles', platform);

    // Ensure platform directory exists
    fs.mkdirSync(platformPath, { recursive: true });

    cb(null, platformPath);
  },
  filename: (req, file, cb) => {
    const version = req.body.version;
    cb(null, `index-${version}.bundle`);
  },
});

const upload = multer({ storage });

// --- Health check ---
app.get('/', (req, res) => {
  res.send('🔥 OTA Server is running!');
});

// --- Get latest bundle info ---
app.get('/update', (req, res) => {
  const platform = req.query.platform; // 'ios' or 'android'
  const currentVersion = req.query.version; // like '1.0.0'

  if (!platform || !currentVersion) {
    return res.status(400).json({ error: 'Missing platform or version query params' });
  }

  const latestBundle = bundles[platform.toLowerCase()];

  if (!latestBundle) {
    return res.status(404).json({ error: 'Platform not supported' });
  }

  const shouldUpdate = latestBundle.version > currentVersion;

  res.json({
    shouldUpdate,
    bundleUrl: shouldUpdate ? latestBundle.url : null,
    latestVersion: latestBundle.version,
  });
});

// --- Upload new bundle ---
app.post('/upload', upload.single('bundle'), (req, res) => {
  const platform = req.body.platform?.toLowerCase();
  const version = req.body.version;

  if (!platform || !version || !req.file) {
    return res.status(400).json({ error: 'Missing platform, version, or bundle file' });
  }

  // Update bundles object
  bundles[platform] = {
    version: version,
    url: `https://your-server.com/bundles/${platform}/index-${version}.bundle`,
  };

  console.log(`✅ New ${platform} bundle uploaded: v${version}`);
  res.json({ message: 'Bundle uploaded and registered successfully!' });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`🔥 OTA server running on http://localhost:${PORT}`);
});
