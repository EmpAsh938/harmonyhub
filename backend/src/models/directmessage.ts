import mongoose, { Schema, Document } from 'mongoose';

// Define the DirectMessage schema
export interface DirectMessageDocument extends Document {
    senderId: string;
    recipientId: string;
    content: string;
    createdAt: Date;
}

const DirectMessageSchema: Schema = new Schema({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Create and export the DirectMessage model
export default mongoose.model<DirectMessageDocument>('DirectMessage', DirectMessageSchema);
