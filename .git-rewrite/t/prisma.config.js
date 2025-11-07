// Load environment variables from .env
require('dotenv').config();

// Prisma configuration
module.exports = {
  schema: './prisma/schema.prisma',
};
