const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { join } = require('path');

dotenv.config({ path: join(__dirname, '.env') });

const AnnouncementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['event', 'tender', 'news'], required: true },
    date: { type: Date, default: Date.now },
    publishDate: { type: Date, default: Date.now },
    image: { type: String },
    location: { type: String },
    summary: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const Announcement = mongoose.model('Announcement', AnnouncementSchema);

async function seedAnnouncementsWithImages() {
    const uri = process.env.MONGODB_URI;
    try {
        await mongoose.connect(uri);
        console.log('Connected to DB.');

        await Announcement.deleteMany({});

        const items = [
            {
                title: 'Workshop Cloud Computing',
                description: 'Apprenez les bases de AWS et Azure avec nos experts certifiés.',
                type: 'event',
                date: new Date('2024-05-20'),
                location: 'Labo Informatique 1',
                image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop'
            },
            {
                title: 'Journée Porte Ouvertes',
                description: 'Venez découvrir nos cursus et rencontrer nos enseignants.',
                type: 'event',
                date: new Date('2024-06-10'),
                location: 'Hall Principal',
                image: 'https://images.unsplash.com/photo-1523050853064-dbad350a758c?w=400&h=400&fit=crop'
            },
            {
                title: 'Appel d\'offre: Mobilier Bureau',
                description: 'Renouvellement du mobilier pour les salles de conférence du département génie mécanique.',
                type: 'tender',
                date: new Date(),
                image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=400&fit=crop'
            },
            {
                title: 'Partenariat Microsoft AI',
                summary: 'L\'ISET signe un accord historique pour l\'accès aux outils Azure AI.',
                description: 'Un nouvel accord vient d\'être signé pour permettre aux étudiants d\'utiliser gratuitement les outils IA de Microsoft.',
                type: 'news',
                image: 'https://images.unsplash.com/photo-1591453089816-0fbb971bac44?w=400&h=400&fit=crop'
            }
        ];

        await Announcement.insertMany(items);
        console.log('✅ Announcements with images seeded!');
    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seedAnnouncementsWithImages();
