const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/iset_kr';

mongoose.connect(uri).then(async () => {
    const classgroups = await mongoose.connection.db.collection('classgroups').find({}).toArray();
    console.log('--- CLASS GROUPS ---');
    classgroups.forEach(c => console.log(` - ${c.name}: ${c._id.toString()}`));
    console.log('--------------------');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
