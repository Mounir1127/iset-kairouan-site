import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
    name: string;
    email: string;
    message: string;
    status: 'pending' | 'read' | 'replied';
    createdAt: Date;
}

const ContactSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['pending', 'read', 'replied'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models['Contact'] || mongoose.model<IContact>('Contact', ContactSchema);
