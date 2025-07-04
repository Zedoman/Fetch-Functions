// config/config.js
module.exports = {
    API_ENDPOINT: 'https://theearthcarefoundation.org/userdetails.php',
    JEEVIKA_ENDPOINT: 'https://theearthcarefoundation.org/userdetails-jeevika.php',
    CSC_ENDPOINT: 'https://csc.theearthcarefoundation.org/api/user_details',
    API_KEY: '5432109876',
    CSC_TOKEN: 'e2iOOEMOIOPEWNoiwr0932mlvhdzp8224lka9823u2nvnksrwoe2394204jfamnvzshiowu823nf9ccni239hn023ij2102n392h38hnc2nrf923c229pr23kau12u3',
    FETCH_INTERVAL: 16 * 60 * 1000, // 16 minutes
    PORT: 3000,
    CACHE_TTL: 15 * 60 * 1000, // 15 minutes cache
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000 // 1 second
};