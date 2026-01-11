const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/iset_kr';

mongoose.connect(uri).then(async () => {
    const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String, email: String, matricule: String }));
    const user = await User.findOne({ matricule: 'ADMIN001' });
    if (user) {
        console.log('ADMIN001 FOUND:', user.name, user.role);
    } else {
        console.log('ADMIN001 NOT FOUND');
    }
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
