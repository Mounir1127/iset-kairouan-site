const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/iset_kr';

mongoose.connect(uri).then(async () => {
    const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String }, { collection: 'users' }));
    const classgroups = await mongoose.connection.db.collection('classgroups').find({}).toArray();
    const subjects = await mongoose.connection.db.collection('subjects').find({}).toArray();
    const staff = await User.findOne({ role: 'staff' });

    console.log(JSON.stringify({
        staff_id: staff ? staff._id.toString() : 'NONE',
        classgroup_id: classgroups[0] ? classgroups[0]._id.toString() : 'NONE',
        subject_id: subjects[0] ? subjects[0]._id.toString() : 'NONE'
    }, null, 2));

    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
