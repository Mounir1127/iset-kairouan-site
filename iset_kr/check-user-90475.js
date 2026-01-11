const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/iset_kr';

mongoose.connect(uri).then(async () => {
    const rawUsers = await mongoose.connection.db.collection('users').find({ matricule: '90475' }).toArray();
    console.log('--- USER 90475 ---');
    console.log(JSON.stringify(rawUsers, null, 2));
    console.log('------------------');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
