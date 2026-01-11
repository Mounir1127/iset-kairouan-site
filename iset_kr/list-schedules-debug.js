const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/iset_kr';

mongoose.connect(uri).then(async () => {
    const Schedule = mongoose.model('Schedule', new mongoose.Schema({}, { strict: false, collection: 'schedules' }));
    const schedules = await Schedule.find({}).lean();
    console.log('--- SCHEDULES IN DB ---');
    console.log(JSON.stringify(schedules, null, 2));
    console.log('------------------------');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
