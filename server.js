const express = require('express');
const path = require('path');
const app = express();

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Serve JSON events
app.get('/events', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/events.json'));
});
app.get('/rules', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/rules.json'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
