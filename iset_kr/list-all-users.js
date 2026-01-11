const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/iset_kr';

mongoose.connect(uri).then(async () => {
    const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String, email: String, matricule: String, password: String }, { collection: 'users' }));
    const users = await User.find({});
    console.log('--- ALL USERS ---');
    users.forEach(u => {
        console.log(`Matricule: ${u.matricule} | Password: ${u.password} | Role: ${u.role}`);
    });
    console.log('------------------');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
