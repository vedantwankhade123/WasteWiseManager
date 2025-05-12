const { createRequestHandler } = require('@netlify/remix-adapter');
const path = require('path');

// Import the compiled server build
const BUILD_DIR = path.join(process.cwd(), 'dist');
const build = require('../../dist/server');

// Create a request handler for the Netlify function
exports.handler = createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: () => ({
    // You can add any context you want to be available in your loaders and actions
    env: process.env,
  }),
});
