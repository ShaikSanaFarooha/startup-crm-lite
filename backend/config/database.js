import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables to support standalone database script execution
dotenv.config();
dotenv.config({ path: './.env file' });

/**
 * Establishes a connection to the MongoDB Atlas cluster.
 * Uses configuration parameters specified in the environment variables.
 * Exits the process on connection failure.
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.error('CRITICAL: MONGODB_URI environment variable is not defined.');
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoURI);
    
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
export { connectDB };
