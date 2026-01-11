const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { join } = require('path');

dotenv.config({ path: join(__dirname, '.env') });

const uri = process.env.MONGODB_URI;

console.log('Testing connection to:', uri.replace(/:([^@]+)@/, ':****@'));

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
}).then(() => {
    console.log('CONNECTED successfully!');
    process.exit(0);
}).catch(err => {
    console.error('FAILED to connect:');
    console.error(err);
    process.exit(1);
});
