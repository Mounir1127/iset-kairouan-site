const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/iset_kr';

mongoose.connect(uri).then(async () => {
    const User = mongoose.model('User', new mongoose.Schema({
        name: String,
        email: String,
        matricule: String,
        password: String,
        role: String,
        status: String
    }, { collection: 'users' }));

    // Update ADMIN001 to use BOTH possible passwords (or just set it to the one they tried)
    await User.findOneAndUpdate(
        { matricule: 'ADMIN001' },
        { password: 'password_admin_2024' },
        { upsert: true }
    );
    console.log('✅ ADMIN001 password updated to: password_admin_2024');

    // Create user 90475 if it doesn't exist
    await User.findOneAndUpdate(
        { matricule: '90475' },
        {
            name: 'Mounir User',
            email: 'mounir.90475@isetk.rnu.tn',
            password: 'm123123',
            role: 'staff',
            status: 'active'
        },
        { upsert: true }
    );
    console.log('✅ User 90475 created/updated with password: m123123');

    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
