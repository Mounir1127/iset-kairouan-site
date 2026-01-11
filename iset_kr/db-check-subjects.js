const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/iset_kr';

mongoose.connect(uri).then(async () => {
    const Subject = mongoose.model('Subject', new mongoose.Schema({ name: String }, { collection: 'subjects' }));
    const subjects = await Subject.find({});
    console.log('--- SUBJECTS ---');
    subjects.forEach(s => console.log(` - ${s.name} (${s._id})`));

    const Schedule = mongoose.model('Schedule', new mongoose.Schema({}, { strict: false, collection: 'schedules' }));
    const count = await Schedule.countDocuments();
    console.log('--- SCHEDULE COUNT: ', count);

    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
