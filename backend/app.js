const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: '*',  // Allow requests from your frontend
  methods: ['GET', 'POST'],  // Allow only GET and POST requests
  allowedHeaders: ['Content-Type'],  // Allow only Content-Type header
}));

const db = mysql.createConnection({
  host: process.env.DB_HOST,  
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// MySQL Connection
// const db = mysql.createConnection({
//   host: 'mysql-service',  
//   user: 'root',
//   password: 'thepassword',
//   database: 'names_db',
// });

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);  // Exit if unable to connect to MySQL
  }
  console.log('Connected to MySQL!');
  
  // Check if the 'names' table exists, if not, create it
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS names (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
  `;
  
  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating table:', err);
      process.exit(1);  // Exit if unable to create table
    }
    console.log('Checked/created table: names');
  });
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
  console.log(`Server running on localhost port: ${port}`);
});
