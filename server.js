const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'makoo_data.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) return {};
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/data/:key', (req, res) => {
  const { key } = req.params;
  const data = readData();
  res.json({ key, value: data[key] ?? null });
});

app.put('/api/data/:key', (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  const data = readData();
  data[key] = value;
  writeData(data);
  res.json({ key, status: 'saved' });
});

app.listen(PORT, () => {
  console.log(`Makoo data server running on http://localhost:${PORT}`);
});
