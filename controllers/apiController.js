const express = require('express');
const router = express.Router();
const fetchController = require('./fetchController');


router.get('/ECF', async (req, res) => {
    try {
        const data = await fetchController.getPhysicsWallahData();
        res.json({
            success: true,
            count: data.length,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch PhysicsWallah data',
            error: error.message
        });
    }
});

// API to get PhysicsWallah data
router.get('/physicswallah', async (req, res) => {
    try {
        const data = await fetchController.getPhysicsWallahData();
        res.json({
            success: true,
            count: data.length,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch PhysicsWallah data',
            error: error.message
        });
    }
});

// API to get Finz data
router.get('/finz', async (req, res) => {
    try {
        const data = await fetchController.getFinzData();
        res.json({
            success: true,
            count: data.length,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch Finz data',
            error: error.message
        });
    }
});

// Manual trigger endpoint
router.get('/fetch', async (req, res) => {
    try {
        await fetchController.fetchData();
        res.json({
            success: true,
            message: 'Data fetch completed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch data',
            error: error.message
        });
    }
});

// API to get Jeevika data
router.get('/jeevika', async (req, res) => {
    try {
        const data = await fetchController.getJeevikaData();
        res.json({
            success: true,
            count: data.length,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch Jeevika data',
            error: error.message
        });
    }
});

// API to get CSC data
router.post('/csc', async (req, res) => {
    try {
        const data = await fetchController.getCSCData();
        
        if (!Array.isArray(data)) {
            throw new Error('Invalid data format received from CSC API');
        }

        res.json({
            success: true,
            count: data.length,
            data
        });
    } catch (error) {
        console.error('CSC API Route Error:', {
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        });

        const statusCode = error.response?.status || 500;
        const errorData = error.response?.data || { error: error.message };
        
        res.status(statusCode).json({
            success: false,
            message: 'Failed to fetch CSC data',
            error: errorData
        });
    }
});


module.exports = router;