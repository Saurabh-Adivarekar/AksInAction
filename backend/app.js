const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: '*',  // Allows requests from any origin
  methods: ['GET', 'POST'],  // Allow only GET and POST requests
  allowedHeaders: ['Content-Type'],  // Allow only Content-Type header
}));

// MySQL Connection
const db = mysql.createConnection({
    host: '127.0.0.1',  // 'mysql' is the service name in Docker Compose
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
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Name saved successfully!' });
    });
});

// Get names endpoint
app.get('/api/get-names', (req, res) => {
    db.query('SELECT name FROM names', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        const names = results.map((row) => row.name);
        res.json(names);
    });
});

// Serve the React frontend (production build)
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'frontend/build' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
