import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for your user document
export interface UserDocument extends Document {
    _id: string;
    username: string;
    email: string;
    password: string;
    avatar?: string;
    bio?: string;
    friends: string[];
    createdAt: Date;
    updatedAt: Date;
}

// Define the schema for the user model
const UserSchema = new Schema<UserDocument>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
    bio: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create and export the user model
const User = mongoose.model<UserDocument>('User', UserSchema);
export default User;
