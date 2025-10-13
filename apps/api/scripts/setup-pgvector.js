const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Setting up pgvector extension...');
    await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS vector');
    console.log('✅ pgvector extension enabled');
  } catch (error) {
    console.error('Error setting up pgvector:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

