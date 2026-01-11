import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement extends Document {
    type: 'event' | 'tender' | 'news' | 'exam';
    title: string;
    status: 'draft' | 'published' | 'archived' | 'cancelled';
    publishDate: Date;
    image?: string;

    // Manifestations (event)
    description?: string;
    eventType?: string; // conférence, séminaire, workshop, journée scientifique...
    startDate?: Date;
    endDate?: Date;
    time?: string;
    location?: string;
    targetAudience?: string; // étudiants, enseignants, public
    organizer?: string;

    // Appels d'offre (tender)
    reference?: string;
    issuer?: string;
    deadline?: Date;
    conditions?: string;
    documents?: string[];
    contact?: string;

    // Nouveautés (news)
    summary?: string;
    content?: string;
    author?: string;
    category?: string;

    createdAt: Date;
}

const AnnouncementSchema: Schema = new Schema({
    type: { type: String, required: true }, // Removed strict enum to allow flexibility
    title: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published', 'archived', 'cancelled'], default: 'published' },
    publishDate: { type: Date, default: Date.now },
    image: { type: String },

    // Common fields
    number: { type: String },
    arabicText: { type: String },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'low' },
    attachments: [{
        name: { type: String },
        url: { type: String }
    }],

    // Manifestations
    description: { type: String },
    eventType: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    time: { type: String },
    location: { type: String },
    targetAudience: { type: [String] }, // Changed to array of strings
    organizer: { type: String },

    // Appels d'offre
    reference: { type: String },
    issuer: { type: String },
    deadline: { type: Date },
    conditions: { type: String },
    documents: [{ type: String }],
    contact: { type: String },

    // Nouveautés
    summary: { type: String },
    content: { type: String },
    author: { type: String },
    category: { type: String },

    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models['Announcement'] || mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
