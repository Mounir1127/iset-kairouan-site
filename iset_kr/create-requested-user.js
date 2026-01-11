const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { join } = require('path');

dotenv.config({ path: join(__dirname, '.env') });

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    matricule: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin', 'staff', 'chef'], default: 'student' },
    status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
    createdAt: { type: Date, default: Date.now }
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const email = 'mounirbelkhouja4@isetk.rnu.tn';

        // Remove existing if any (unlikely given previous search)
        await User.deleteOne({ email });

        const newUser = new User({
            name: 'Mounir Belkhouja',
            email: email,
            matricule: 'MB004',
            password: 'password123', // User can change it later
            role: 'admin',
            status: 'active'
        });

        await newUser.save();
        console.log(`✅ User created successfully: ${email}`);
        console.log(`Password: password123`);
    } catch (err) {
        console.error('❌ Error creating user:', err);
    } finally {
        await mongoose.disconnect();
    }
}

createUser();
