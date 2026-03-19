const db = require('./config/database');

async function migrate() {
  try {
    await db.execute('ALTER TABLE users ADD COLUMN avatar_url VARCHAR(255) DEFAULT NULL;');
    console.log('Migration successful: added avatar_url column to users table.');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('Migration skipped: avatar_url column already exists.');
    } else {
      console.error('Migration failed:', error);
    }
  } finally {
    process.exit(0);
  }
}

migrate();
