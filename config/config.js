module.exports = {
    API_ENDPOINT: 'https://theearthcarefoundation.org/userdetails.php',
    API_KEY: '5432109876',
    FETCH_INTERVAL: 16 * 60 * 1000, // 16 minutes
    PORT: 3000,
    CACHE_TTL: 15 * 60 * 1000, // 15 minutes cache
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000 // 1 second
};