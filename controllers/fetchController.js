// controllers/fetchController.js
const axios = require('axios');
const config = require('../config/config');
const dataService = require('../services/dataService');
const cacheService = require('../services/cacheService');

class FetchController {
    async fetchWithRetry(url, params, headers = {}, retries = config.MAX_RETRIES) {
        try {
            const response = await axios.get(url, { params, headers });
            return response.data;
        } catch (error) {
            if (retries > 0) {
                await new Promise(resolve => setTimeout(resolve, config.RETRY_DELAY));
                return this.fetchWithRetry(url, params, headers, retries - 1);
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

    async fetchJeevikaData() {
        const cacheKey = 'jeevika-data';
        const cachedData = cacheService.get(cacheKey);
        
        if (cachedData) {
            return cachedData;
        }

        const rawData = await this.fetchWithRetry(config.JEEVIKA_ENDPOINT, {
            apikey: config.API_KEY
        });

        const processedData = await dataService.processJeevikaData(rawData);
        cacheService.set(cacheKey, processedData);
        
        return processedData;
    }

    async fetchCSCData() {
        const cacheKey = 'csc-data';
        const cachedData = cacheService.get(cacheKey);
        
        if (cachedData) {
            return cachedData;
        }
    
        try {
            const response = await axios.post(
                config.CSC_ENDPOINT,
                {}, // Empty body or add required request body if needed
                {
                    headers: {
                        'Authorization': `Bearer ${config.CSC_TOKEN}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );
    
            // console.log('CSC API Response:', response.data);
            
            if (!response.data) {
                throw new Error('Empty response from CSC API');
            }
    
            const processedData = await dataService.processCSCData(response.data);
            cacheService.set(cacheKey, processedData);
            
            return processedData;
        } catch (error) {
            console.error('CSC API Error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    }

    async getPhysicsWallahData() {
        const data = await this.fetchData();
        return data.physicswallah;
    }

    async getFinzData() {
        const data = await this.fetchData();
        return data.finz;
    }

    async getJeevikaData() {
        return await this.fetchJeevikaData();
    }

    async getCSCData() {
        return await this.fetchCSCData();
    }
}

module.exports = new FetchController();