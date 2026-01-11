const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { join } = require('path');

dotenv.config({ path: join(__dirname, '.env') });

const AnnouncementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['event', 'tender', 'news'], required: true },
    date: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const Announcement = mongoose.model('Announcement', AnnouncementSchema);

async function seedAnnouncements() {
    const uri = process.env.MONGODB_URI;
    try {
        await mongoose.connect(uri);
        console.log('Connected to DB.');

        // Clear existing
        await Announcement.deleteMany({});

        const items = [
            {
                title: 'Conférence IA & Éducation',
                description: 'Une conférence sur l\'impact de l\'intelligence artificielle dans l\'enseignement supérieur.',
                type: 'event',
                date: new Date('2024-05-15')
            },
            {
                title: 'Hackathon ISET 2024',
                description: '24 heures de code non-stop pour résoudre des problèmes concrets de la région.',
                type: 'event',
                date: new Date('2024-06-01')
            },
            {
                title: 'Appel d\'offre: Serveurs HPE',
                description: 'Acquisition de serveurs haute performance pour le centre de calcul de l\'ISET.',
                type: 'tender',
                date: new Date()
            },
            {
                title: 'Maintenance Réseau Fibre',
                description: 'Appel d\'offre pour la maintenance annuelle de l\'infrastructure fibre optique du campus.',
                type: 'tender',
                date: new Date()
            },
            {
                title: 'Nouveaux Masters Disponibles',
                description: 'Ouverture des inscriptions pour deux nouveaux masters professionnels en IoT et Sécurité.',
                type: 'news',
                createdAt: new Date()
            },
            {
                title: 'Partenariat avec Google Cloud',
                description: 'L\'ISET Kairouan devient partenaire officiel Google Cloud for Education.',
                type: 'news',
                createdAt: new Date()
            }
        ];

        await Announcement.insertMany(items);
        console.log('✅ Demo announcements seeded successfully!');
    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seedAnnouncements();
