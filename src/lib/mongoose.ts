import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// ✅ Define a global interface for cached mongoose connection
interface MongooseGlobalCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// ✅ Type-cast globalThis to include our cache
const globalWithMongoose = globalThis as typeof globalThis & {
  mongoose: MongooseGlobalCache;
};

// ✅ Use global cache, or initialize it
if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (globalWithMongoose.mongoose.conn) return globalWithMongoose.mongoose.conn;

  if (!globalWithMongoose.mongoose.promise) {
    globalWithMongoose.mongoose.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }

  globalWithMongoose.mongoose.conn = await globalWithMongoose.mongoose.promise;
  return globalWithMongoose.mongoose.conn;
}

export default connectToDatabase;
