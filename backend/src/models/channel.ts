import mongoose, { Schema, Document } from 'mongoose';

// Define the Channel schema
export interface ChannelDocument extends Document {
    name: string;
    serverId: string;
    ownerId: string;
    type: 'text' | 'audio' | 'video';
    isPrivate: boolean;
    members: string[];
    deletable: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ChannelSchema: Schema = new Schema({
    name: { type: String, required: true },
    serverId: { type: Schema.Types.ObjectId, ref: 'Server', required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['text', 'audio', 'video'], required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    deletable: { type: Boolean, required: true },
    isDeleted: { type: Boolean, required: true },
    isPrivate: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create and export the Channel model
export default mongoose.model<ChannelDocument>('Channel', ChannelSchema);
