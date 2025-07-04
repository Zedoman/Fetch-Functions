// services/dataService.js
const PriorityQueue = require('../utils/priorityQueue');
const cacheService = require('./cacheService');

class DataService {
    constructor() {
        this.processData = cacheService.memoize(
            this._processData.bind(this),
            (rawData) => `data-${JSON.stringify(rawData).length}`
        );
        this.processJeevikaData = cacheService.memoize(
            this._processJeevikaData.bind(this),
            (rawData) => `jeevika-${JSON.stringify(rawData).length}`
        );
        this.processCSCData = cacheService.memoize(
            this._processCSCData.bind(this),
            (rawData) => `csc-${JSON.stringify(rawData).length}`
        );
    }

    async _processData(rawData) {
        if (!rawData || !rawData.data) {
            return { finz: [], physicswallah: [] };
        }

        const queue = new PriorityQueue((a, b) => {
            return new Date(a.created_at) > new Date(b.created_at);
        });

        const finzMap = new Map();
        const physicswallahMap = new Map();

        rawData.data.forEach(item => queue.push(item));

        while (queue.size() > 0) {
            const item = queue.pop();
            const targetMap = item.type === 'FinZ' ? finzMap : physicswallahMap;
            
            if (!targetMap.has(item.id)) {
                targetMap.set(item.id, item);
            }
        }

        return {
            finz: Array.from(finzMap.values()),
            physicswallah: Array.from(physicswallahMap.values())
        };
    }

    async _processJeevikaData(rawData) {
        if (!rawData || !rawData.data) {
            return [];
        }

        const queue = new PriorityQueue((a, b) => {
            return new Date(a.created_at) > new Date(b.created_at);
        });

        const jeevikaMap = new Map();

        rawData.data.forEach(item => queue.push(item));

        while (queue.size() > 0) {
            const item = queue.pop();
            if (!jeevikaMap.has(item.id)) {
                jeevikaMap.set(item.id, item);
            }
        }

        return Array.from(jeevikaMap.values());
    }

    async _processCSCData(rawData) {
        try {
            // Handle different response structures
            let dataArray = [];
            
            if (Array.isArray(rawData)) {
                dataArray = rawData;
            } else if (rawData && typeof rawData === 'object') {
                // Check common response structures
                dataArray = rawData.data || rawData.users || rawData.items || [];
            }
    
            if (!Array.isArray(dataArray)) {
                console.warn('Unexpected CSC data format:', rawData);
                return [];
            }
    
            const queue = new PriorityQueue((a, b) => {
                const dateA = a.registration_date || a.created_at || a.date || a.timestamp;
                const dateB = b.registration_date || b.created_at || b.date || b.timestamp;
                return new Date(dateA) > new Date(dateB);
            });
    
            const cscMap = new Map();
    
            dataArray.forEach(item => {
                if (item && typeof item === 'object') {
                    queue.push(item);
                }
            });
    
            while (queue.size() > 0) {
                const item = queue.pop();
                const id = item.user_id || item.id || item._id || 
                          (item.email ? `email_${item.email}` : null);
                
                if (id && !cscMap.has(id)) {
                    cscMap.set(id, item);
                }
            }
    
            return Array.from(cscMap.values());
        } catch (error) {
            console.error('Error processing CSC data:', error);
            return [];
        }
    }
}

module.exports = new DataService();