const mongoose = require('mongoose');

// dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iset_kr';

// Define schemas directly in the script to avoid import issues
const Schema = mongoose.Schema;

const MaterialSchema = new Schema({
    title: String,
    description: String,
    fileUrl: String,
    fileType: String,
    module: { type: Schema.Types.ObjectId, ref: 'Module' },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const ClaimSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User' },
    module: { type: Schema.Types.ObjectId, ref: 'Module' },
    subject: String,
    description: String,
    status: { type: String, enum: ['pending', 'resolved', 'rejected'], default: 'pending' }
}, { timestamps: true });

const ScheduleSchema = new Schema({
    staff: { type: Schema.Types.ObjectId, ref: 'User' },
    module: { type: Schema.Types.ObjectId, ref: 'Module' },
    classGroup: { type: Schema.Types.ObjectId, ref: 'ClassGroup' },
    day: String,
    startTime: String,
    endTime: String,
    room: String,
    type: { type: String, enum: ['Cours', 'TD', 'TP', 'DS', 'Examen'] }
}, { timestamps: true });

const Material = mongoose.models.Material || mongoose.model('Material', MaterialSchema);
const Claim = mongoose.models.Claim || mongoose.model('Claim', ClaimSchema);
const Schedule = mongoose.models.Schedule || mongoose.model('Schedule', ScheduleSchema);

// Need existing models for lookups
const User = mongoose.models.User || mongoose.model('User', new Schema({ role: String, name: String }));
const Module = mongoose.models.Module || mongoose.model('Module', new Schema({ name: String }));
const Department = mongoose.models.Department || mongoose.model('Department', new Schema({ name: String }));
const ClassGroup = mongoose.models.ClassGroup || mongoose.model('ClassGroup', new Schema({ name: String }));

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        let staff = await User.findOne({ role: 'staff' });
        if (!staff) {
            console.log('No staff user found. Creating one...');
            staff = await User.create({
                name: 'Dr. Ahmed Enseignant',
                email: 'staff@iset.tn',
                password: 'password123',
                role: 'staff',
                matricule: 'STF001'
            });
        }

        const students = await User.find({ role: 'student' }).limit(5);
        let modules = await Module.find().limit(3);
        if (modules.length === 0) {
            console.log('No modules found. Creating some...');
            modules = await Module.insertMany([
                { name: 'Architectures Logicielles' },
                { name: 'Développement Web Avancé' },
                { name: 'Base de Données' }
            ]);
        }

        let classes = await ClassGroup.find().limit(3);
        if (classes.length === 0) {
            console.log('No classes found. Creating some...');
            classes = await ClassGroup.insertMany([
                { name: 'DSI 3.1' },
                { name: 'DSI 3.2' },
                { name: 'RSI 2.1' }
            ]);
        }

        await Material.deleteMany({});
        await Claim.deleteMany({});
        await Schedule.deleteMany({});

        // Materials
        await Material.insertMany([
            { title: 'Chapitre 1: Introduction MVC', description: 'Concepts de base et architectures n-tiers.', fileUrl: '/uploads/materials/ch1.pdf', fileType: 'pdf', module: modules[0]._id, uploadedBy: staff._id },
            { title: 'Slides Angular Advanced', description: 'Directives, Pipes et RxJS.', fileUrl: '/uploads/materials/angular.pptx', fileType: 'pptx', module: modules[1] ? modules[1]._id : modules[0]._id, uploadedBy: staff._id }
        ]);

        // Claims
        if (students.length > 0) {
            await Claim.insertMany([
                { student: students[0]._id, module: modules[0]._id, subject: 'Correction Note DS', description: 'Erreur de saisie sur ma note de DS.', status: 'pending' },
                { student: students[1] ? students[1]._id : students[0]._id, module: modules[0]._id, subject: 'Absence Justifiée', description: 'J\'étais malade lors de la séance du 15/01.', status: 'pending' }
            ]);
        }

        // Schedule
        await Schedule.insertMany([
            { staff: staff._id, module: modules[0]._id, classGroup: classes[0]._id, day: 'Lundi', startTime: '08:30', endTime: '10:00', room: 'Salle 102', type: 'Cours' },
            { staff: staff._id, module: modules[1] ? modules[1]._id : modules[0]._id, classGroup: classes[0]._id, day: 'Mardi', startTime: '14:00', endTime: '15:30', room: 'Lab 08', type: 'TP' }
        ]);

        console.log('Seed successful!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
