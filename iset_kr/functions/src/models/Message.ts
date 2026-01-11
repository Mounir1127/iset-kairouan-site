import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    sender: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
    subject: string;
    content: string;
    read: boolean;
    parentMessage?: mongoose.Types.ObjectId;
    createdAt: Date;
}

const MessageSchema: Schema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
    parentMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models['Message'] || mongoose.model<IMessage>('Message', MessageSchema);
