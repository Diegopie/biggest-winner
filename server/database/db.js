import mongoose from 'mongoose';
import 'dotenv/config'


export default async function connectMongo() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }
    mongoose.connect(mongoUri);
    const db = mongoose.connection;
    
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
    db.once("open", () => console.log("Connected to MongoDB"));
    return db;
  } catch (error) {
    console.log('Error Connecting to DB');
    console.log(error);
  }
}
