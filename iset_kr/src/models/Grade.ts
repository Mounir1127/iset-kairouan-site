import mongoose, { Schema, Document } from 'mongoose';

export interface IGrade extends Document {
    student: mongoose.Types.ObjectId;
    module: mongoose.Types.ObjectId;
    examType: 'DS' | 'Examen' | 'TP' | 'Projet';
    value: number;
    semester: number;
    academicYear: string;
    published: boolean;
    status: 'draft' | 'submitted' | 'validated';
    validatedBy?: mongoose.Types.ObjectId; // Teacher/Chef
}

const GradeSchema: Schema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    module: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
    examType: { type: String, enum: ['DS', 'Examen', 'TP', 'Projet'], required: true },
    value: { type: Number, required: true, min: 0, max: 20 },
    semester: { type: Number, required: true },
    academicYear: { type: String, required: true },
    published: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'submitted', 'validated'], default: 'draft' },
    validatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.models['Grade'] || mongoose.model<IGrade>('Grade', GradeSchema);
