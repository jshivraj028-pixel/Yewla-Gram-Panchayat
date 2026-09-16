import dotenv from 'dotenv';
dotenv.config();

import { connectDB, closeDB } from '../config/db.js';
import { seedDatabase } from './seedCore.js';

const run = async () => {
  try {
    console.log('[Seed] Connecting to database...');
    await connectDB();
    await seedDatabase();
    console.log('-------------------------------------------------------');
    console.log('DEMO CREDENTIALS CREATED:');
    console.log('👑 Admin:   admin@yewlagp.in    / AdminPassword123!   (Mobile: 7666718978)');
    console.log('👷 Staff:   staff@yewlagp.in    / StaffPassword123!   (Mobile: 9876543211)');
    console.log('🧑 Citizen: citizen@yewlagp.in  / CitizenPassword123! (Mobile: 9876543220)');
    console.log('-------------------------------------------------------');
    await closeDB();
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error:', err);
    process.exit(1);
  }
};

run();
