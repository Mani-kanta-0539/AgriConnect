import postgres from 'postgres';

const sql = postgres('postgresql://postgresManikanta$359@db.ipcxfwklhpqbhlfqxfpc.supabase.co:5432/postgres', { ssl: 'require' });

async function initDb() {
  try {
    console.log('Creating profiles table...');
    await sql`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        name TEXT,
        email TEXT,
        location TEXT,
        phone TEXT,
        farm_size TEXT,
        primary_crops TEXT,
        experience TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    console.log('Creating iot_data table...');
    await sql`
      CREATE TABLE IF NOT EXISTS iot_data (
        id SERIAL PRIMARY KEY,
        device_id TEXT NOT NULL,
        temperature NUMERIC,
        humidity NUMERIC,
        soil_moisture NUMERIC,
        nutrients NUMERIC,
        sun_intensity NUMERIC,
        motor_status BOOLEAN,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    console.log('Creating iot_control table...');
    await sql`
      CREATE TABLE IF NOT EXISTS iot_control (
        device_id TEXT PRIMARY KEY,
        motor_status BOOLEAN DEFAULT false,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    // Insert default control row
    await sql`
      INSERT INTO iot_control (device_id, motor_status)
      VALUES ('device_1', false)
      ON CONFLICT (device_id) DO NOTHING;
    `;

    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await sql.end();
  }
}

initDb();
