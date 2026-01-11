const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { join } = require('path');

dotenv.config({ path: join(__dirname, '.env') });

const uri = process.env.MONGODB_URI;

mongoose.connect(uri).then(async () => {
    const count = await mongoose.connection.db.collection('announcements').countDocuments();
    console.log(`Announcements count in ${uri}: ${count}`);

    if (count > 0) {
        const items = await mongoose.connection.db.collection('announcements').find().limit(5).toArray();
        console.log('Sample items:', JSON.stringify(items, null, 2));
    }

    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
