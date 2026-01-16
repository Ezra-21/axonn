/**
 * Database Seeder
 * Main seeder file that runs all seeders
 */

import { PrismaClient } from '@prisma/client';
import seedAdmins from './adminSeeder.js';
import seedCategories from './categorySeeder.js';
import seedProducts from './productSeeder.js';

const prisma = new PrismaClient();

const runSeeders = async () => {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║           🌱 AXON DATABASE SEEDER               ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');

  try {
    // Run seeders in order
    await seedAdmins(prisma);
    console.log('');

    await seedCategories(prisma);
    console.log('');

    await seedProducts(prisma);
    console.log('');

    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║           ✅ ALL SEEDERS COMPLETED SUCCESSFULLY           ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('Default admin credentials:');
    console.log('  Super Admin: superadmin@axon.com / Admin@123');
    console.log('  Admin: admin@axon.com / Admin@123');
    console.log('  Ezra Leye (Super Admin): ezraleyeee@gmail.com / Admin@123');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Seeding failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

// Run seeders
runSeeders();
