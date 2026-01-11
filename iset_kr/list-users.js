const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/iset_kr';

mongoose.connect(uri).then(async () => {
    const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String, email: String }));
    const users = await User.find().limit(5);
    console.log('Sample Users:');
    users.forEach(u => console.log(` - ${u.name} (${u.role}) [${u.email}]`));
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
