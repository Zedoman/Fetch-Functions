const express = require('express');
const router = express.Router();
const fetchController = require('./fetchController');

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

// API to get Orbit data
router.get('/orbit', async (req, res) => {
    try {
        const data = await fetchController.getOrbitData();
        res.json({
            success: true,
            count: data.length,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch Orbit data',
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

module.exports = router;