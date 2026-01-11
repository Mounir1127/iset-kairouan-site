const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const { join } = require('path');

dotenv.config({ path: join(__dirname, '.env') });

async function listAll() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to:', uri);

        const admin = client.db().admin();
        const dbs = await admin.listDatabases();

        console.log('--- Databases ---');
        for (let dbPath of dbs.databases) {
            console.log(`- ${dbPath.name}`);
            const db = client.db(dbPath.name);
            const collections = await db.listCollections().toArray();
            collections.forEach(c => console.log(`  - ${c.name}`));
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
    }
}

listAll();
