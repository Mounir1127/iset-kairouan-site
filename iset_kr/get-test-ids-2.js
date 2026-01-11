const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/iset_kr';

mongoose.connect(uri).then(async () => {
    const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String }, { collection: 'users' }));
    const staff = await User.findOne({ role: 'staff' });
    console.log('STAFF_ID=' + (staff ? staff._id.toString() : 'NONE'));

    const ClassGroup = mongoose.model('ClassGroup', new mongoose.Schema({ name: String }, { collection: 'classgroups' }));
    const classGroup = await ClassGroup.findOne({});
    console.log('CLASSGROUP_ID=' + (classGroup ? classGroup._id.toString() : 'NONE'));

    const Subject = mongoose.model('Subject', new mongoose.Schema({ name: String }, { collection: 'subjects' }));
    const subject = await Subject.findOne({});
    console.log('SUBJECT_ID=' + (subject ? subject._id.toString() : 'NONE'));

    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
