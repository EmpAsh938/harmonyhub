import mongoose, { Schema, Document } from 'mongoose';

// Define the Task schema
export interface TaskDocument extends Document {
    title: string;
    description?: string;
    serverId: string;
    assignedTo: string;
    status: 'open' | 'in progress' | 'closed';
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    serverId: { type: Schema.Types.ObjectId, ref: 'Server', required: true },
    assignedTo: { type: String, required: true },
    status: { type: String, enum: ['open', 'in progress', 'closed'], default: 'open' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create and export the Task model
export default mongoose.model<TaskDocument>('Task', TaskSchema);
