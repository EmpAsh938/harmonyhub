import mongoose, { Schema, Document } from 'mongoose';

// Define the Server schema
export interface ServerDocument extends Document {
    name: string;
    ownerId: string;
    description?: string;
    icon?: string;
    members: string[]; // Array of user IDs who are part of the server
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ServerSchema: Schema = new Schema({
    name: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String },
    icon: { type: String },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs
    isDeleted: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create and export the Server model
export default mongoose.model<ServerDocument>('Server', ServerSchema);
