const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { join } = require('path');

dotenv.config({ path: join(__dirname, '.env') });

const DepartmentSchema = new mongoose.Schema({
    name: String,
    code: String
}, { strict: false });

const Department = mongoose.models.Department || mongoose.model('Department', DepartmentSchema);

async function checkDepartments() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const departments = await Department.find();
        console.log('--- Departments in Database ---');
        console.log(`Count: ${departments.length}`);
        console.log(JSON.stringify(departments, null, 2));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

checkDepartments();
