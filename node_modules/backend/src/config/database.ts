import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/racing-club-bingerville';
  
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erreur de connexion MongoDB: ${error}`);
    // Retry logic
    console.log('Tentative de reconnexion dans 5 secondes...');
    setTimeout(connectDB, 5000);
  }
};
