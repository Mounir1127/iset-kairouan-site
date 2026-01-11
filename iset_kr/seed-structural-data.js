const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { join } = require('path');

dotenv.config({ path: join(__dirname, '.env') });

const dbUri = process.env.MONGODB_URI;

const DepartmentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true }
}, { timestamps: true });

const ClassGroupSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    level: { type: Number, required: true },
    section: { type: String, required: true }
}, { timestamps: true });

const ModuleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    credits: { type: Number, required: true },
    coefficient: { type: Number, required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true }
}, { timestamps: true });

const Department = mongoose.models.Department || mongoose.model('Department', DepartmentSchema);
const ClassGroup = mongoose.models.ClassGroup || mongoose.model('ClassGroup', ClassGroupSchema);
const Module = mongoose.models.Module || mongoose.model('Module', ModuleSchema);

async function seed() {
    try {
        await mongoose.connect(dbUri);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Department.deleteMany({});
        await ClassGroup.deleteMany({});
        await Module.deleteMany({});

        // 1. Seed Departments
        const depts = [
            { name: "Technologies de l'Informatique", code: 'TI' },
            { name: "Génie Mécanique", code: 'GM' },
            { name: "Génie Électrique", code: 'GE' },
            { name: "Administration des Affaires", code: 'AA' },
            { name: "Génie des Procédés", code: 'GP' }
        ];
        const savedDepts = await Department.insertMany(depts);
        console.log(`✅ Seeded ${savedDepts.length} departments`);

        const tiDept = savedDepts.find(d => d.code === 'TI');
        const geDept = savedDepts.find(d => d.code === 'GE');

        // 2. Seed ClassGroups
        const classes = [
            { name: 'DSI21', department: tiDept._id, level: 2, section: 'DSI' },
            { name: 'DSI22', department: tiDept._id, level: 2, section: 'DSI' },
            { name: 'RSI21', department: tiDept._id, level: 2, section: 'RSI' },
            { name: 'MDW21', department: tiDept._id, level: 2, section: 'MDW' },
            { name: 'EL11', department: geDept._id, level: 1, section: 'EL' }
        ];
        const savedClasses = await ClassGroup.insertMany(classes);
        console.log(`✅ Seeded ${savedClasses.length} classes`);

        // 3. Seed Modules
        const modules = [
            { name: 'Programmation Web PHP', code: 'DEV01', credits: 4, coefficient: 2, department: tiDept._id },
            { name: 'Base de données SQL', code: 'DB01', credits: 4, coefficient: 2, department: tiDept._id },
            { name: 'Développement Mobile Android', code: 'MOB01', credits: 4, coefficient: 2, department: tiDept._id },
            { name: 'Électronique de base', code: 'ELEC01', credits: 4, coefficient: 2, department: geDept._id }
        ];
        const savedModules = await Module.insertMany(modules);
        console.log(`✅ Seeded ${savedModules.length} modules`);

        console.log('✨ Structural data seeding completed');
    } catch (err) {
        console.error('❌ Seeding error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
