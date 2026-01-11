const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { join } = require('path');

dotenv.config({ path: join(__dirname, '.env') });

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    matricule: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

async function createAdmin() {
    const uri = process.env.MONGODB_URI;
    console.log('--- DB SETUP ---');
    console.log('URI:', uri ? 'DEFINED' : 'MISSING');

    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ Connected.');

        const admin = {
            name: 'Admin ISET',
            email: 'admin.iset@isetk.rnu.tn',
            matricule: 'ADMIN001',
            password: 'password_admin_2024',
            role: 'admin',
            status: 'active'
        };

        const exists = await User.findOne({ email: admin.email });
        if (exists) {
            console.log('ℹ️ Admin already exists.');
        } else {
            await new User(admin).save();
            console.log('🚀 Admin created!');
        }
    } catch (err) {
        console.error('❌ Connection Failed:', err.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

createAdmin();
