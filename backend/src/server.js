import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if running on empty database
    const { User } = await import('./models/User.js');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Bootstrap] Empty database detected. Running seed...');
      // Dynamically import seed function or run seed logic
      const { seedDatabase } = await import('./seeds/seedCore.js');
      await seedDatabase();
    } else {
      await User.updateOne(
        { role: 'admin' },
        { $set: { name: 'Yuvraj Jadhav', mobile: '7666718978' } }
      );
    }

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🏛️  YEWLA GRAM PANCHAYAT CITIZEN SERVICE SYSTEM (API)  `);
      console.log(`📡 Server running on http://localhost:${PORT}`);
      console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
