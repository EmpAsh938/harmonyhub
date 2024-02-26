import mongoose, { Schema, Document } from 'mongoose';

// Define the Role schema
export interface RoleDocument extends Document {
    name: string;
    serverId: string;
    color?: string;
    createdAt: Date;
    updatedAt: Date;
}

const RoleSchema: Schema = new Schema({
    name: { type: String, required: true },
    serverId: { type: Schema.Types.ObjectId, ref: 'Server', required: true },
    color: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create and export the Role model
export default mongoose.model<RoleDocument>('Role', RoleSchema);
