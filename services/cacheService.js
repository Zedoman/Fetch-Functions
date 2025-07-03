const NodeCache = require('node-cache');
const config = require('../config/config');

class CacheService {
    constructor() {
        this.cache = new NodeCache({
            stdTTL: config.CACHE_TTL / 1000, // Convert to seconds
            checkperiod: 60
        });
    }

    get(key) {
        return this.cache.get(key);
    }

    set(key, value) {
        return this.cache.set(key, value);
    }

    memoize(func, keyGenerator) {
        return async (...args) => {
            const key = keyGenerator(...args);
            const cached = this.get(key);
            
            if (cached) {
                return cached;
            }
            
            const result = await func(...args);
            this.set(key, result);
            return result;
        };
    }
}

module.exports = new CacheService();