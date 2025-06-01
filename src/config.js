// config.js
const env = process.env.NODE_ENV || 'production'; // Default to 'development' if NODE_ENV is not set

const development = {
  baseUrl: 'https://localhost:44334', // Development API base URL
};

const production = {
  baseUrl: 'https://minimart-api-lp1k.onrender.com', // Production API base URL
};

const staging = {
  baseUrl: 'https://staging.your-domain.com', // Staging API base URL
};

const testing = {
  baseUrl: 'https://testing.your-domain.com', // Testing API base URL
};

const config = {
  development,
  production,
  staging,
  testing,
};

export default config[env]; // Export the appropriate configuration based on the environment