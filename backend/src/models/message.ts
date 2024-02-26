import mongoose, { Schema, Document } from 'mongoose';

// Define the Message schema
export interface MessageDocument extends Document {
    channelId: string;
    userId: string;
    content?: string;
    media?: string;
    createdAt: Date;
}

const MessageSchema: Schema = new Schema({
    channelId: { type: Schema.Types.ObjectId, ref: 'Channel', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String },
    media: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// Custom validation function to ensure content or media is provided
MessageSchema.path('content').validate(function (value: string | undefined) {
    return !!value || !!this.media; // Return true if content or media is provided
}, 'Either content or media is required');

// Create and export the Message model
export default mongoose.model<MessageDocument>('Message', MessageSchema);
