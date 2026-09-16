import mongoose from 'mongoose';

let memoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/yewla_gp';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[Database] Connected to MongoDB at: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`[Database] Could not connect to primary MongoDB at ${uri}: ${err.message}`);
    console.log('[Database] Falling back to embedded MongoMemoryServer for development/testing...');

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create({
        spawn: {
          timeout: 60000,
        },
      });
      const memUri = memoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[Database] Successfully connected to MongoMemoryServer at: ${memUri}`);
      return conn;
    } catch (memErr) {
      console.error('[Database] Failed to start fallback MongoMemoryServer:', memErr.message);
      process.exit(1);
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};
