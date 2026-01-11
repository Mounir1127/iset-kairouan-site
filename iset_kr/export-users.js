const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { join } = require('path');
const fs = require('fs');

dotenv.config({ path: join(__dirname, '.env') });

const UserSchema = new mongoose.Schema({
    email: String,
    matricule: String,
    role: String,
    status: String,
    name: String
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function exportUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find().lean();
        fs.writeFileSync('users_export.json', JSON.stringify(users, null, 2));
        console.log(`Exported ${users.length} users to users_export.json`);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

exportUsers();
