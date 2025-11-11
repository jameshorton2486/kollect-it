// Load environment variables from .env.local (or .env as fallback)
require('dotenv').config({ path: '.env.local' });
require('dotenv').config(); // Fallback to .env

// Prisma configuration
module.exports = {
  schema: './prisma/schema.prisma',
};
