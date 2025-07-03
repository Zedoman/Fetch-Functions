const axios = require('axios');
const config = require('../config/config');
const dataService = require('../services/dataService');
const cacheService = require('../services/cacheService');

class FetchController {
    async fetchWithRetry(url, params, retries = config.MAX_RETRIES) {
        try {
            const response = await axios.get(url, { params });
            return response.data;
        } catch (error) {
            if (retries > 0) {
                await new Promise(resolve => setTimeout(resolve, config.RETRY_DELAY));
                return this.fetchWithRetry(url, params, retries - 1);
            }
            throw error;
        }
    }

    async fetchData() {
        const cacheKey = 'api-data';
        const cachedData = cacheService.get(cacheKey);
        
        if (cachedData) {
            return cachedData;
        }

        const rawData = await this.fetchWithRetry(config.API_ENDPOINT, {
            apikey: config.API_KEY
        });

        const processedData = await dataService.processData(rawData);
        cacheService.set(cacheKey, processedData);
        
        return processedData;
    }

    async getPhysicsWallahData() {
        const data = await this.fetchData();
        return data.physicswallah;
    }

    async getOrbitData() {
        const data = await this.fetchData();
        return data.orbit;
    }
}

module.exports = new FetchController();