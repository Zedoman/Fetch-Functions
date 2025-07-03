const PriorityQueue = require('../utils/priorityQueue');
const cacheService = require('./cacheService');

class DataService {
    constructor() {
        this.processData = cacheService.memoize(
            this._processData.bind(this),
            (rawData) => `data-${JSON.stringify(rawData).length}`
        );
    }

    async _processData(rawData) {
        if (!rawData || !rawData.data) {
            return { orbit: [], physicswallah: [] };
        }

        // Use priority queue for efficient processing
        const queue = new PriorityQueue((a, b) => {
            // Prioritize newer records based on created_at
            return new Date(a.created_at) > new Date(b.created_at);
        });

        // Create hash maps for quick lookups
        const orbitMap = new Map();
        const physicswallahMap = new Map();

        // Add all items to queue
        rawData.data.forEach(item => queue.push(item));

        // Process items in priority order
        while (queue.size() > 0) {
            const item = queue.pop();
            const targetMap = item.type === 'FinZ' ? orbitMap : physicswallahMap;
            
            // Deduplication - keep only the latest version of each record
            if (!targetMap.has(item.id)) {
                targetMap.set(item.id, item);
            }
        }

        return {
            orbit: Array.from(orbitMap.values()),
            physicswallah: Array.from(physicswallahMap.values())
        };
    }
}

module.exports = new DataService();