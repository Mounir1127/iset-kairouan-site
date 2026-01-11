const { MongoClient } = require('mongodb');

async function migrate() {
    const sourceUri = 'mongodb://localhost:27017/iset_kr';
    const targetUri = 'mongodb://localhost:27017/iset_kairouan';

    const sourceClient = new MongoClient(sourceUri);
    const targetClient = new MongoClient(targetUri);

    try {
        await sourceClient.connect();
        await targetClient.connect();

        const sourceDb = sourceClient.db('iset_kr');
        const targetDb = targetClient.db('iset_kairouan');

        const collections = await sourceDb.listCollections().toArray();

        console.log(`Starting migration of ${collections.length} collections...`);

        for (const col of collections) {
            const name = col.name;
            console.log(`Migrating collection: ${name}`);

            // Clear target collection first
            await targetDb.collection(name).deleteMany({});

            const data = await sourceDb.collection(name).find({}).toArray();
            if (data.length > 0) {
                await targetDb.collection(name).insertMany(data);
                console.log(`✅ Migrated ${data.length} documents for ${name}`);
            } else {
                console.log(`ℹ️ Collection ${name} is empty`);
            }
        }

        console.log('✨ Migration completed successfully!');

    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        await sourceClient.close();
        await targetClient.close();
    }
}

migrate();
