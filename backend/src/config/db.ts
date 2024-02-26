import mongoose from 'mongoose';


// Connect to MongoDB
export const connectDB = async () => {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';

    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process with failure
    }
};
