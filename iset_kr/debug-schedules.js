
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { join } = require('path');

dotenv.config({ path: join(__dirname, '.env') });

async function checkSchedules() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/iset_kr');
        console.log('Connected to DB');

        const Schedule = mongoose.model('Schedule', new mongoose.Schema({}, { strict: false }));
        const ClassGroup = mongoose.model('ClassGroup', new mongoose.Schema({}, { strict: false }));
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

        const schedules = await Schedule.find({}).lean();
        console.log(`Total schedules found: ${schedules.length}`);
        if (schedules.length > 0) {
            console.log('Sample Schedule:', JSON.stringify(schedules[0], null, 2));
        }

        const classes = await ClassGroup.find({}).lean();
        console.log(`Total classes found: ${classes.length}`);
        classes.forEach(c => console.log(`- Class: ${c.name} (ID: ${c._id})`));

        // Check a student user
        const student = await User.findOne({ role: 'student' }).lean();
        if (student) {
            console.log(`Sample Student: ${student.name} (Role: ${student.role}, ClassGroup: ${student.classGroup})`);
            if (student.classGroup) {
                const studentSchedules = await Schedule.find({ classGroup: student.classGroup }).lean();
                console.log(`Schedules for this student's class: ${studentSchedules.length}`);
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkSchedules();
