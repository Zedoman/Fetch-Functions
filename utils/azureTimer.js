const fetchController = require('../controllers/fetchController');
const config = require('../config/config');

class AzureTimer {
    constructor() {
        this.intervalId = null;
        this.isRunning = false;
    }

    start() {
        // Run immediately
        this.executeFetch();
        
        // Set up interval
        this.intervalId = setInterval(() => {
            if (!this.isRunning) {
                this.executeFetch();
            }
        }, config.FETCH_INTERVAL);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    async executeFetch() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        console.log(`[${new Date().toISOString()}] Starting scheduled data fetch...`);
        
        try {
            const result = await fetchController.fetchData();
            console.log(`[${new Date().toISOString()}] Fetch completed. Orbit: ${result.orbit.length}, PW: ${result.physicswallah.length}`);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Fetch failed:`, error.message);
        } finally {
            this.isRunning = false;
        }
    }
}

module.exports = new AzureTimer();