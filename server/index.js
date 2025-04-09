const express = require("express");
const app = express();
const PORT = 3000;

const latestVersion = {
  bundleUrl: 'https://yourserver.com/bundles/index.bundle',
  version: '2.0.0'
}

app.get('/update', (req, res) => {
  const currentVersion = req.query.currentVersion;

  if (currentVersion != latestVersion.version) {
    res.json(latestVersion);
  } else {
    res.status(204).send();
  }
});

app.listen(PORT, console.log(`Server Running on Port ${PORT}`));
