// config.js
const env = process.env.NODE_ENV || 'development'; // Default to 'development' if NODE_ENV is not set

const development = {
  baseUrl: 'https://localhost:44334', // Development API base URL
};

const production = {
  baseUrl: 'https://api.your-production-domain.com', // Production API base URL
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