const express = require('express');
const config = require('./config/config');
const azureTimer = require('./utils/azureTimer');
const apiRouter = require('./controllers/apiController');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

// Start Azure Timer
azureTimer.start();

// Start server
const server = app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    azureTimer.stop();
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    azureTimer.stop();
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});