const mongoose = require('mongoose');

// Define Subject schema directly
const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

const Subject = mongoose.model('Subject', subjectSchema);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iset_kairouan';

const subjects = [
    // Département Informatique
    { name: 'Mathématiques appliquées à l\'informatique', code: 'MATH-INFO', description: 'Mathématiques pour l\'informatique' },
    { name: 'Algorithmique et programmation', code: 'ALGO-PROG', description: 'C, Java, Python' },
    { name: 'Structures de données', code: 'STRUCT-DATA', description: 'Listes, arbres, graphes' },
    { name: 'Bases de données', code: 'BDD', description: 'SQL, NoSQL' },
    { name: 'Systèmes d\'exploitation', code: 'SYS-EXPLOIT', description: 'Linux, Windows' },
    { name: 'Réseaux informatiques', code: 'RESEAUX', description: 'TCP/IP, routage' },
    { name: 'Développement web', code: 'DEV-WEB', description: 'HTML, CSS, JavaScript' },
    { name: 'Programmation orientée objet', code: 'POO', description: 'Java, C++' },
    { name: 'Architecture des ordinateurs', code: 'ARCH-ORDI', description: 'Processeurs, mémoire' },
    { name: 'Anglais technique informatique', code: 'ANG-TECH-INFO', description: 'Anglais professionnel' },

    // Département Génie Électrique
    { name: 'Électrotechnique', code: 'ELECTRO', description: 'Circuits électriques' },
    { name: 'Électronique numérique et analogique', code: 'ELEC-NUM-ANA', description: 'Transistors, portes logiques' },
    { name: 'Automatismes industriels', code: 'AUTO-INDUS', description: 'Automates PLC' },
    { name: 'Mesure et métrologie', code: 'MES-METRO', description: 'Capteurs, instruments' },
    { name: 'Machines électriques', code: 'MACH-ELEC', description: 'Moteurs, transformateurs' },
    { name: 'Systèmes de régulation', code: 'SYS-REGUL', description: 'Asservissement' },
    { name: 'Réseaux électriques', code: 'RES-ELEC', description: 'Distribution HT/BT' },
    { name: 'Informatique industrielle', code: 'INFO-INDUS', description: 'Supervision, SCADA' },

    // Département Génie Mécanique
    { name: 'Mécanique générale', code: 'MECA-GEN', description: 'Statique, dynamique' },
    { name: 'Résistance des matériaux', code: 'RDM', description: 'Contraintes, déformations' },
    { name: 'Matériaux industriels', code: 'MAT-INDUS', description: 'Aciers, alliages' },
    { name: 'Dessin technique / CAO', code: 'DESSIN-CAO', description: 'AutoCAD, SolidWorks' },
    { name: 'Thermodynamique', code: 'THERMO', description: 'Transferts thermiques' },
    { name: 'Fabrication mécanique', code: 'FAB-MECA', description: 'Usinage, tournage' },
    { name: 'Maintenance industrielle', code: 'MAINT-INDUS', description: 'Préventive, corrective' },
    { name: 'Automatique appliquée', code: 'AUTO-APPL', description: 'Systèmes automatisés' },

    // Département Sciences Économiques
    { name: 'Principes de gestion et management', code: 'GEST-MGMT', description: 'Management des organisations' },
    { name: 'Comptabilité générale', code: 'COMPTA-GEN', description: 'Plan comptable' },
    { name: 'Comptabilité de gestion', code: 'COMPTA-GEST', description: 'Contrôle de gestion' },
    { name: 'Finance d\'entreprise', code: 'FIN-ENTR', description: 'Gestion financière' },
    { name: 'Économie générale', code: 'ECO-GEN', description: 'Micro et macro-économie' },
    { name: 'Marketing et techniques de vente', code: 'MARK-VENTE', description: 'Stratégies commerciales' },
    { name: 'Droit commercial / droit des affaires', code: 'DROIT-COM', description: 'Droit des sociétés' },
    { name: 'Statistiques appliquées', code: 'STAT-APPL', description: 'Probabilités, tests' },
    { name: 'Analyse financière', code: 'ANAL-FIN', description: 'Ratios, diagnostic' },
    { name: 'Gestion des ressources humaines', code: 'GRH', description: 'Recrutement, formation' }
];

async function seedSubjects() {
    try {
        console.log('🔌 Connexion à MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connecté à MongoDB\n');

        let inserted = 0;
        let skipped = 0;

        for (const subject of subjects) {
            try {
                const exists = await Subject.findOne({ code: subject.code });
                if (exists) {
                    console.log(`⊘ Déjà existante: ${subject.name}`);
                    skipped++;
                } else {
                    await Subject.create(subject);
                    console.log(`✓ Ajouté: ${subject.name} [${subject.code}]`);
                    inserted++;
                }
            } catch (err) {
                console.log(`⚠ Erreur pour ${subject.name}:`, err.message);
            }
        }

        console.log('\n========== RÉSUMÉ ==========');
        console.log(`📚 Total: ${subjects.length} matières`);
        console.log(`✅ Nouvelles: ${inserted}`);
        console.log(`⊘ Déjà existantes: ${skipped}`);
        console.log('============================');
        console.log('✓ Terminé!\n');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

seedSubjects();
