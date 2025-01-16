import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mmongodb+srv://martagranado1011:E9hrjNAY2g8lN3Ze@cluster0.fyi8v.mongodb.net/";

if (!MONGODB_URI) {
  throw new Error("Por favor define la variable de entorno MONGODB_URI");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
