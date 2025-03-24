import { MongoClient } from 'mongodb';

const uri = 'mongodb://admin:admin@localhost:27017/nestdb?authSource=admin';

async function initDatabase() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('nestdb');

    // Ensure the database exists by creating a collection
    await db.createCollection('placeholder').catch(() => console.log('Collection already exists.'));
    await db.collection('placeholder').drop();

    console.log('✅ Database "nestdb" initialized.');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    await client.close();
  }
}

initDatabase();
