const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/iset_kr';

console.log('Testing connection to local Mongo:', uri);

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
}).then(() => {
    console.log('LOCAL CONNECTION SUCCESSFUL!');
    process.exit(0);
}).catch(err => {
    console.error('LOCAL CONNECTION FAILED:');
    console.error(err);
    process.exit(1);
});
