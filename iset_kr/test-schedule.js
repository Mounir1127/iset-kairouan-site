const axios = require('axios');
const mongoose = require('mongoose');

// Need real IDs. I will fetch them first.
async function test() {
    try {
        const baseUrl = 'http://localhost:4200/api';

        console.log('Fetching dependencies...');
        const classes = await axios.get(`${baseUrl}/public/classes`);
        if (classes.data.length === 0) throw new Error('No classes found');
        const classId = classes.data[0]._id;

        const subjects = await axios.get(`${baseUrl}/admin/subjects`);
        if (subjects.data.length === 0) throw new Error('No subjects found');
        const subjectId = subjects.data[0]._id;

        const users = await axios.get(`${baseUrl}/admin/users`);
        const staff = users.data.find(u => u.role === 'staff');
        if (!staff) throw new Error('No staff found');
        const staffId = staff._id;

        console.log('IDs found:', { classId, subjectId, staffId });

        const payload = {
            day: 'Lundi',
            startTime: '08:30',
            endTime: '10:00',
            module: '', // Simulate empty module
            subject: subjectId,
            classGroup: classId,
            staff: staffId,
            room: 'TestRoom',
            type: 'Cours'
        };

        console.log('Sending payload:', payload);

        try {
            const res = await axios.post(`${baseUrl}/admin/schedules`, payload);
            console.log('Success:', res.data);
        } catch (err) {
            console.log('Error status:', err.response?.status);
            console.log('Error data:', err.response?.data);
        }

    } catch (e) {
        console.error('Test failed:', e.message);
    }
}

test();
