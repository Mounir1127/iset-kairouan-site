import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { join } from 'path';

const envPath = join(process.cwd(), '.env');
dotenv.config({ path: envPath });

async function listUsers() {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/iset_kairouan';
        await mongoose.connect(uri);

        const UserSchema = new mongoose.Schema({
            name: String,
            email: String,
            matricule: String,
            role: String
        }, { strict: false });

        const User = mongoose.models['User'] || mongoose.model('User', UserSchema);

        const users = await User.find({}, 'name email matricule role');
        console.log('--- USER LIST ---');
        users.forEach(u => {
            console.log(`Name: ${u.name} | Email: ${u.email} | Matricule: ${u.matricule} | Role: ${u.role}`);
        });
        console.log('-----------------');

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

listUsers();
