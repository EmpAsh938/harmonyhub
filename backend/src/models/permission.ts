import mongoose, { Schema, Document } from 'mongoose';

// Define the Permission schema
export interface PermissionDocument extends Document {
    roleId: string;
    permission: string;
}

const PermissionSchema: Schema = new Schema({
    roleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    permission: { type: String, required: true }
});

// Create and export the Permission model
export default mongoose.model<PermissionDocument>('Permission', PermissionSchema);
