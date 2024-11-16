const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Middleware to parse form data (application/x-www-form-urlencoded or JSON)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public'))); // Serve all assets under "public"

// Static file serving for specific directories (optional, but explicit)
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets'))); // For images, fonts, icons

// Set up SQLite database
const db = new sqlite3.Database('./message.db', (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Database connected');
    }
});

// Create 'messages' table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

// Set up Nodemailer with your email credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'Josephatmusyoka138@gmail.com',  // Your email address
        pass: 'ccdr gurj jtcc erjz'  // Use an app-specific password if you're using 2FA
    }
});

// POST route for handling form submission and sending email confirmation
app.post('/submit-message', (req, res) => {
    console.log('Incoming headers:', req.headers);
    console.log('Received form data:', req.body);

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        console.log('Error: Missing form data');
        return res.status(400).send('All fields are required');
    }

    const stmt = db.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)');
    stmt.run([name, email, message], (err) => {
        if (err) {
            console.error('Error inserting message into DB:', err);
            return res.status(500).send('Error saving message');
        }

        console.log('Message saved:', req.body);  // Log the submitted form data

        const mailOptions = {
            from: 'Josephatmusyoka138@gmail.com',
            to: email,
            subject: 'Message Received - Kababa TechCare Solutions',
            text: `Hi ${name},\n\nThank you for reaching out! We've received your message: "${message}". We'll get back to you soon.\n\nBest regards,\nKababa TechCare Solutions`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
                if (!res.headersSent) {
                    return res.status(500).send('Error sending email');
                }
            } else {
                console.log('Email sent:', info.response);
                if (!res.headersSent) {
                    return res.status(200).send('Message received successfully');
                }
            }
        });
    });

    stmt.finalize();
});

// Serve the HTML page for the home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Export the function to Vercel
module.exports = (req, res) => {
    app(req, res);
};
