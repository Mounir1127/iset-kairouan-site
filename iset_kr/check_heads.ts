import mongoose from 'mongoose';
import User from './src/models/User';
import Department from './src/models/Department';
import * as dotenv from 'dotenv';
import { join } from 'node:path';

const envPath = join(process.cwd(), '.env');
dotenv.config({ path: envPath });

async function check() {
    try {
        await mongoose.connect(process.env['MONGODB_URI'] || 'mongodb://localhost:27017/iset_kr');
        console.log('--- Departments ---');
        const depts = await Department.find().populate('headOfDepartment');
        depts.forEach(d => {
            console.log(`Dept: ${d.name} (${d.code})`);
            if (d.headOfDepartment) {
                console.log(`  Head: ${d.headOfDepartment.name} (Role: ${d.headOfDepartment.role})`);
            } else {
                console.log('  Head: NOT ASSIGNED');
            }
        });

        console.log('\n--- Users with role "chef" ---');
        const chefs = await User.find({ role: 'chef' });
        chefs.forEach(c => {
            console.log(`Chef: ${c.name} (${c.email})`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

check();
