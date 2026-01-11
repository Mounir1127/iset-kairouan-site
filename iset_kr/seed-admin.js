const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { join } = require('path');

dotenv.config({ path: join(__dirname, '.env') });

const uri = 'mongodb://localhost:27017/iset_kr';

mongoose.connect(uri).then(async () => {
    const UserSchema = new mongoose.Schema({
        name: String,
        email: String,
        matricule: String,
        password: String,
        role: String,
        status: String
    }, { collection: 'users' });

    const User = mongoose.model('User', UserSchema);

    const admin = await User.findOne({ matricule: 'ADMIN001' });
    if (!admin) {
        console.log('Creating Admin User...');
        await User.create({
            name: 'Mounir Admin',
            email: 'admin@iset.tn',
            matricule: 'ADMIN001',
            password: 'admin_password', // Should be hashed in real app
            role: 'admin',
            status: 'active'
        });
        console.log('Admin User Created Successfully!');
    } else {
        console.log('Admin User Already Exists:', admin.name);
    }
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
