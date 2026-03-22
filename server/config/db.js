import mongoose from "mongoose";

// connect to the mongoDB
const connectDB = async () => {
    try {
        console.log('🔄 Attempting to connect to MongoDB...');
        
        mongoose.connection.on('connected', () => console.log('✅ Database Connected'));
        mongoose.connection.on('error', (err) => console.error('❌ Database connection error:', err));
        mongoose.connection.on('disconnected', () => console.log('⚠️ Database Disconnected'));
        
        const options = {
            serverSelectionTimeoutMS: 45000, // 45 seconds for initial connection
            socketTimeoutMS: 45000,
            connectTimeoutMS: 45000,
            maxPoolSize: 10,
            family: 4, // Use IPv4
        };

        console.log('📝 Connection options:', {
            timeout: "45s",
            maxPoolSize: 10
        });

        const mongoUri = `${process.env.MONGODB_URI}/job-portal`;
        console.log('📍 Connecting to:', mongoUri.split('@')[1] || 'MongoDB');

        await mongoose.connect(mongoUri, options);
        
        console.log('✅ MongoDB connected successfully');
        return true;
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error.message);
        console.error('⚠️ Server will continue running, but database operations may fail');
        // Don't throw - allow server to start even if DB connection fails
        return false;
    }
}

export default connectDB;