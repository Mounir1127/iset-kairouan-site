const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { join } = require('path');

dotenv.config({ path: join(__dirname, '.env') });

async function debugDepts() {
    try {
        console.log('Using URI:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB:', mongoose.connection.name);

        const depts = await mongoose.connection.db.collection('departments').find().toArray();
        console.log('Found', depts.length, 'departments in "departments" collection:');
        depts.forEach(d => console.log(`- ${d.name} (${d.code}) ID: ${d._id}`));

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

debugDepts();
