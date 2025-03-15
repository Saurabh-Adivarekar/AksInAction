const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://3.110.45.130:8080',  // Allow requests from your frontend
  methods: ['GET', 'POST'],  // Allow only GET and POST requests
  allowedHeaders: ['Content-Type'],  // Allow only Content-Type header
}));

// MySQL Connection
const db = mysql.createConnection({
  host: 'myapp-mysql',  // Use MySQL container name if within Docker network, or 'localhost' if running on the same machine
  user: 'root',
  password: 'rootpassword',
  database: 'names_db',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);  // Exit if unable to connect to MySQL
  }
  console.log('Connected to MySQL!');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ message: 'Backend is running' });
});

// Save name endpoint
app.post('/api/save-name', (req, res) => {
  const { name } = req.body;
  const query = 'INSERT INTO names (name) VALUES (?)';
  db.query(query, [name], (err, result) => {
    if (err) {
      console.error('Error saving name:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Name saved successfully!' });
  });
});

// Get names endpoint
app.get('/api/get-names', (req, res) => {
  db.query('SELECT name FROM names', (err, results) => {
    if (err) {
      console.error('Error fetching names:', err);
      return res.status(500).json({ error: err.message });
    }
    const names = results.map((row) => row.name);
    res.json(names);
  });
});

// Serve the React frontend (production build)
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Catch-all for React frontend requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
