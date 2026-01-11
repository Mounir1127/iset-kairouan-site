const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { join } = require('path');

dotenv.config({ path: join(__dirname, '.env') });

const UserSchema = new mongoose.Schema({
    email: String,
    matricule: String,
    role: String,
    status: String,
    name: String
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function checkUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const email = 'mounirbelkhouja4@isetk.rnu.tn';

        console.log('--- Database Check ---');
        const count = await User.countDocuments();
        console.log(`Total users in DB: ${count}`);

        const exactUser = await User.findOne({ email });
        if (exactUser) {
            console.log('Exact match found:');
            console.log(JSON.stringify(exactUser, null, 2));
        } else {
            console.log('No exact match.');
            const similar = await User.find({ email: { $regex: /mounir/i } });
            console.log(`Similar users found: ${similar.length}`);
            similar.forEach(u => console.log(`- ${u.email} (${u.name})`));

            if (count > 0) {
                const sample = await User.find().limit(3);
                console.log('Sample users:');
                sample.forEach(u => console.log(`- ${u.email} [${u.role}]`));
            }
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

checkUser();
