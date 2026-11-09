import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

/**
 * Returns a MongoDB connection, or `null` when the in-memory store should be used.
 *
 * The in-memory store is ONLY allowed in development/test when MONGODB_URI is unset.
 * It is wiped on restart and not shared between server instances, so in production
 * a missing URI or a failed connection throws instead of silently losing donations.
 * Callers let the error surface as a 5xx, which also makes Razorpay retry webhooks.
 */
export async function connectToDatabase(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("MONGODB_URI is not configured. Refusing to store donations in memory in production.");
    }
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      dbName: "deeproots_ngo",
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("MongoDB connection error:", e);
    throw new Error("Database connection failed.");
  }

  return cached.conn;
}
