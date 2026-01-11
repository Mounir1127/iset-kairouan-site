const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { join } = require('path');

dotenv.config({ path: join(__dirname, '.env') });

const AnnouncementSchema = new mongoose.Schema({
    type: { type: String, enum: ['event', 'tender', 'news'], required: true },
    title: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published', 'archived', 'cancelled'], default: 'published' },
    publishDate: { type: Date, default: Date.now },
    image: { type: String },
    description: { type: String },
    eventType: { type: String },
    startDate: { type: Date },
    location: { type: String },
    organizer: { type: String },
    reference: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const Announcement = mongoose.model('Announcement', AnnouncementSchema);

async function addExamples() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connecté à la base de données.');

        const examples = [
            {
                type: 'event',
                title: 'Journée Scientifique : IA & Futur',
                description: 'Une journée dédiée aux avancées de l\'Intelligence Artificielle.',
                eventType: 'journée scientifique',
                startDate: new Date('2024-12-22'),
                location: 'Amphi Principal',
                organizer: 'Département Informatique',
                image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=800&fit=crop',
                status: 'published'
            },
            {
                type: 'tender',
                title: 'Acquisition de Matériel Réseau',
                description: 'Appel d\'offre pour le renouvellement des équipements Cisco.',
                reference: 'AO/2024/015',
                image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc4b?w=600&h=800&fit=crop',
                status: 'published'
            },
            {
                type: 'news',
                title: 'Nouveau Partenariat avec Sousse',
                description: 'Signature d\'un accord de mobilité étudiante.',
                image: 'https://images.unsplash.com/photo-1523240715630-9918c138194b?w=600&h=800&fit=crop',
                status: 'published'
            }
        ];

        await Announcement.insertMany(examples);
        console.log('✅ 3 nouveaux exemples ajoutés avec succès !');
    } catch (err) {
        console.error('❌ Erreur:', err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

addExamples();
